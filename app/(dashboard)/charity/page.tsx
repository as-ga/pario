"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, Search, CheckCircle, Star } from "lucide-react";
import type { Charity, UserCharity } from "@/types";

export default function CharityPage() {
  const router = useRouter();
  const supabase = createClient();

  const [charities, setCharities] = useState<Charity[]>([]);
  const [userCharity, setUserCharity] = useState<UserCharity | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [percent, setPercent] = useState<number>(10);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

    // Charities fetch karo
    const { data: charitiesData } = await supabase
      .from("charities")
      .select("*")
      .eq("is_active", true)
      .order("is_featured", { ascending: false });
    setCharities(charitiesData || []);

    // User ki current charity fetch karo
    const { data: userCharityData } = await supabase
      .from("user_charity")
      .select("*, charities(*)")
      .eq("user_id", user.id)
      .single();

    if (userCharityData) {
      setUserCharity(userCharityData);
      setSelected(userCharityData.charity_id);
      setPercent(userCharityData.contribution_percent);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!selected) {
      setError("Pehle ek charity choose karo!");
      return;
    }

    if (percent < 10) {
      setError("Minimum 10% contribution required!");
      return;
    }

    setSaving(true);

    const { error: upsertError } = await supabase.from("user_charity").upsert(
      {
        user_id: userId,
        charity_id: selected,
        contribution_percent: percent,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (upsertError) {
      setError("Save karne mein error aaya!");
      setSaving(false);
      return;
    }

    setSuccess("Charity successfully save ho gayi! ✅");
    setSaving(false);
    fetchData();
    setTimeout(() => setSuccess(""), 3000);
  };

  // Search filter
  const filteredCharities = charities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

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
            <Heart className="text-red-400" />
            Choose Your Charity
          </h2>
          <p className="text-zinc-400 mt-2">
            Minimum 10% of your subscription automatically goes to your chosen
            charity.
          </p>
        </div>

        {/* CURRENT CHARITY */}
        {userCharity && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-8">
            <p className="text-zinc-400 text-sm mb-1">Currently Supporting</p>
            <div className="flex items-center justify-between">
              <p className="text-white font-bold text-lg">
                {userCharity.charities?.name}
              </p>
              <span
                className="bg-red-500/20 text-red-400 px-3 py-1
                               rounded-full text-sm font-bold"
              >
                {userCharity.contribution_percent}% contribution
              </span>
            </div>
          </div>
        )}

        {/* SEARCH */}
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2
                                       text-zinc-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search charities..."
            className="w-full bg-zinc-900 text-white rounded-xl pl-11 pr-4 py-3
                       border border-zinc-800 focus:outline-none focus:border-green-500"
          />
        </div>

        {/* CHARITIES LIST */}
        <div className="space-y-3 mb-8">
          {filteredCharities.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">
              Koi charity nahi mili!
            </div>
          ) : (
            filteredCharities.map((charity) => (
              <div
                key={charity.id}
                onClick={() => setSelected(charity.id)}
                className={`relative p-5 rounded-2xl border cursor-pointer
                            transition-all ${
                              selected === charity.id
                                ? "border-red-500 bg-red-500/10"
                                : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                            }`}
              >
                {/* Featured Badge */}
                {charity.is_featured && (
                  <span
                    className="absolute top-3 right-3 flex items-center gap-1
                                   text-yellow-400 text-xs bg-yellow-400/10
                                   px-2 py-1 rounded-full"
                  >
                    <Star size={10} />
                    Featured
                  </span>
                )}

                <div className="flex items-start justify-between pr-16">
                  <div className="flex items-start gap-4">
                    {/* Radio */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0
                                    flex items-center justify-center transition-all ${
                                      selected === charity.id
                                        ? "border-red-400 bg-red-400"
                                        : "border-zinc-600"
                                    }`}
                    >
                      {selected === charity.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-white">{charity.name}</h3>
                      {charity.description && (
                        <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                          {charity.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selected checkmark */}
                {selected === charity.id && (
                  <CheckCircle
                    size={20}
                    className="absolute bottom-4 right-4 text-red-400"
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* CONTRIBUTION PERCENT */}
        {selected && (
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-6">
            <h3 className="font-bold mb-4">Contribution Percentage</h3>

            <div className="flex items-center gap-4 mb-4">
              <input
                type="range"
                min={10}
                max={50}
                value={percent}
                onChange={(e) => setPercent(parseInt(e.target.value))}
                className="flex-1 accent-red-400"
              />
              <span className="text-2xl font-black text-red-400 w-16 text-right">
                {percent}%
              </span>
            </div>

            {/* Quick Select */}
            <div className="flex gap-2 flex-wrap">
              {[10, 15, 20, 25, 30].map((p) => (
                <button
                  key={p}
                  onClick={() => setPercent(p)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    percent === p
                      ? "bg-red-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>

            <p className="text-zinc-500 text-xs mt-4">
              * Minimum 10% required. You can voluntarily increase your
              contribution.
            </p>
          </div>
        )}

        {/* ERROR / SUCCESS */}
        {error && (
          <p
            className="text-red-400 text-sm bg-red-400/10 px-4 py-3
                        rounded-xl mb-4"
          >
            ❌ {error}
          </p>
        )}
        {success && (
          <p
            className="text-green-400 text-sm bg-green-400/10 px-4 py-3
                        rounded-xl mb-4"
          >
            {success}
          </p>
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={saving || !selected}
          className="w-full bg-red-500 hover:bg-red-400 text-white font-bold
                     py-4 rounded-xl transition-all disabled:opacity-50
                     flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div
                className="w-4 h-4 border-2 border-white border-t-transparent
                              rounded-full animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Heart size={18} />
              Save Charity
            </>
          )}
        </button>
      </div>
    </div>
  );
}
