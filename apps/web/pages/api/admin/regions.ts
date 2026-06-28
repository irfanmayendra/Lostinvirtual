import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ROLE_LEVELS, auditLog } from "@/lib/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // GET - List regions
    if (req.method === "GET") {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, parseInt(req.query.limit as string) || 15);
      const skip = (page - 1) * limit;
      const search = (req.query.search as string) || "";
      const sortBy = (req.query.sortBy as string) || "citizenCount";
      const sortOrder = (req.query.sortOrder as string) || "desc";

      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { countryCode: { contains: search, mode: "insensitive" } },
        ];
      }

      const orderBy: any = {};
      if (sortBy === "name") {
        orderBy.name = sortOrder;
      } else {
        orderBy.citizenCount = sortOrder;
      }

      const [regions, total] = await Promise.all([
        prisma.region.findMany({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.region.count({ where }),
      ]);

      return res.status(200).json({ data: regions, total, page, limit });
    }

    // POST - Create region
    if (req.method === "POST") {
      const { name, countryCode, latitude, longitude, zoomLevel } = req.body;

      if (!name || !countryCode) {
        return res.status(400).json({ error: "name and countryCode are required" });
      }

      // Check unique countryCode
      const existing = await prisma.region.findUnique({
        where: { countryCode },
      });
      if (existing) {
        return res.status(409).json({ error: "Country code already exists" });
      }

      const region = await prisma.region.create({
        data: {
          name,
          countryCode: countryCode.toUpperCase(),
          latitude: parseFloat(latitude) || 0,
          longitude: parseFloat(longitude) || 0,
          zoomLevel: parseInt(zoomLevel) || 5,
          citizenCount: 0,
        },
      });

      await auditLog({
        userId: adminUser.id,
        action: "region.create",
        entity: "region",
        entityId: region.id,
        details: { name, countryCode },
      });

      return res.status(201).json({ region });
    }

    // PATCH - Update region
    if (req.method === "PATCH") {
      const { id, name, countryCode, latitude, longitude, zoomLevel } = req.body;

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      const data: any = {};
      if (name !== undefined) data.name = name;
      if (countryCode !== undefined) data.countryCode = countryCode.toUpperCase();
      if (latitude !== undefined) data.latitude = parseFloat(latitude);
      if (longitude !== undefined) data.longitude = parseFloat(longitude);
      if (zoomLevel !== undefined) data.zoomLevel = parseInt(zoomLevel);

      // If changing countryCode, check uniqueness
      if (countryCode !== undefined) {
        const conflict = await prisma.region.findFirst({
          where: { countryCode: countryCode.toUpperCase(), NOT: { id } },
        });
        if (conflict) {
          return res.status(409).json({ error: "Country code already exists" });
        }
      }

      const region = await prisma.region.update({
        where: { id },
        data,
      });

      await auditLog({
        userId: adminUser.id,
        action: "region.update",
        entity: "region",
        entityId: id,
        details: data,
      });

      return res.status(200).json({ region });
    }

    // DELETE - Delete region
    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      // Check if region has citizens
      const citizenCount = await prisma.citizen.count({
        where: { regionId: id },
      });

      if (citizenCount > 0) {
        return res.status(409).json({
          error: "Cannot delete region with linked citizens",
          citizenCount,
        });
      }

      await prisma.region.delete({ where: { id } });

      await auditLog({
        userId: adminUser.id,
        action: "region.delete",
        entity: "region",
        entityId: id,
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Regions API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
