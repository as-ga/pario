"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Trophy,
  Heart,
  TrendingUp,
  Zap,
  Shield,
} from "lucide-react";

export default function SubscribePage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/subscription/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Stripe checkout pe redirect karo
      window.location.href = data.url;
    } catch (err) {
      setError("Kuch galat ho gaya!");
      setLoading(false);
    }
  };

  const plans = {
    monthly: {
      price: "₹999",
      period: "per month",
      savings: null,
      amount: 999,
    },
    yearly: {
      price: "₹9,990",
      period: "per year",
      savings: "Save ₹1,998!",
      amount: 9990,
    },
  };

  const features = [
    { icon: <TrendingUp size={18} />, text: "Enter 5 golf scores every month" },
    { icon: <Trophy size={18} />, text: "Participate in monthly prize draws" },
    { icon: <Heart size={18} />, text: "Support your chosen charity (10%+)" },
    { icon: <Zap size={18} />, text: "Win up to ₹25,000 per month" },
    { icon: <Shield size={18} />, text: "Secure Stripe payments" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <nav className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-zinc-400
                       hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold">
            Par<span className="text-green-400">io</span>
          </h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black mb-3">
            Join <span className="text-green-400">Pario</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Play golf, support charity, win prizes
          </p>
        </div>

        {/* PLAN TOGGLE */}
        <div className="flex bg-zinc-900 rounded-2xl p-1 mb-8 border border-zinc-800">
          {(["monthly", "yearly"] as const).map((plan) => (
            <button
              key={plan}
              onClick={() => setSelectedPlan(plan)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm
                          transition-all capitalize flex items-center
                          justify-center gap-2 ${
                            selectedPlan === plan
                              ? "bg-green-500 text-black"
                              : "text-zinc-400 hover:text-white"
                          }`}
            >
              {plan}
              {plan === "yearly" && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedPlan === "yearly"
                      ? "bg-black/20 text-black"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  Save 17%
                </span>
              )}
            </button>
          ))}
        </div>

        {/* PRICE CARD */}
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 mb-6">
          {/* Price */}
          <div className="text-center mb-8">
            <p className="text-6xl font-black text-white">
              {plans[selectedPlan].price}
            </p>
            <p className="text-zinc-400 mt-2">{plans[selectedPlan].period}</p>
            {plans[selectedPlan].savings && (
              <span
                className="inline-block mt-2 bg-green-500/20 text-green-400
                               text-sm px-3 py-1 rounded-full font-bold"
              >
                🎉 {plans[selectedPlan].savings}
              </span>
            )}
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-green-400">{f.icon}</div>
                <span className="text-zinc-300">{f.text}</span>
                <Check size={16} className="text-green-400 ml-auto shrink-0" />
              </div>
            ))}
          </div>

          {/* Charity Note */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm text-center">
              ❤️ Minimum <strong>10%</strong> of your subscription goes to your
              chosen charity automatically
            </p>
          </div>

          {error && (
            <p
              className="text-red-400 text-sm bg-red-400/10 px-4 py-3
                          rounded-xl mb-4 text-center"
            >
              ❌ {error}
            </p>
          )}

          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 text-black
                       font-black py-4 rounded-xl text-lg transition-all
                       disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div
                  className="w-5 h-5 border-2 border-black border-t-transparent
                                rounded-full animate-spin"
                />
                Redirecting to Stripe...
              </>
            ) : (
              <>
                <Zap size={20} />
                Subscribe Now — {plans[selectedPlan].price}
              </>
            )}
          </button>

          <p className="text-zinc-500 text-xs text-center mt-4">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 text-zinc-600 text-sm">
          <div className="flex items-center gap-1">
            <Shield size={14} />
            SSL Secured
          </div>
          <div className="flex items-center gap-1">
            <Check size={14} />
            Cancel Anytime
          </div>
          <div className="flex items-center gap-1">
            <Heart size={14} />
            Charity Included
          </div>
        </div>
      </div>
    </div>
  );
}
