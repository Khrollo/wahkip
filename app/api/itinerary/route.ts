import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const u = new URL(req.url);
    const id = u.searchParams.get("id");
    if (!id) return NextResponse.json({ item: null });

    const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!SUPA_URL || !SUPA_ANON) {
      return NextResponse.json({ item: null, warning: "MISSING_SUPABASE_ENV" });
    }

    const supa = createClient(SUPA_URL, SUPA_ANON);
    const { data, error } = await supa.from("itineraries").select("id, json").eq("id", id).single();
    if (error) return NextResponse.json({ item: null });

    return NextResponse.json({ item: data });
  } catch (e: any) {
    return NextResponse.json({ item: null });
  }
}

