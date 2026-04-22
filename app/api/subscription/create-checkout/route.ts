import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    // Prices
    const prices = {
      monthly: 99900, // ₹999
      yearly: 999000, // ₹9990
    };

    const amount = prices[plan as keyof typeof prices];
    if (!amount) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Stripe checkout session banao

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "required", // ← Yeh add karo
      customer_email: undefined,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Pario ${plan === "monthly" ? "Monthly" : "Yearly"} Plan`,
              description: "Golf scores, monthly draws, charity contributions",
            },
            unit_amount: amount,
            recurring: {
              interval: plan === "monthly" ? "month" : "year",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
