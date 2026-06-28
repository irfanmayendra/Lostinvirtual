import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ROLE_LEVELS, auditLog } from "@/lib/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Auth check
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const adminUser = await prisma.user.findFirst({
      where: { email: session.user.email || "" },
    });
    if (!adminUser) {
      return res.status(401).json({ error: "User not found" });
    }

    const adminLevel = ROLE_LEVELS[adminUser.role as keyof typeof ROLE_LEVELS] ?? 0;
    if (adminLevel < 80) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    // GET - List SEO settings
    if (req.method === "GET") {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, parseInt(req.query.limit as string) || 15);
      const skip = (page - 1) * limit;
      const pageFilter = (req.query.pageFilter as string) || "";
      const search = (req.query.search as string) || "";

      const where: any = {};
      if (pageFilter) where.page = pageFilter;
      if (search) {
        where.OR = [
          { page: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const [data, total] = await Promise.all([
        prisma.seoSetting.findMany({
          where,
          orderBy: { page: "asc" },
          skip,
          take: limit,
        }),
        prisma.seoSetting.count({ where }),
      ]);

      return res.status(200).json({ data, total, page, limit });
    }

    // POST - Create SEO setting
    if (req.method === "POST") {
      const { page: pg, title, description, ogImage, keywords } = req.body;

      if (!pg) {
        return res.status(400).json({ error: "page is required" });
      }

      // Check uniqueness
      const existing = await prisma.seoSetting.findUnique({
        where: { page: pg },
      });
      if (existing) {
        return res.status(409).json({ error: "SEO setting already exists for this page" });
      }

      const entry = await prisma.seoSetting.create({
        data: {
          page: pg,
          title: title || null,
          description: description || null,
          ogImage: ogImage || null,
          keywords: keywords || null,
        },
      });

      await auditLog({
        userId: adminUser.id,
        action: "seo.create",
        entity: "seo_setting",
        entityId: entry.id,
        details: { page: pg },
      });

      return res.status(201).json({ data: entry });
    }

    // PATCH - Update SEO setting
    if (req.method === "PATCH") {
      const { id, title, description, ogImage, keywords } = req.body;

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title || null;
      if (description !== undefined) updateData.description = description || null;
      if (ogImage !== undefined) updateData.ogImage = ogImage || null;
      if (keywords !== undefined) updateData.keywords = keywords || null;

      const entry = await prisma.seoSetting.update({
        where: { id },
        data: updateData,
      });

      await auditLog({
        userId: adminUser.id,
        action: "seo.update",
        entity: "seo_setting",
        entityId: id,
        details: { page: entry.page },
      });

      return res.status(200).json({ data: entry });
    }

    // DELETE - Delete SEO setting
    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      const entry = await prisma.seoSetting.findUnique({ where: { id } });
      if (!entry) {
        return res.status(404).json({ error: "SEO setting not found" });
      }

      await prisma.seoSetting.delete({ where: { id } });

      await auditLog({
        userId: adminUser.id,
        action: "seo.delete",
        entity: "seo_setting",
        entityId: id,
        details: { page: entry.page },
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("SEO API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
