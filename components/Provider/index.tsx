"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];
const AUTH_ROUTES = ["/login", "/signup"];

export default function Provider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const { setUser, setSubscription, setScores, setCharity, setLoading, reset } =
    useUserStore();

  useEffect(() => {
    initializeUser();

    // Auth state change listen karo
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        reset();
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const initializeUser = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Not logged in
    if (!user) {
      setLoading(false);
      if (!PUBLIC_ROUTES.includes(pathname)) {
        router.push("/login");
      }
      return;
    }

    // Logged in but on auth routes
    if (AUTH_ROUTES.includes(pathname)) {
      router.push("/dashboard");
      return;
    }

    // Fetch all data ek baar
    const [profile, subscriptionData, scoresData, charityData] =
      await Promise.all([
        supabase.from("users").select("*").eq("id", user.id).single(),
        supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("scores")
          .select("*")
          .eq("user_id", user.id)
          .order("score_date", { ascending: false })
          .limit(5),
        supabase
          .from("user_charity")
          .select("*, charities(*)")
          .eq("user_id", user.id)
          .single(),
      ]);

    setUser(profile.data);
    setScores(scoresData.data || []);
    setCharity(charityData.data);

    const sub = subscriptionData.data;

    // Subscription check
    if (!sub || sub.status !== "active") {
      setSubscription(null);
      setLoading(false);

      // Subscribe page pe hi rehne do
      if (pathname !== "/subscribe") {
        router.push("/subscribe");
      }
      return;
    }

    setSubscription(sub);
    setLoading(false);
  };

  return <>{children}</>;
}
