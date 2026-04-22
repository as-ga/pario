"use client";

import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import {
  Trophy,
  Heart,
  TrendingUp,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import LogoutButton from "@/components/shared/LogoutButton";
import LoadingSkeleton from "@/components/dashboard/loadingSkeleton";

export default function DashboardPage() {
  const { user, subscription, scores, charity, isLoading } = useUserStore();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <nav className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">
            Par<span className="text-green-400">io</span>
          </h1>
          <div className="flex items-center gap-6">
            <span className="text-zinc-400 text-sm">
              👋 {user?.full_name || "Player"}
            </span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* WELCOME */}
        <div className="mb-10">
          <h2 className="text-3xl font-black">
            Welcome back, {user?.full_name?.split(" ")[0] || "Player"} 👋
          </h2>
          <p className="text-zinc-400 mt-1">Here&#39;s your Pario overview</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Subscription",
              value: subscription?.status || "Inactive",
              icon: <CheckCircle size={20} />,
              color:
                subscription?.status === "active"
                  ? "text-green-400 bg-green-400/10 border-green-400/20"
                  : "text-red-400 bg-red-400/10 border-red-400/20",
            },
            {
              label: "Scores Entered",
              value: `${scores.length} / 5`,
              icon: <TrendingUp size={20} />,
              color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
            },
            {
              label: "Next Draw",
              value: "May 2026",
              icon: <Calendar size={20} />,
              color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
            },
            {
              label: "Total Won",
              value: "₹0",
              icon: <Trophy size={20} />,
              color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border ${card.color} flex flex-col gap-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">{card.label}</span>
                {card.icon}
              </div>
              <p className="text-xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* SCORES CARD */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">My Golf Scores</h3>
                <p className="text-zinc-500 text-sm">
                  Last 5 scores (your draw numbers)
                </p>
              </div>
              <Link
                href="/scores"
                className="flex items-center gap-1 text-green-400
                           text-sm hover:underline"
              >
                Add Score <ChevronRight size={16} />
              </Link>
            </div>

            {scores.length === 0 ? (
              <div className="text-center py-10">
                <TrendingUp size={40} className="text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No scores yet</p>
                <Link
                  href="/scores"
                  className="mt-4 inline-block bg-green-500 hover:bg-green-400
                             text-black font-bold px-6 py-2 rounded-full text-sm"
                >
                  Add Your First Score
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {scores.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-zinc-800
                               rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500 text-sm w-5">{i + 1}</span>
                      <span className="text-zinc-400 text-sm">
                        {s.score_date}
                      </span>
                    </div>
                    <span className="text-2xl font-black text-green-400">
                      {s.score}
                    </span>
                  </div>
                ))}
                {Array.from({ length: 5 - scores.length }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-zinc-800/40
                               border border-dashed border-zinc-700
                               rounded-xl px-4 py-3"
                  >
                    <span className="text-zinc-600 text-sm">Empty slot</span>
                    <span className="text-zinc-700 text-sm">—</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* SUBSCRIPTION CARD */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Subscription</h3>
                <Clock size={20} className="text-zinc-500" />
              </div>
              {subscription ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Plan</span>
                    <span className="capitalize font-semibold">
                      {subscription.plan}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Status</span>
                    <span className="text-green-400 font-semibold capitalize">
                      {subscription.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount</span>
                    <span className="font-semibold">
                      ₹{subscription.amount}/mo
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle
                    size={36}
                    className="text-zinc-700 mx-auto mb-3"
                  />
                  <p className="text-zinc-500 mb-4">No active subscription</p>
                  <Link
                    href="/subscribe"
                    className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2 rounded-full text-sm"
                  >
                    Subscribe Now
                  </Link>
                </div>
              )}
            </div>

            {/* CHARITY CARD */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">My Charity</h3>
                <Heart size={20} className="text-red-400" />
              </div>
              {charity ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Supporting</span>
                    <span className="font-semibold text-red-400">
                      {charity.charities?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Contribution</span>
                    <span className="font-semibold">
                      {charity.contribution_percent}%
                    </span>
                  </div>
                  <Link
                    href="/charity"
                    className="block text-center text-zinc-400 hover:text-white
                               text-sm mt-2 transition-colors"
                  >
                    Change charity →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Heart size={36} className="text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500 mb-4">No charity selected</p>
                  <Link
                    href="/charity"
                    className="bg-red-500 hover:bg-red-400 text-white
                               font-bold px-6 py-2 rounded-full text-sm"
                  >
                    Choose Charity
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DRAW INFO */}
        <div className="mt-6 bg-gradient-to-r from-green-500/10 to-yellow-500/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center  justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Trophy size={20} className="text-yellow-400" />
                Next Monthly Draw
              </h3>
              <p className="text-zinc-400 mt-1">
                May 2026 draw — Prize pool:{" "}
                <span className="text-green-400 font-bold">₹25,000</span>
              </p>
            </div>
            <Link
              href="/draws"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-full transition-all"
            >
              View Draw Details <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
