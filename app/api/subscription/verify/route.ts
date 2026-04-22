import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, userId } = await req.json();

    if (!sessionId || !userId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Stripe session verify karo
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Plan determine karo
    let plan = "monthly";
    let amount = 999;

    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const interval = subscription.items.data[0].plan.interval;
      if (interval === "year") {
        plan = "yearly";
        amount = 9999;
      }
    }

    // End date calculate karo
    const endDate = new Date();
    if (plan === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Browser client use karo — server client nahi
    const supabase = createClient();

    const { error: subError } = await supabase.from("subscriptions").upsert(
      {
        user_id: userId,
        plan,
        status: "active",
        amount,
        stripe_customer_id: session.customer as string,
        stripe_sub_id: session.subscription as string,
        start_date: new Date().toISOString(),
        end_date: endDate.toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (subError) {
      console.error("Subscription save error:", subError);
      return NextResponse.json({ error: "Save failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";
// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";

// export async function POST(req: NextRequest) {
//   try {
//     const { sessionId, userId } = await req.json();

//     // Stripe session verify karo
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status !== "paid") {
//       return NextResponse.json(
//         { error: "Payment not completed" },
//         { status: 400 }
//       );
//     }

//     const cookieStore = cookies();
//     const supabase = createServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           getAll() {
//             return cookieStore.getAll();
//           },
//           setAll(cookiesToSet) {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options)
//             );
//           },
//         },
//       }
//     );

//     // Plan determine karo
//     const interval = session.subscription
//       ? (await stripe.subscriptions.retrieve(session.subscription as string))
//           .items.data[0].plan.interval
//       : "month";

//     const plan = interval === "year" ? "yearly" : "monthly";
//     const amount = plan === "monthly" ? 999 : 9990;

//     // End date calculate karo
//     const endDate = new Date();
//     if (plan === "monthly") endDate.setMonth(endDate.getMonth() + 1);
//     else endDate.setFullYear(endDate.getFullYear() + 1);

//     // Subscription save karo
//     // await supabase.from("subscriptions").upsert(
//     //   {
//     //     user_id: userId,
//     //     plan,
//     //     status: "active",
//     //     amount,
//     //     stripe_customer_id: session.customer as string,
//     //     stripe_sub_id: session.subscription as string,
//     //     start_date: new Date().toISOString(),
//     //     end_date: endDate.toISOString(),
//     //   },
//     //   { onConflict: "user_id" }
//     // );

//     const { error: subError } = await supabase.from("subscriptions").upsert(
//       {
//         user_id: userId,
//         plan,
//         status: "active",
//         amount,
//         stripe_customer_id: session.customer as string,
//         stripe_sub_id: session.subscription as string,
//         start_date: new Date().toISOString(),
//         end_date: endDate.toISOString(),
//       },
//       { onConflict: "user_id" }
//     );

//     console.log("Sub error:", subError);
//     console.log("User ID:", userId);

//     return NextResponse.json({ success: true, plan });
//   } catch (error) {
//     console.error("Verify error:", error);
//     return NextResponse.json({ error: "Verification failed" }, { status: 500 });
//   }
// }
