"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import type { Draw, DrawResult, Score } from "@/types";

interface DrawWithResults extends Draw {
  draw_results: DrawResult[];
}

export default function DrawsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [draws, setDraws] = useState<DrawWithResults[]>([]);
  const [myResults, setMyResults] = useState<DrawResult[]>([]);
  const [myScores, setMyScores] = useState<Score[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUserId(user.id);

    // Published draws fetch karo
    const { data: drawsData } = await supabase
      .from("draws")
      .select("*, draw_results(*)")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    setDraws(drawsData || []);

    // Meri results fetch karo
    const { data: resultsData } = await supabase
      .from("draw_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setMyResults(resultsData || []);

    // Mere scores fetch karo
    const { data: scoresData } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("score_date", { ascending: false });
    setMyScores(scoresData || []);

    setLoading(false);
  };

  const getMatchColor = (matched: number) => {
    if (matched === 5)
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    if (matched === 4)
      return "text-green-400 bg-green-400/10 border-green-400/30";
    return "text-blue-400 bg-blue-400/10 border-blue-400/30";
  };

  const getMatchLabel = (matched: number) => {
    if (matched === 5) return "🏆 Jackpot Winner!";
    if (matched === 4) return "🥈 4 Match Winner!";
    return "🥉 3 Match Winner!";
  };

  const getPrizeForMatch = (matched: number, prizePool: number) => {
    if (matched === 5) return (prizePool * 0.4).toFixed(0);
    if (matched === 4) return (prizePool * 0.35).toFixed(0);
    return (prizePool * 0.25).toFixed(0);
  };

  // Check karo user ke scores draw numbers se match karte hain
  const getMatchedNumbers = (drawnNumbers: number[]) => {
    const userScores = myScores.map((s) => s.score);
    return drawnNumbers.filter((n) => userScores.includes(n));
  };

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
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <nav className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold">
            Par<span className="text-green-400">io</span>
          </h1>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <Trophy className="text-yellow-400" />
            Draw Results
          </h2>
          <p className="text-zinc-400 mt-2">
            Monthly draws — check if your scores matched!
          </p>
        </div>

        {/* MY SCORES BANNER */}
        {myScores.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8">
            <p className="text-zinc-400 text-sm mb-3 flex items-center gap-2">
              <TrendingUp size={16} />
              My Current Draw Numbers
            </p>
            <div className="flex gap-3 flex-wrap">
              {myScores.map((s, i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-green-500/20 border border-green-500/30
                             rounded-xl flex items-center justify-center
                             text-green-400 font-black text-lg"
                >
                  {s.score}
                </div>
              ))}
              {Array.from({ length: 5 - myScores.length }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-zinc-800 border border-dashed
                             border-zinc-700 rounded-xl flex items-center
                             justify-center text-zinc-600 text-sm"
                >
                  ?
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MY WINNINGS */}
        {myResults.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Star size={18} className="text-yellow-400" />
              My Winnings
            </h3>
            <div className="space-y-3">
              {myResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-5 rounded-2xl border ${getMatchColor(
                    result.matched
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">
                        {getMatchLabel(result.matched)}
                      </p>
                      <p className="text-sm opacity-70 mt-1">
                        {new Date(result.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black">
                        ₹{result.prize_amount}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          result.status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {result.status === "paid" ? "✓ Paid" : "⏳ Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEXT DRAW CARD */}
        <div
          className="bg-gradient-to-r from-green-500/10 to-yellow-500/10
                        border border-green-500/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={20} className="text-green-400" />
            <h3 className="font-bold text-lg">Next Draw — May 2026</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "3 Match", prize: "₹2,500", color: "text-blue-400" },
              { label: "4 Match", prize: "₹8,750", color: "text-green-400" },
              {
                label: "5 Match 🏆",
                prize: "₹25,000",
                color: "text-yellow-400",
              },
            ].map((item, i) => (
              <div key={i} className="bg-black/30 rounded-xl p-3 text-center">
                <p className="text-zinc-400 text-xs mb-1">{item.label}</p>
                <p className={`font-black text-lg ${item.color}`}>
                  {item.prize}
                </p>
              </div>
            ))}
          </div>

          {myScores.length < 5 && (
            <div
              className="flex items-center gap-2 bg-yellow-500/10 border
                            border-yellow-500/20 rounded-xl px-4 py-3"
            >
              <AlertCircle size={16} className="text-yellow-400 shrink-0" />
              <p className="text-yellow-400 text-sm">
                Tumhare sirf {myScores.length}/5 scores hain —{" "}
                <Link href="/scores" className="underline font-bold">
                  baaki add karo!
                </Link>
              </p>
            </div>
          )}

          {myScores.length === 5 && (
            <div
              className="flex items-center gap-2 bg-green-500/10 border
                            border-green-500/20 rounded-xl px-4 py-3"
            >
              <CheckCircle size={16} className="text-green-400 shrink-0" />
              <p className="text-green-400 text-sm font-bold">
                Tum draw mein participate kar rahe ho! ✓
              </p>
            </div>
          )}
        </div>

        {/* PAST DRAWS */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock size={18} className="text-zinc-400" />
            Past Draws
          </h3>

          {draws.length === 0 ? (
            <div
              className="text-center py-16 bg-zinc-900 rounded-2xl
                            border border-zinc-800"
            >
              <Trophy size={48} className="text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">
                Abhi tak koi draw nahi hua
              </p>
              <p className="text-zinc-600 text-sm mt-2">
                Pehla draw May 2026 mein hoga!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {draws.map((draw) => {
                const matchedNums = getMatchedNumbers(draw.drawn_numbers);
                const myResult = myResults.find((r) => r.draw_id === draw.id);

                return (
                  <div
                    key={draw.id}
                    className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800"
                  >
                    {/* Draw Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h4 className="font-bold text-lg">{draw.month} Draw</h4>
                        <p className="text-zinc-500 text-sm">
                          Prize Pool: ₹{draw.prize_pool.toLocaleString()}
                        </p>
                      </div>
                      <span
                        className="bg-green-500/20 text-green-400 text-xs
                                       px-3 py-1 rounded-full font-bold"
                      >
                        Published
                      </span>
                    </div>

                    {/* Drawn Numbers */}
                    <div className="mb-4">
                      <p className="text-zinc-500 text-xs mb-3">
                        Drawn Numbers
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {draw.drawn_numbers.map((num, i) => {
                          const isMatch = matchedNums.includes(num);
                          return (
                            <div
                              key={i}
                              className={`w-12 h-12 rounded-xl flex items-center
                                         justify-center font-black text-lg
                                         transition-all ${
                                           isMatch
                                             ? "bg-yellow-400 text-black scale-110"
                                             : "bg-zinc-800 text-zinc-400"
                                         }`}
                            >
                              {num}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* My Result */}
                    {myResult ? (
                      <div
                        className={`p-4 rounded-xl border ${getMatchColor(
                          myResult.matched
                        )}`}
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-bold">
                            {getMatchLabel(myResult.matched)}
                          </p>
                          <p className="text-xl font-black">
                            ₹{myResult.prize_amount}
                          </p>
                        </div>
                      </div>
                    ) : matchedNums.length > 0 ? (
                      <div
                        className="bg-blue-500/10 border border-blue-500/20
                                      rounded-xl p-4"
                      >
                        <p className="text-blue-400 text-sm">
                          {matchedNums.length} number(s) match kiye:{" "}
                          {matchedNums.join(", ")}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-zinc-800 rounded-xl p-4">
                        <p className="text-zinc-500 text-sm">
                          Is draw mein koi match nahi hua
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
