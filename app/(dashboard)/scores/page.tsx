"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, TrendingUp, Info } from "lucide-react";
import type { Score } from "@/types";

export default function ScoresPage() {
  const router = useRouter();
  const supabase = createClient();

  const [scores, setScores] = useState<Score[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [newScore, setNewScore] = useState("");
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    setUserId(user.id);

    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("score_date", { ascending: false })
      .limit(5);

    setScores(data || []);
    setLoading(false);
  };

  const handleAddScore = async () => {
    setError("");
    setSuccess("");

    // Validation
    if (!newScore || !newDate) {
      setError("Score aur date dono bharo!");
      return;
    }

    const scoreNum = parseInt(newScore);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      setError("Score 1 se 45 ke beech hona chahiye!");
      return;
    }

    // Future date check
    if (new Date(newDate) > new Date()) {
      setError("Future ki date nahi de sakte!");
      return;
    }

    setAdding(true);

    const { error: insertError } = await supabase.from("scores").insert({
      user_id: userId,
      score: scoreNum,
      score_date: newDate,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        setError("Is date ka score already exist karta hai!");
      } else {
        setError("Score add karne mein error aaya!");
      }
      setAdding(false);
      return;
    }

    setSuccess("Score successfully add ho gaya! ✅");
    setNewScore("");
    setNewDate("");
    setAdding(false);
    fetchScores();

    // Success message 3 sec baad hatao
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from("scores").delete().eq("id", id);
    setScores((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 36) return "text-green-400";
    if (score >= 25) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 36) return "Excellent";
    if (score >= 25) return "Good";
    return "Average";
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
            <TrendingUp className="text-green-400" />
            My Golf Scores
          </h2>
          <p className="text-zinc-400 mt-2">
            Enter your last 5 Stableford scores — these are your draw numbers!
          </p>
        </div>

        {/* INFO BOX */}
        <div
          className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4
                        flex gap-3 mb-8"
        >
          <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />
          <div className="text-sm text-zinc-300 space-y-1">
            <p>
              • Score range:{" "}
              <span className="text-white font-bold">1 – 45</span> (Stableford
              format)
            </p>
            <p>
              • Maximum <span className="text-white font-bold">5 scores</span>{" "}
              stored at a time
            </p>
            <p>
              • Naya score add karne pe{" "}
              <span className="text-white font-bold">
                purana automatically hata
              </span>{" "}
              jaata hai
            </p>
            <p>
              • Ek date pe sirf{" "}
              <span className="text-white font-bold">ek score</span> allowed hai
            </p>
          </div>
        </div>

        {/* ADD SCORE FORM */}
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-8">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
            <Plus size={20} className="text-green-400" />
            Add New Score
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {/* Score Input */}
            <div>
              <label className="text-zinc-400 text-sm block mb-1">
                Stableford Score (1–45)
              </label>
              <input
                type="number"
                min={1}
                max={45}
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                placeholder="e.g. 32"
                className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3
                           border border-zinc-700 focus:outline-none
                           focus:border-green-500 text-xl font-bold"
              />
            </div>

            {/* Date Input */}
            <div>
              <label className="text-zinc-400 text-sm block mb-1">
                Date Played
              </label>
              <input
                type="date"
                value={newDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3
                           border border-zinc-700 focus:outline-none
                           focus:border-green-500"
              />
            </div>
          </div>

          {/* Score Preview */}
          {newScore && parseInt(newScore) >= 1 && parseInt(newScore) <= 45 && (
            <div
              className="mb-4 bg-zinc-800 rounded-xl px-4 py-3 flex items-center
                            justify-between"
            >
              <span className="text-zinc-400 text-sm">Score Preview</span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-2xl font-black ${getScoreColor(
                    parseInt(newScore)
                  )}`}
                >
                  {newScore}
                </span>
                <span
                  className={`text-sm ${getScoreColor(parseInt(newScore))}`}
                >
                  {getScoreLabel(parseInt(newScore))}
                </span>
              </div>
            </div>
          )}

          {/* Error / Success */}
          {error && (
            <p
              className="text-red-400 text-sm bg-red-400/10 px-4 py-2
                          rounded-xl mb-4"
            >
              ❌ {error}
            </p>
          )}
          {success && (
            <p
              className="text-green-400 text-sm bg-green-400/10 px-4 py-2
                          rounded-xl mb-4"
            >
              {success}
            </p>
          )}

          <button
            onClick={handleAddScore}
            disabled={adding || scores.length >= 5}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold
                       py-3 rounded-xl transition-all disabled:opacity-50
                       flex items-center justify-center gap-2"
          >
            {adding ? (
              <>
                <div
                  className="w-4 h-4 border-2 border-black border-t-transparent
                                rounded-full animate-spin"
                />
                Adding...
              </>
            ) : (
              <>
                <Plus size={18} />
                {scores.length >= 5 ? "Delete a score first" : "Add Score"}
              </>
            )}
          </button>
        </div>

        {/* SCORES LIST */}
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">My Scores</h3>
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full ${
                scores.length === 5
                  ? "bg-green-500/20 text-green-400"
                  : "bg-zinc-700 text-zinc-400"
              }`}
            >
              {scores.length} / 5
            </span>
          </div>

          {scores.length === 0 ? (
            <div className="text-center py-10">
              <TrendingUp size={40} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">Koi score nahi hai abhi</p>
              <p className="text-zinc-600 text-sm mt-1">
                Upar form se apna pehla score add karo!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between bg-zinc-800
                             rounded-xl px-4 py-4 group"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <span className="text-zinc-600 text-sm font-bold w-5">
                      #{i + 1}
                    </span>
                    {/* Date */}
                    <div>
                      <p className="text-zinc-300 text-sm">
                        {new Date(s.score_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className={`text-xs ${getScoreColor(s.score)}`}>
                        {getScoreLabel(s.score)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Score */}
                    <span
                      className={`text-3xl font-black ${getScoreColor(
                        s.score
                      )}`}
                    >
                      {s.score}
                    </span>
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={deleting === s.id}
                      className="text-zinc-600 hover:text-red-400 transition-colors
                                 opacity-0 group-hover:opacity-100"
                    >
                      {deleting === s.id ? (
                        <div
                          className="w-4 h-4 border-2 border-red-400
                                        border-t-transparent rounded-full animate-spin"
                        />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty Slots */}
              {Array.from({ length: 5 - scores.length }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border border-dashed
                             border-zinc-700 rounded-xl px-4 py-4"
                >
                  <span className="text-zinc-600 text-sm">
                    Empty slot {scores.length + i + 1}
                  </span>
                  <span className="text-zinc-700">—</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DRAW INFO */}
        {scores.length > 0 && (
          <div
            className="mt-6 bg-green-500/10 border border-green-500/20
                          rounded-2xl p-5 text-center"
          >
            <p className="text-zinc-400 text-sm">
              Tumhare draw numbers hain:{" "}
              <span className="text-green-400 font-black text-lg">
                {scores.map((s) => s.score).join(", ")}
              </span>
            </p>
            <p className="text-zinc-500 text-xs mt-1">Next draw: May 2026</p>
          </div>
        )}
      </div>
    </div>
  );
}
