"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import AuthButton from "@/components/AuthButton";

interface UserInfo {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  role: string;
  avatarUrl: string | null;
  lastLoginAt: string;
  stats: {
    projects: number;
    deployments: number;
    auditLogs: number;
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (status === "authenticated") {
      fetchUserInfo();
    }
  }, [status]);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data.user);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Dashboard | LostInVirtual</title>
      </Head>

      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              LostInVirtual
            </h1>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400">
              Dashboard
            </span>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {userInfo?.displayName || session.user?.name} 👋
          </h2>
          <p className="text-gray-400">
            Here&apos;s what&apos;s happening with your infrastructure.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Role</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  userInfo?.role === "ADMIN"
                    ? "bg-purple-900 text-purple-300"
                    : "bg-blue-900 text-blue-300"
                }`}
              >
                {userInfo?.role || "VIEWER"}
              </span>
            </div>
            <p className="text-2xl font-bold">{userInfo?.username}</p>
            <p className="text-gray-500 text-sm mt-1">{userInfo?.email}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <span className="text-gray-400 text-sm">Projects</span>
            <p className="text-4xl font-bold mt-2 text-blue-400">
              {userInfo?.stats.projects || 0}
            </p>
            <p className="text-gray-500 text-sm mt-1">Active deployments</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <span className="text-gray-400 text-sm">Deployments</span>
            <p className="text-4xl font-bold mt-2 text-green-400">
              {userInfo?.stats.deployments || 0}
            </p>
            <p className="text-gray-500 text-sm mt-1">Total deployments</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all text-sm">
              🐳 View Containers
            </button>
            <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all text-sm">
              🚀 Deploy Service
            </button>
            <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all text-sm">
              📊 View Logs
            </button>
            <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all text-sm">
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Session Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Provider</span>
              <span className="text-green-400">Keycloak OIDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Login</span>
              <span>
                {userInfo?.lastLoginAt
                  ? new Date(userInfo.lastLoginAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Audit Logs</span>
              <span>{userInfo?.stats.auditLogs || 0} events</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
