"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Trophy,
  Heart,
  CheckCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    console.log("User role:", data); // Debug log

    if (data?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/users", label: "Users", icon: <Users size={18} /> },
    { href: "/admin/draws", label: "Draws", icon: <Trophy size={18} /> },
    { href: "/admin/charities", label: "Charities", icon: <Heart size={18} /> },
    {
      href: "/admin/winners",
      label: "Winners",
      icon: <CheckCircle size={18} />,
    },
  ];

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
    <div className="min-h-screen bg-black text-white flex">
      {/* SIDEBAR — Desktop */}
      <aside
        className="hidden md:flex flex-col w-60 border-r border-zinc-800
                         bg-zinc-950 fixed h-full"
      >
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-black">
            Par<span className="text-green-400">io</span>
            <span className="text-xs text-zinc-500 ml-2 font-normal">
              Admin
            </span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl
                          transition-all text-sm font-medium ${
                            pathname === item.href
                              ? "bg-green-500/20 text-green-400"
                              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                          }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl
                       text-zinc-400 hover:text-red-400 transition-colors
                       text-sm w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div
        className="md:hidden fixed top-0 w-full z-50 bg-zinc-950
                      border-b border-zinc-800 px-4 py-4 flex items-center
                      justify-between"
      >
        <h1 className="text-lg font-black">
          Par<span className="text-green-400">io</span>
          <span className="text-xs text-zinc-500 ml-2 font-normal">Admin</span>
        </h1>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-zinc-950 pt-16 px-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl
                            transition-all text-sm font-medium ${
                              pathname === item.href
                                ? "bg-green-500/20 text-green-400"
                                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                            }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl
                         text-zinc-400 hover:text-red-400 transition-colors
                         text-sm w-full mt-4"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-60 pt-16 md:pt-0">{children}</main>
    </div>
  );
}
