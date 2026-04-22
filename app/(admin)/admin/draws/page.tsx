"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Trophy, Plus, Play, Eye, Shuffle } from "lucide-react";
import type { Draw } from "@/types";

export default function AdminDrawsPage() {
  const supabase = createClient();
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [simulated, setSimulated] = useState<number[]>([]);
  const [prizePool, setPrizePool] = useState("25000");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    const { data } = await supabase
      .from("draws")
      .select("*")
      .order("created_at", { ascending: false });
    setDraws(data || []);
    setLoading(false);
  };

  // Random 5 numbers generate karo (1-45)
  const generateNumbers = () => {
    const nums: number[] = [];
    while (nums.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!nums.includes(n)) nums.push(n);
    }
    return nums.sort((a, b) => a - b);
  };

  const handleSimulate = () => {
    setSimulated(generateNumbers());
  };

  const handleCreateDraw = async () => {
    setError("");
    setCreating(true);

    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    // Check karo kya is month ka draw already hai
    const { data: existing } = await supabase
      .from("draws")
      .select("id")
      .eq("month", month);
    //   .single();

    if (existing && existing.length > 0) {
      setError(`${month} ka draw already exist karta hai!`);
      setCreating(false);
      return;
    }

    const numbers = simulated.length === 5 ? simulated : generateNumbers();

    const { error: insertError } = await supabase.from("draws").insert({
      month,
      drawn_numbers: numbers,
      status: "draft",
      prize_pool: parseFloat(prizePool),
    });

    if (insertError) {
      setError("Draw create karne mein error!");
      setCreating(false);
      return;
    }

    setSuccess("Draw successfully create ho gaya! ✅");
    setSimulated([]);
    setCreating(false);
    fetchDraws();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handlePublish = async (drawId: string) => {
    setPublishing(drawId);

    const { error } = await supabase
      .from("draws")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", drawId);

    if (!error) {
      await processDrawResults(drawId);
      setSuccess("Draw published ho gaya! ✅");
      fetchDraws();
      setTimeout(() => setSuccess(""), 3000);
    }

    setPublishing(null);
  };

  // Draw publish hone pe results calculate karo
  const processDrawResults = async (drawId: string) => {
    // Draw fetch karo
    const { data: draw } = await supabase
      .from("draws")
      .select("*")
      .eq("id", drawId)
      .single();

    if (!draw) return;

    // Sab users ke scores fetch karo
    const { data: allScores } = await supabase
      .from("scores")
      .select("user_id, score");

    if (!allScores) return;

    // User ke scores group karo
    const userScoresMap: Record<string, number[]> = {};
    allScores.forEach((s) => {
      if (!userScoresMap[s.user_id]) userScoresMap[s.user_id] = [];
      userScoresMap[s.user_id].push(s.score);
    });

    // Har user ke matches calculate karo
    const results: any[] = [];
    Object.entries(userScoresMap).forEach(([userId, scores]) => {
      const matched = draw.drawn_numbers.filter((n: number) =>
        scores.includes(n)
      ).length;

      if (matched >= 3) {
        let prizePercent = 0;
        if (matched === 5) prizePercent = 0.4;
        else if (matched === 4) prizePercent = 0.35;
        else prizePercent = 0.25;

        results.push({
          draw_id: drawId,
          user_id: userId,
          matched,
          prize_amount: draw.prize_pool * prizePercent,
          status: "pending",
        });
      }
    });

    // Results insert karo
    if (results.length > 0) {
      await supabase.from("draw_results").insert(results);
    }
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
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <Trophy className="text-yellow-400" />
          Manage Draws
        </h2>
        <p className="text-zinc-400 mt-1">Create aur publish monthly draws</p>
      </div>

      {/* CREATE DRAW */}
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-8">
        <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
          <Plus size={20} className="text-green-400" />
          Create New Draw
        </h3>

        {/* Prize Pool */}
        <div className="mb-4">
          <label className="text-zinc-400 text-sm block mb-1">
            Prize Pool (₹)
          </label>
          <input
            type="number"
            value={prizePool}
            onChange={(e) => setPrizePool(e.target.value)}
            className="w-full md:w-64 bg-zinc-800 text-white rounded-xl px-4 py-3
                       border border-zinc-700 focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Simulate Numbers */}
        <div className="mb-5">
          <label className="text-zinc-400 text-sm block mb-2">
            Draw Numbers (Simulate first)
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSimulate}
              className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600
                         text-white px-4 py-2 rounded-xl text-sm transition-all"
            >
              <Shuffle size={16} />
              Simulate Numbers
            </button>

            {simulated.length === 5 && (
              <div className="flex gap-2">
                {simulated.map((n, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-yellow-400/20 border border-yellow-400/30
                               rounded-xl flex items-center justify-center
                               text-yellow-400 font-black"
                  >
                    {n}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
          onClick={handleCreateDraw}
          disabled={creating}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400
                     text-black font-bold px-6 py-3 rounded-xl transition-all
                     disabled:opacity-50"
        >
          {creating ? (
            <div
              className="w-4 h-4 border-2 border-black border-t-transparent
                            rounded-full animate-spin"
            />
          ) : (
            <Plus size={18} />
          )}
          Create Draw
        </button>
      </div>

      {/* DRAWS LIST */}
      <div className="space-y-4">
        {draws.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-zinc-800">
            <Trophy size={48} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">Koi draw nahi hai abhi</p>
          </div>
        ) : (
          draws.map((draw) => (
            <div
              key={draw.id}
              className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-lg">{draw.month} Draw</h4>
                  <p className="text-zinc-500 text-sm">
                    Prize Pool: ₹{Number(draw.prize_pool).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold ${
                    draw.status === "published"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {draw.status}
                </span>
              </div>

              {/* Numbers */}
              <div className="flex gap-2 mb-4">
                {draw.drawn_numbers.map((n: number, i: number) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center
                               justify-center text-yellow-400 font-black text-sm"
                  >
                    {n}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {draw.status === "draft" && (
                  <button
                    onClick={() => handlePublish(draw.id)}
                    disabled={publishing === draw.id}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-400
                               text-black font-bold px-5 py-2 rounded-xl text-sm
                               transition-all disabled:opacity-50"
                  >
                    {publishing === draw.id ? (
                      <div
                        className="w-4 h-4 border-2 border-black
                                      border-t-transparent rounded-full animate-spin"
                      />
                    ) : (
                      <Play size={16} />
                    )}
                    Publish Draw
                  </button>
                )}
                {draw.status === "published" && (
                  <span className="flex items-center gap-2 text-green-400 text-sm">
                    <Eye size={16} />
                    Published on{" "}
                    {draw.published_at
                      ? new Date(draw.published_at).toLocaleDateString("en-IN")
                      : "—"}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
