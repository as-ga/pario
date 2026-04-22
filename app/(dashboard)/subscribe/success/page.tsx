"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { CheckCircle, Trophy, Heart, TrendingUp } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("");

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      router.push("/dashboard");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const res = await fetch("/api/subscription/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, userId: user.id }),
    });

    const data = await res.json();
    if (data.plan) setPlan(data.plan);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-10 h-10 border-2 border-green-400 border-t-transparent
                          rounded-full animate-spin mx-auto mb-4"
          />
          <p className="text-zinc-400">Payment verify ho raha hai...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black text-white flex items-center
                    justify-center px-6"
    >
      <div className="max-w-md w-full text-center">
        <div
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center
                        justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-green-400" />
        </div>

        <h1 className="text-4xl font-black mb-3">
          Welcome to <span className="text-green-400">Pario!</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-8">
          {plan === "yearly" ? "Yearly" : "Monthly"} subscription active ho
          gayi!
        </p>

        <div
          className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800
                        text-left space-y-4 mb-8"
        >
          <p className="text-zinc-400 text-sm font-bold mb-3">
            Ab kya karna hai:
          </p>
          {[
            {
              icon: <TrendingUp size={18} className="text-green-400" />,
              text: "Golf scores add karo",
              href: "/scores",
            },
            {
              icon: <Heart size={18} className="text-red-400" />,
              text: "Charity choose karo",
              href: "/charity",
            },
            {
              icon: <Trophy size={18} className="text-yellow-400" />,
              text: "Draw results dekho",
              href: "/draws",
            },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-3 hover:text-green-400
                         transition-colors"
            >
              {item.icon}
              <span>{item.text}</span>
              <span className="ml-auto text-zinc-600">→</span>
            </Link>
          ))}
        </div>

        <Link
          href="/dashboard"
          className="inline-block w-full bg-green-500 hover:bg-green-400
                     text-black font-black py-4 rounded-xl text-lg transition-all"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

// Suspense boundary wrap karo
export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div
            className="w-10 h-10 border-2 border-green-400 border-t-transparent
                        rounded-full animate-spin"
          />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
