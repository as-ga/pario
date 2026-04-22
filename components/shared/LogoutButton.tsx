"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-zinc-400 hover:text-red-400 transition-colors text-sm"
    >
      Logout
    </button>
  );
}
