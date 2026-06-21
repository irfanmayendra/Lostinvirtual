import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Page() {
  const session = await getServerSession();
  const env = process.env.NODE_ENV || "development";

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Citizen Registry</h1>
      <p>Environment: <strong>{env}</strong></p>
      
      {session ? (
        <div>
          <p>Status: Logged in as {session.user?.email}</p>
          <a href="/api/auth/signout">Sign Out</a>
        </div>
      ) : (
        <div>
          <p>Status: Not logged in</p>
          <a href="/api/auth/signin">Sign In</a>
        </div>
      )}
      
      <div style={{ marginTop: "1rem" }}>
        <Link href="/dashboard">Go to Protected Dashboard</Link>
      </div>
    </main>
  );
}
