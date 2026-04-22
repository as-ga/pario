"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Trophy,
  TrendingUp,
  ChevronRight,
  Star,
  Shield,
  Zap,
  Users,
} from "lucide-react";

export default function LandingPage() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev < 12847 ? prev + 137 : 12847));
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            Par<span className="text-green-400">io</span>
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-green-500 hover:bg-green-400 text-black font-bold
                         px-5 py-2 rounded-full text-sm transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30
                       text-green-400 px-4 py-2 rounded-full text-sm mb-8"
          >
            <Heart size={14} />
            Golf. Charity. Wins.
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-6"
          >
            Play Golf.
            <br />
            <span className="text-green-400">Change Lives.</span>
            <br />
            Win Big.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-xl max-w-2xl mx-auto mb-10"
          >
            Subscribe, enter your golf scores, and join the monthly prize draw —
            while automatically supporting a charity you care about.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400
                         text-black font-bold px-8 py-4 rounded-full text-lg
                         transition-all hover:scale-105"
            >
              Start Playing <ChevronRight size={20} />
            </Link>
            <Link
              href="#how-it-works"
              className="text-zinc-400 hover:text-white transition-colors text-lg"
            >
              How it works →
            </Link>
          </motion.div>

          {/* Live Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex items-center justify-center gap-2 text-zinc-500"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">
              <span className="text-white font-bold">
                {count.toLocaleString()}
              </span>{" "}
              players already joined
            </span>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">How Pario Works</h2>
            <p className="text-zinc-400 text-lg">
              Three simple steps to play, give, and win
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Zap size={28} />,
                title: "Subscribe",
                desc: "Choose monthly or yearly plan. Your subscription funds the prize pool and your chosen charity.",
                color: "text-yellow-400",
                bg: "bg-yellow-400/10 border-yellow-400/20",
              },
              {
                step: "02",
                icon: <TrendingUp size={28} />,
                title: "Enter Scores",
                desc: "Log your last 5 golf scores in Stableford format. These become your lottery numbers.",
                color: "text-green-400",
                bg: "bg-green-400/10 border-green-400/20",
              },
              {
                step: "03",
                icon: <Trophy size={28} />,
                title: "Win Prizes",
                desc: "Monthly draw matches your scores. 3, 4, or 5 matches wins you a share of the prize pool!",
                color: "text-blue-400",
                bg: "bg-blue-400/10 border-blue-400/20",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-2xl border ${item.bg}`}
              >
                <span className="text-6xl font-black text-zinc-800 absolute top-4 right-6">
                  {item.step}
                </span>
                <div className={`${item.color} mb-4`}>{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CHARITY SECTION */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div
                className="inline-flex items-center gap-2 bg-red-500/10 border
                              border-red-500/30 text-red-400 px-4 py-2 rounded-full text-sm mb-6"
              >
                <Heart size={14} />
                Charity First
              </div>
              <h2 className="text-4xl font-black mb-6">
                Every subscription
                <span className="text-red-400"> gives back</span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                Minimum 10% of every subscription goes directly to your chosen
                charity. You choose who benefits — we make sure it happens
                automatically.
              </p>

              <div className="space-y-4">
                {[
                  "Cancer Research UK",
                  "Save The Children",
                  "WWF",
                  "Red Cross",
                ].map((charity, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-zinc-300">{charity}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800"
            >
              <p className="text-zinc-400 text-sm mb-2">
                Total donated this month
              </p>
              <p className="text-5xl font-black text-green-400 mb-8">₹24,680</p>

              <div className="space-y-4">
                {[
                  {
                    name: "Cancer Research UK",
                    percent: 34,
                    color: "bg-red-400",
                  },
                  {
                    name: "Save The Children",
                    percent: 28,
                    color: "bg-yellow-400",
                  },
                  { name: "WWF", percent: 22, color: "bg-green-400" },
                  { name: "Red Cross", percent: 16, color: "bg-blue-400" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-300">{item.name}</span>
                      <span className="text-zinc-500">{item.percent}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percent}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRIZE POOL */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">
            This Month&#39;s Prize Pool
          </h2>
          <p className="text-zinc-400 text-lg mb-16">
            Match your scores to win big
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                match: "3 Numbers",
                prize: "₹2,500",
                pool: "25%",
                color: "border-zinc-600",
                badge: "bg-zinc-700",
              },
              {
                match: "4 Numbers",
                prize: "₹8,750",
                pool: "35%",
                color: "border-green-500",
                badge: "bg-green-500",
              },
              {
                match: "5 Numbers 🏆",
                prize: "₹25,000",
                pool: "40%",
                color: "border-yellow-400",
                badge: "bg-yellow-400",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 rounded-2xl border-2 ${item.color} bg-zinc-900`}
              >
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full text-black ${item.badge}`}
                >
                  {item.pool} of pool
                </span>
                <p className="text-zinc-400 mt-4 mb-2">{item.match}</p>
                <p className="text-4xl font-black">{item.prize}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <Shield size={32} />,
                title: "Secure Payments",
                desc: "Stripe-powered, PCI compliant",
                color: "text-blue-400",
              },
              {
                icon: <Users size={32} />,
                title: "12,000+ Players",
                desc: "Growing community worldwide",
                color: "text-green-400",
              },
              {
                icon: <Star size={32} />,
                title: "Verified Winners",
                desc: "Every win verified before payout",
                color: "text-yellow-400",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="p-8"
              >
                <div className={`${item.color} flex justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-zinc-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-black mb-6">
              Ready to <span className="text-green-400">play</span>?
            </h2>
            <p className="text-zinc-400 text-lg mb-10">
              Join thousands of golfers making a difference while competing for
              life-changing prizes.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400
                         text-black font-bold px-10 py-5 rounded-full text-xl
                         transition-all hover:scale-105"
            >
              Join Pario Today <ChevronRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-8 px-6">
        <div
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-center
                        justify-between gap-4"
        >
          <h1 className="text-xl font-bold">
            Par<span className="text-green-400">io</span>
          </h1>
          <p className="text-zinc-500 text-sm">
            © 2026 Pario. All rights reserved.
          </p>
          <div className="flex gap-6 text-zinc-500 text-sm">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
