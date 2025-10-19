import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.name || !body.city) {
      return NextResponse.json({ ok: false, error: "name and city required" }, { status: 400 });
    }

    const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPA_SERVICE = process.env.SUPABASE_SERVICE_ROLE;
    if (!SUPA_URL || !SUPA_SERVICE) {
      return NextResponse.json({ ok: false, error: "MISSING_SUPABASE_ENV" }, { status: 500 });
    }

    const supa = createClient(SUPA_URL, SUPA_SERVICE, { auth: { persistSession: false } });

    const { data, error } = await supa.from("helpers").insert({
      name: body.name,
      city: body.city,
      langs: body.langs ?? [],
      skills: body.skills ?? [],
      rate_min: body.rate_min ?? null,
      rate_max: body.rate_max ?? null,
      phone: body.phone ?? null,
      whatsapp: body.whatsapp ?? null,
      verified: false
    }).select("id");
    
    if (error) throw error;

    return NextResponse.json({ ok: true, id: data?.[0]?.id ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

