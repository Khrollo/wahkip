import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const runtime = "nodejs";

const Schema = z.object({
  helper_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  session_id: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = Schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { helper_id, rating, comment, session_id } = validation.data;

    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!,
      { auth: { persistSession: false } }
    );

    // Get/create user profile
    const { data: profile } = await supa
      .from("user_profiles")
      .select("id")
      .eq("session_id", session_id)
      .single();

    const userId = profile?.id;

    const { data, error } = await supa.from("helper_reviews").insert({
      helper_id,
      rating,
      comment,
      user_id: userId,
    }).select();

    if (error) throw error;

    return NextResponse.json({ ok: true, review: data[0] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const helperId = url.searchParams.get("helper_id");

  if (!helperId) {
    return NextResponse.json({ error: "helper_id required" }, { status: 400 });
  }

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supa
    .from("helper_reviews")
    .select("*")
    .eq("helper_id", helperId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ reviews: data || [] });
}

