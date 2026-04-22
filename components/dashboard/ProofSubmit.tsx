"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Upload, CheckCircle, Clock } from "lucide-react";

export default function ProofSubmit({
  resultId,
  userId,
}: {
  resultId: string;
  userId: string;
}) {
  const supabase = createClient();
  const [verification, setVerification] = useState<any>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkVerification();
  }, [resultId]);

  const checkVerification = async () => {
    const { data } = await supabase
      .from("winner_verification")
      .select("*")
      .eq("result_id", resultId)
      .single();
    setVerification(data);
  };

  const handleSubmit = async () => {
    setError("");
    if (!proofUrl.trim()) {
      setError("Proof URL daalo!");
      return;
    }

    setSubmitting(true);

    const { error: insertError } = await supabase
      .from("winner_verification")
      .insert({
        result_id: resultId,
        user_id: userId,
        proof_url: proofUrl.trim(),
        status: "pending",
      });

    if (insertError) {
      setError("Submit karne mein error aaya!");
      setSubmitting(false);
      return;
    }

    setSuccess("Proof submit ho gaya! Admin verify karega. ✅");
    setSubmitting(false);
    checkVerification();
  };

  // Already submitted
  if (verification) {
    return (
      <div
        className={`mt-3 p-3 rounded-xl text-sm flex items-center gap-2 ${
          verification.status === "approved"
            ? "bg-green-500/20 text-green-400"
            : verification.status === "rejected"
            ? "bg-red-500/20 text-red-400"
            : "bg-yellow-500/20 text-yellow-400"
        }`}
      >
        {verification.status === "approved" && (
          <>
            <CheckCircle size={16} /> Verified & Approved! Payout processing...
          </>
        )}
        {verification.status === "rejected" && (
          <>
            <CheckCircle size={16} /> Proof rejected. Admin se contact karo.
          </>
        )}
        {verification.status === "pending" && (
          <>
            <Clock size={16} /> Proof submitted — Admin review kar raha hai...
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <p className="text-sm text-zinc-400">
        Jeetne ka proof submit karo (golf platform screenshot URL):
      </p>
      <div className="flex gap-2">
        <input
          type="url"
          value={proofUrl}
          onChange={(e) => setProofUrl(e.target.value)}
          placeholder="https://... (screenshot URL)"
          className="flex-1 bg-black/30 text-white rounded-xl px-3 py-2
                     border border-zinc-600 focus:outline-none
                     focus:border-green-500 text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400
                     text-black font-bold px-4 py-2 rounded-xl text-sm
                     transition-all disabled:opacity-50"
        >
          {submitting ? (
            <div
              className="w-4 h-4 border-2 border-black border-t-transparent
                            rounded-full animate-spin"
            />
          ) : (
            <Upload size={16} />
          )}
          Submit
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {success && <p className="text-green-400 text-xs">{success}</p>}
    </div>
  );
}
