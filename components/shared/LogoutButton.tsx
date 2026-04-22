"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  const reset = useUserStore((state) => state.reset);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    reset();
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
