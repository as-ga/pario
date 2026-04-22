"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { CheckCircle, XCircle, Trophy, Clock } from "lucide-react";

interface WinnerData {
  id: string;
  status: string;
  proof_url: string | null;
  created_at: string;
  reviewed_at: string | null;
  draw_results: {
    matched: number;
    prize_amount: number;
    status: string;
    draws: {
      month: string;
    };
  };
  users: {
    full_name: string | null;
    email: string;
  };
}

export default function AdminWinnersPage() {
  const supabase = createClient();
  const [winners, setWinners] = useState<WinnerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [updating, setUpdating] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    const { data } = await supabase
      .from("winner_verification")
      .select(
        `
        *,
        draw_results (
          matched,
          prize_amount,
          status,
          draws ( month )
        ),
        users ( full_name, email )
      `
      )
      .order("created_at", { ascending: false });
    setWinners((data as any) || []);
    setLoading(false);
  };

  const handleUpdateStatus = async (
    id: string,
    resultId: string,
    newStatus: "approved" | "rejected"
  ) => {
    setUpdating(id);

    await supabase
      .from("winner_verification")
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    // Agar approved toh draw_result status bhi update karo
    if (newStatus === "approved") {
      await supabase
        .from("draw_results")
        .update({ status: "paid" })
        .eq("id", resultId);
    }

    setSuccess(`Winner ${newStatus} ho gaya! ✅`);
    setUpdating(null);
    fetchWinners();
    setTimeout(() => setSuccess(""), 3000);
  };

  const getMatchLabel = (matched: number) => {
    if (matched === 5) return "🏆 Jackpot";
    if (matched === 4) return "🥈 4 Match";
    return "🥉 3 Match";
  };

  const filteredWinners = winners.filter((w) =>
    filter === "all" ? true : w.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <Trophy className="text-yellow-400" />
          Winner Verification
        </h2>
        <p className="text-zinc-400 mt-1">
          Winners ko verify karo aur payout mark karo
        </p>
      </div>

      {success && (
        <p
          className="text-green-400 text-sm bg-green-400/10 px-4 py-3
                      rounded-xl mb-6"
        >
          {success}
        </p>
      )}

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize
                        transition-all ${
                          filter === f
                            ? "bg-green-500 text-black"
                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                        }`}
          >
            {f}
            <span className="ml-2 text-xs opacity-70">
              (
              {f === "all"
                ? winners.length
                : winners.filter((w) => w.status === f).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* WINNERS LIST */}
      {filteredWinners.length === 0 ? (
        <div
          className="text-center py-16 bg-zinc-900 rounded-2xl
                        border border-zinc-800"
        >
          <Trophy size={48} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">Koi winner nahi hai abhi</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWinners.map((winner) => (
            <div
              key={winner.id}
              className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800"
            >
              <div
                className="flex flex-col md:flex-row md:items-center
                              justify-between gap-4"
              >
                <div className="space-y-2">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 bg-green-500/20 rounded-full
                                    flex items-center justify-center
                                    text-green-400 font-bold"
                    >
                      {winner.users?.full_name?.[0]?.toUpperCase() ||
                        winner.users?.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold">
                        {winner.users?.full_name || "—"}
                      </p>
                      <p className="text-zinc-500 text-xs">
                        {winner.users?.email}
                      </p>
                    </div>
                  </div>

                  {/* Draw Info */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-yellow-400 text-sm font-bold">
                      {getMatchLabel(winner.draw_results?.matched)}
                    </span>
                    <span className="text-zinc-500 text-sm">
                      {winner.draw_results?.draws?.month} Draw
                    </span>
                    <span className="text-green-400 font-bold">
                      ₹{winner.draw_results?.prize_amount?.toLocaleString()}
                    </span>
                  </div>

                  {/* Proof */}
                  {winner.proof_url && (
                    <a
                      href={winner.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-sm hover:underline"
                    >
                      View Proof →
                    </a>
                  )}

                  {/* Date */}
                  <p className="text-zinc-600 text-xs flex items-center gap-1">
                    <Clock size={12} />
                    Submitted:{" "}
                    {new Date(winner.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {/* Status Badge */}
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold
                                    text-center ${
                                      winner.status === "approved"
                                        ? "bg-green-500/20 text-green-400"
                                        : winner.status === "rejected"
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-yellow-500/20 text-yellow-400"
                                    }`}
                  >
                    {winner.status === "approved" && "✓ Approved"}
                    {winner.status === "rejected" && "✗ Rejected"}
                    {winner.status === "pending" && "⏳ Pending"}
                  </span>

                  {/* Approve/Reject Buttons */}
                  {winner.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            winner.id,
                            winner.draw_results?.matched.toString(),
                            "approved"
                          )
                        }
                        disabled={updating === winner.id}
                        className="flex items-center gap-1 bg-green-500/20
                                   hover:bg-green-500 text-green-400
                                   hover:text-black px-4 py-2 rounded-xl
                                   text-sm font-bold transition-all"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            winner.id,
                            winner.draw_results?.matched.toString(),
                            "rejected"
                          )
                        }
                        disabled={updating === winner.id}
                        className="flex items-center gap-1 bg-red-500/20
                                   hover:bg-red-500 text-red-400
                                   hover:text-white px-4 py-2 rounded-xl
                                   text-sm font-bold transition-all"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
