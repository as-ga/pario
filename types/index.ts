export type UserRole = "user" | "admin";

export type SubscriptionPlan = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "cancelled" | "lapsed";

export type DrawStatus = "draft" | "published";

export type PaymentStatus = "pending" | "paid";

export type VerificationStatus = "pending" | "approved" | "rejected";

// =====================
// USER
// =====================
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// =====================
// SUBSCRIPTION
// =====================
export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount: number;
  stripe_customer_id: string | null;
  stripe_sub_id: string | null;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

// =====================
// SCORE
// =====================
export interface Score {
  id: string;
  user_id: string;
  score: number;
  score_date: string;
  created_at: string;
}

// =====================
// CHARITY
// =====================
export interface Charity {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

// =====================
// USER CHARITY
// =====================
export interface UserCharity {
  id: string;
  user_id: string;
  charity_id: string;
  contribution_percent: number;
  updated_at: string;
  charities?: Charity;
}

// =====================
// DRAW
// =====================
export interface Draw {
  id: string;
  month: string;
  drawn_numbers: number[];
  status: DrawStatus;
  prize_pool: number;
  created_at: string;
  published_at: string | null;
}

// =====================
// DRAW RESULT
// =====================
export interface DrawResult {
  id: string;
  draw_id: string;
  user_id: string;
  matched: 3 | 4 | 5;
  prize_amount: number;
  status: PaymentStatus;
  created_at: string;
}

// =====================
// WINNER VERIFICATION
// =====================
export interface WinnerVerification {
  id: string;
  result_id: string;
  user_id: string;
  proof_url: string | null;
  status: VerificationStatus;
  reviewed_at: string | null;
  created_at: string;
}

// =====================
// DASHBOARD DATA
// =====================
export interface DashboardData {
  user: User;
  subscription: Subscription | null;
  scores: Score[];
  charity: UserCharity | null;
  recentResults: DrawResult[];
}
