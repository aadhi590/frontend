"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { LogOut, Home } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#1A5F3F] to-[#0F3D2A] rounded-xl flex items-center justify-center text-white font-bold mx-auto mb-4">
            B
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1A5F3F] to-[#0F3D2A] rounded-xl flex items-center justify-center text-white font-bold">
              B
            </div>
            <span className="font-bold text-xl text-[#1A5F3F]">
              BANK SAATHI
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-gray-700">
              Welcome, <strong>{user.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-8">Your financial hub is loading...</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#1A5F3F] hover:underline"
          >
            <Home size={18} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
