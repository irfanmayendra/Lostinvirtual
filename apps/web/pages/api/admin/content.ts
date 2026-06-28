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

    // GET - List page content
    if (req.method === "GET") {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, parseInt(req.query.limit as string) || 50);
      const skip = (page - 1) * limit;
      const pageFilter = (req.query.pageFilter as string) || "";
      const section = (req.query.section as string) || "";
      const search = (req.query.search as string) || "";

      const where: any = {};
      if (pageFilter) where.page = pageFilter;
      if (section) where.section = section;
      if (search) {
        where.OR = [
          { key: { contains: search, mode: "insensitive" } },
          { value: { contains: search, mode: "insensitive" } },
          { section: { contains: search, mode: "insensitive" } },
        ];
      }

      const [data, total] = await Promise.all([
        prisma.pageContent.findMany({
          where,
          orderBy: [{ page: "asc" }, { section: "asc" }, { order: "asc" }, { key: "asc" }],
          skip,
          take: limit,
        }),
        prisma.pageContent.count({ where }),
      ]);

      return res.status(200).json({ data, total, page, limit });
    }

    // POST - Create new page content
    if (req.method === "POST") {
      const { page: pg, section, key, value, type, order } = req.body;

      if (!pg || !section || !key || value === undefined) {
        return res.status(400).json({ error: "page, section, key, and value are required" });
      }

      // Check uniqueness
      const existing = await prisma.pageContent.findUnique({
        where: { page_section_key: { page: pg, section, key } },
      });
      if (existing) {
        return res.status(409).json({ error: "Content entry already exists for this page/section/key combination" });
      }

      const entry = await prisma.pageContent.create({
        data: {
          page: pg,
          section,
          key,
          value: String(value),
          type: type || "text",
          order: order ?? 0,
        },
      });

      await auditLog({
        userId: adminUser.id,
        action: "content.create",
        entity: "page_content",
        entityId: entry.id,
        details: { page: pg, section, key },
      });

      return res.status(201).json({ data: entry });
    }

    // PATCH - Update page content
    if (req.method === "PATCH") {
      const { id, value, type, order } = req.body;

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      const updateData: any = {};
      if (value !== undefined) updateData.value = String(value);
      if (type !== undefined) updateData.type = type;
      if (order !== undefined) updateData.order = order;

      const entry = await prisma.pageContent.update({
        where: { id },
        data: updateData,
      });

      await auditLog({
        userId: adminUser.id,
        action: "content.update",
        entity: "page_content",
        entityId: id,
        details: { page: entry.page, section: entry.section, key: entry.key },
      });

      return res.status(200).json({ data: entry });
    }

    // DELETE - Delete page content
    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      const entry = await prisma.pageContent.findUnique({ where: { id } });
      if (!entry) {
        return res.status(404).json({ error: "Content entry not found" });
      }

      await prisma.pageContent.delete({ where: { id } });

      await auditLog({
        userId: adminUser.id,
        action: "content.delete",
        entity: "page_content",
        entityId: id,
        details: { page: entry.page, section: entry.section, key: entry.key },
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Content API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
