"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    console.log("Signup successful:", data); // Debugging ke liye

    let createdUser = null;
    // Users table mein insert karo
    if (data.user) {
      createdUser = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        role: "user",
      });
    }
    console.log("User created in DB:", createdUser); // Debugging ke liye

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Pario</h1>
          <p className="text-zinc-400 mt-1">Play. Give. Win.</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-zinc-400 text-sm">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rahul Sharma"
              className="w-full mt-1 bg-zinc-800 text-white rounded-lg px-4 py-3 
                         border border-zinc-700 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahul@email.com"
              className="w-full mt-1 bg-zinc-800 text-white rounded-lg px-4 py-3 
                         border border-zinc-700 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 bg-zinc-800 text-white rounded-lg px-4 py-3 
                         border border-zinc-700 focus:outline-none focus:border-green-500"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold 
                       py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>

        <p className="text-zinc-400 text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
