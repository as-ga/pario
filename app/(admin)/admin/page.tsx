"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Users, Trophy, Heart, CheckCircle, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalCharities: 0,
    pendingWinners: 0,
    totalPrizePool: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [users, subs, charities, winners] = await Promise.all([
      supabase.from("users").select("id", { count: "exact" }),
      supabase
        .from("subscriptions")
        .select("id", { count: "exact" })
        .eq("status", "active"),
      supabase
        .from("charities")
        .select("id", { count: "exact" })
        .eq("is_active", true),
      supabase
        .from("winner_verification")
        .select("id", { count: "exact" })
        .eq("status", "pending"),
    ]);

    setStats({
      totalUsers: users.count || 0,
      activeSubscriptions: subs.count || 0,
      totalCharities: charities.count || 0,
      pendingWinners: winners.count || 0,
      totalPrizePool: 25000,
    });

    setLoading(false);
  };

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <Users size={22} />,
      color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    },
    {
      label: "Active Subscriptions",
      value: stats.activeSubscriptions,
      icon: <TrendingUp size={22} />,
      color: "text-green-400 bg-green-400/10 border-green-400/20",
    },
    {
      label: "Active Charities",
      value: stats.totalCharities,
      icon: <Heart size={22} />,
      color: "text-red-400 bg-red-400/10 border-red-400/20",
    },
    {
      label: "Pending Winners",
      value: stats.pendingWinners,
      icon: <CheckCircle size={22} />,
      color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    },
    {
      label: "Prize Pool",
      value: `₹${stats.totalPrizePool.toLocaleString()}`,
      icon: <Trophy size={22} />,
      color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-green-400 border-t-transparent
                        rounded-full animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h2 className="text-3xl font-black">Admin Dashboard</h2>
        <p className="text-zinc-400 mt-1">Pario platform overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border ${card.color} flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">{card.label}</span>
              {card.icon}
            </div>
            <p className="text-3xl font-black text-white">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
