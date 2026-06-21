import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Dashboard (Protected)</h1>
      <p>Welcome, {session?.user?.email}! This is a protected route.</p>
      <a href="/">Back to Home</a>
    </main>
  );
}
