import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ROLE_LEVELS } from "@/lib/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check session
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get admin user from DB
    const adminUser = await prisma.user.findFirst({
      where: { email: session.user.email || "" },
    });
    if (!adminUser) {
      return res.status(401).json({ error: "User not found" });
    }

    // Verify role >= ADMIN (80)
    const adminLevel = ROLE_LEVELS[adminUser.role as keyof typeof ROLE_LEVELS] ?? 0;
    if (adminLevel < 80) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    // Date 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Run all queries in parallel
    const [
      totalCitizens,
      totalTokens,
      totalRegions,
      totalUsers,
      citizensPerRegion,
      tokensByStatus,
      tokensByType,
      recentCitizens,
      recentUsers,
      topCountries,
    ] = await Promise.all([
      // Total counts
      prisma.citizen.count(),
      prisma.token.count(),
      prisma.region.count(),
      prisma.user.count(),

      // Citizens per region (top 10)
      prisma.region.findMany({
        select: {
          id: true,
          name: true,
          countryCode: true,
          citizenCount: true,
        },
        orderBy: { citizenCount: "desc" },
        take: 10,
      }),

      // Tokens by status
      prisma.token.groupBy({
        by: ["status"],
        _count: { id: true },
      }),

      // Tokens by merchandise type
      prisma.token.groupBy({
        by: ["merchandiseType"],
        _count: { id: true },
      }),

      // New citizens per month (last 6 months)
      prisma.citizen.findMany({
        where: {
          activatedAt: { gte: sixMonthsAgo },
        },
        select: { activatedAt: true },
      }),

      // New users per month (last 6 months)
      prisma.user.findMany({
        where: {
          createdAt: { gte: sixMonthsAgo },
        },
        select: { createdAt: true },
      }),

      // Top 5 countries by citizen count
      prisma.citizen.groupBy({
        by: ["countryCode"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ]);

    // Process monthly data for citizens
    const monthLabels: string[] = [];
    const citizenMonthCounts: Record<string, number> = {};
    const userMonthCounts: Record<string, number> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      monthLabels.push(label);
      citizenMonthCounts[key] = 0;
      userMonthCounts[key] = 0;
    }

    recentCitizens.forEach((c) => {
      const d = new Date(c.activatedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (citizenMonthCounts[key] !== undefined) {
        citizenMonthCounts[key]++;
      }
    });

    recentUsers.forEach((u) => {
      const d = new Date(u.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (userMonthCounts[key] !== undefined) {
        userMonthCounts[key]++;
      }
    });

    const citizensPerMonth = monthLabels.map((label, i) => {
      const keys = Object.keys(citizenMonthCounts);
      return { month: label, count: citizenMonthCounts[keys[i]] || 0 };
    });

    const usersPerMonth = monthLabels.map((label, i) => {
      const keys = Object.keys(userMonthCounts);
      return { month: label, count: userMonthCounts[keys[i]] || 0 };
    });

    // Process tokens by status
    const statusMap: Record<string, number> = { UNUSED: 0, ACTIVATED: 0, SUSPENDED: 0 };
    tokensByStatus.forEach((s) => {
      statusMap[s.status] = s._count.id;
    });

    // Process tokens by type
    const typeMap: Record<string, number> = { TSHIRT: 0, HOODIE: 0, JACKET: 0, CAP: 0 };
    tokensByType.forEach((t) => {
      typeMap[t.merchandiseType] = t._count.id;
    });

    // Process top countries
    const countryData = topCountries.map((c) => ({
      countryCode: c.countryCode,
      count: c._count.id,
    }));

    return res.status(200).json({
      overview: {
        totalCitizens,
        totalTokens,
        totalRegions,
        totalUsers,
      },
      citizensPerRegion: citizensPerRegion.map((r) => ({
        name: r.name,
        code: r.countryCode,
        count: r.citizenCount,
      })),
      tokensByStatus: Object.entries(statusMap).map(([status, count]) => ({
        status,
        count,
      })),
      tokensByType: Object.entries(typeMap).map(([type, count]) => ({
        type,
        count,
      })),
      citizensPerMonth,
      usersPerMonth,
      topCountries: countryData,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
