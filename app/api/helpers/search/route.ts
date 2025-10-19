import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const u = new URL(req.url);
    const city = u.searchParams.get("city") ?? "";
    const skills = (u.searchParams.get("skills") || "").split(",").filter(Boolean);

    const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!SUPA_URL || !SUPA_ANON) {
      return NextResponse.json({ items: [], suggestedPriceRange: { min: 40, max: 120 }, warning: "MISSING_SUPABASE_ENV" });
    }

    const supa = createClient(SUPA_URL, SUPA_ANON);
    let q = supa.from("helpers").select("*").eq("verified", true);
    if (city) q = q.eq("city", city);
    if (skills.length) q = q.contains("skills", skills);

    const { data, error } = await q.limit(20);
    if (error) return NextResponse.json({ items: [], suggestedPriceRange: { min: 40, max: 120 }, error: error.message });

    const rates = (data || []).map((h: any) => [h.rate_min || 0, h.rate_max || 0]);
    const min = Math.min(...rates.map(r => r[0]).filter(n => n > 0)) || 40;
    const max = Math.max(...rates.map(r => r[1]).filter(n => n > 0)) || 120;

    return NextResponse.json({ items: data || [], suggestedPriceRange: { min, max } });
  } catch (e: any) {
    return NextResponse.json({ items: [], suggestedPriceRange: { min: 40, max: 120 }, error: e?.message });
  }
}

