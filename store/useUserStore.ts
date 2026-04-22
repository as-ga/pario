import { create } from "zustand";
import type { User, Subscription, Score, UserCharity } from "@/types";

interface UserStore {
  // State
  user: User | null;
  subscription: Subscription | null;
  scores: Score[];
  charity: UserCharity | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSubscription: (subscription: Subscription | null) => void;
  setScores: (scores: Score[]) => void;
  setCharity: (charity: UserCharity | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  // Initial State
  user: null,
  subscription: null,
  scores: [],
  charity: null,
  isLoading: true,
  isInitialized: false,

  // Actions
  setUser: (user) => set({ user }),
  setSubscription: (subscription) => set({ subscription }),
  setScores: (scores) => set({ scores }),
  setCharity: (charity) => set({ charity }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () =>
    set({
      user: null,
      subscription: null,
      scores: [],
      charity: null,
      isLoading: false,
      isInitialized: false,
    }),
}));
