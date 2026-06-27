import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/* Keycloak Admin API — create user                                    */
/* ------------------------------------------------------------------ */

async function getAdminToken(): Promise<string> {
  const kcUrl = process.env.KEYCLOAK_URL || "https://keycloak.lostinvirtual.world";
  const res = await fetch(
    `${kcUrl}/realms/master/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: process.env.KEYCLOAK_ADMIN_USER || "admin",
        password: process.env.KEYCLOAK_ADMIN_PASSWORD || "",
        grant_type: "password",
        client_id: "admin-cli",
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to obtain Keycloak admin token");
  const data = await res.json();
  return data.access_token;
}

async function createKeycloakUser(
  token: string,
  username: string,
  email: string,
  password: string,
  fullName: string
): Promise<string> {
  const kcUrl = process.env.KEYCLOAK_URL || "https://keycloak.lostinvirtual.world";
  const realm = process.env.KEYCLOAK_REALM || "lostinvirtual";

  const res = await fetch(`${kcUrl}/admin/realms/${realm}/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      firstName: fullName.split(" ").slice(0, -1).join(" ") || fullName,
      lastName: fullName.split(" ").slice(-1)[0] || "",
      enabled: true,
      emailVerified: true,
      credentials: [
        {
          type: "password",
          value: password,
          temporary: false,
        },
      ],
    }),
  });

  if (res.status === 409) {
    throw new Error("Username or email already exists");
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Keycloak error: ${res.status}`);
  }

  // Get the created user's ID from Location header
  const location = res.headers.get("location");
  if (location) {
    const userId = location.split("/").pop();
    return userId || "";
  }

  // Fallback: search for the user
  const searchRes = await fetch(
    `${kcUrl}/admin/realms/${realm}/users?username=${encodeURIComponent(username)}&exact=true`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const users = await searchRes.json();
  return users[0]?.id || "";
}

/* ------------------------------------------------------------------ */
/* POST /api/auth/register                                             */
/* ------------------------------------------------------------------ */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fullName, email, username, password } = req.body;

  // Validation
  if (!fullName || !email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: "Username must be at least 3 characters" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  // Check if username exists in Prisma DB
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { email: email },
      ],
    },
  });

  if (existingUser) {
    return res.status(409).json({ message: "Username or email already exists" });
  }

  try {
    // 1. Create user in Keycloak
    const adminToken = await getAdminToken();
    const keycloakUserId = await createKeycloakUser(
      adminToken,
      username,
      email,
      password,
      fullName
    );

    // 2. Create user in Prisma DB
    const user = await prisma.user.create({
      data: {
        keycloakId: keycloakUserId,
        username,
        email,
        displayName: fullName,
        role: "VISITOR",
        lastLoginAt: new Date(),
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: error.message || "Registration failed",
    });
  }
}
