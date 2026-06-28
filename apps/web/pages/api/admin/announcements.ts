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

    // GET - List announcements
    if (req.method === "GET") {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, parseInt(req.query.limit as string) || 15);
      const skip = (page - 1) * limit;
      const active = req.query.active as string;
      const type = req.query.type as string;
      const search = (req.query.search as string) || "";

      const where: any = {};
      if (active === "true") where.active = true;
      if (active === "false") where.active = false;
      if (type) where.type = type;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ];
      }

      const [data, total] = await Promise.all([
        prisma.announcement.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.announcement.count({ where }),
      ]);

      return res.status(200).json({ data, total, page, limit });
    }

    // POST - Create announcement
    if (req.method === "POST") {
      const { title, content, type: annType, active: annActive, startsAt, endsAt } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "title and content are required" });
      }

      const validTypes = ["info", "warning", "success", "error"];
      if (annType && !validTypes.includes(annType)) {
        return res.status(400).json({ error: "Invalid type. Must be: info, warning, success, error" });
      }

      const entry = await prisma.announcement.create({
        data: {
          title,
          content,
          type: annType || "info",
          active: annActive !== undefined ? annActive : true,
          startsAt: startsAt ? new Date(startsAt) : null,
          endsAt: endsAt ? new Date(endsAt) : null,
        },
      });

      await auditLog({
        userId: adminUser.id,
        action: "announcement.create",
        entity: "announcement",
        entityId: entry.id,
        details: { title },
      });

      return res.status(201).json({ data: entry });
    }

    // PATCH - Update announcement
    if (req.method === "PATCH") {
      const { id, title, content, type: annType, active: annActive, startsAt, endsAt } = req.body;

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (annType !== undefined) {
        const validTypes = ["info", "warning", "success", "error"];
        if (!validTypes.includes(annType)) {
          return res.status(400).json({ error: "Invalid type" });
        }
        updateData.type = annType;
      }
      if (annActive !== undefined) updateData.active = annActive;
      if (startsAt !== undefined) updateData.startsAt = startsAt ? new Date(startsAt) : null;
      if (endsAt !== undefined) updateData.endsAt = endsAt ? new Date(endsAt) : null;

      const entry = await prisma.announcement.update({
        where: { id },
        data: updateData,
      });

      await auditLog({
        userId: adminUser.id,
        action: "announcement.update",
        entity: "announcement",
        entityId: id,
        details: { title: entry.title },
      });

      return res.status(200).json({ data: entry });
    }

    // DELETE - Delete announcement
    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      const entry = await prisma.announcement.findUnique({ where: { id } });
      if (!entry) {
        return res.status(404).json({ error: "Announcement not found" });
      }

      await prisma.announcement.delete({ where: { id } });

      await auditLog({
        userId: adminUser.id,
        action: "announcement.delete",
        entity: "announcement",
        entityId: id,
        details: { title: entry.title },
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Announcements API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
