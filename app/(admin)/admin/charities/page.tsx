"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Heart, Plus, Trash2, Star } from "lucide-react";
import type { Charity } from "@/types";

export default function AdminCharitiesPage() {
  const supabase = createClient();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    const { data } = await supabase
      .from("charities")
      .select("*")
      .order("is_featured", { ascending: false });
    setCharities(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    setError("");
    if (!name.trim()) {
      setError("Charity ka naam daalo!");
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase.from("charities").insert({
      name: name.trim(),
      description: description.trim() || null,
      is_featured: isFeatured,
      is_active: true,
    });

    if (insertError) {
      setError("Charity add karne mein error!");
      setSaving(false);
      return;
    }

    setSuccess("Charity successfully add ho gayi! ✅");
    setName("");
    setDescription("");
    setIsFeatured(false);
    setSaving(false);
    fetchCharities();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await supabase
      .from("charities")
      .update({ is_active: !current })
      .eq("id", id);
    fetchCharities();
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    await supabase
      .from("charities")
      .update({ is_featured: !current })
      .eq("id", id);
    fetchCharities();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from("charities").delete().eq("id", id);
    setCharities((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
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
          <Heart className="text-red-400" />
          Manage Charities
        </h2>
        <p className="text-zinc-400 mt-1">
          Total: {charities.length} charities
        </p>
      </div>

      {/* ADD CHARITY */}
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-8">
        <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
          <Plus size={20} className="text-green-400" />
          Add New Charity
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-zinc-400 text-sm block mb-1">
              Charity Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cancer Research UK"
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3
                         border border-zinc-700 focus:outline-none
                         focus:border-green-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm block mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Charity ke baare mein likhो..."
              rows={3}
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3
                         border border-zinc-700 focus:outline-none
                         focus:border-green-500 resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setIsFeatured(!isFeatured)}
              className={`w-12 h-6 rounded-full transition-all relative ${
                isFeatured ? "bg-yellow-400" : "bg-zinc-700"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full
                               transition-all ${
                                 isFeatured ? "left-7" : "left-1"
                               }`}
              />
            </div>
            <span className="text-zinc-300 text-sm">Featured Charity</span>
            <Star size={14} className="text-yellow-400" />
          </label>
        </div>

        {error && (
          <p
            className="text-red-400 text-sm bg-red-400/10 px-4 py-2
                        rounded-xl mt-4"
          >
            ❌ {error}
          </p>
        )}
        {success && (
          <p
            className="text-green-400 text-sm bg-green-400/10 px-4 py-2
                        rounded-xl mt-4"
          >
            {success}
          </p>
        )}

        <button
          onClick={handleAdd}
          disabled={saving}
          className="mt-4 flex items-center gap-2 bg-green-500 hover:bg-green-400
                     text-black font-bold px-6 py-3 rounded-xl transition-all
                     disabled:opacity-50"
        >
          {saving ? (
            <div
              className="w-4 h-4 border-2 border-black border-t-transparent
                            rounded-full animate-spin"
            />
          ) : (
            <Plus size={18} />
          )}
          Add Charity
        </button>
      </div>

      {/* CHARITIES LIST */}
      <div className="space-y-3">
        {charities.map((charity) => (
          <div
            key={charity.id}
            className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800
                       flex items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold">{charity.name}</h4>
                {charity.is_featured && (
                  <Star size={14} className="text-yellow-400" />
                )}
              </div>
              {charity.description && (
                <p className="text-zinc-500 text-sm">{charity.description}</p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Featured Toggle */}
              <button
                onClick={() =>
                  handleToggleFeatured(charity.id, charity.is_featured)
                }
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  charity.is_featured
                    ? "bg-yellow-400/20 text-yellow-400"
                    : "bg-zinc-700 text-zinc-400"
                }`}
              >
                {charity.is_featured ? "★ Featured" : "Feature"}
              </button>

              {/* Active Toggle */}
              <button
                onClick={() =>
                  handleToggleActive(charity.id, charity.is_active)
                }
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  charity.is_active
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {charity.is_active ? "Active" : "Inactive"}
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(charity.id)}
                disabled={deleting === charity.id}
                className="text-zinc-600 hover:text-red-400 transition-colors"
              >
                {deleting === charity.id ? (
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
      </div>
    </div>
  );
}
