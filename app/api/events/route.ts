import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const runtime = "edge";

function normalizeISO(x: string | null, end=false) {
  if (!x) return null;
  // If date-only (YYYY-MM-DD), expand to day start/end in UTC
  if (/^\d{4}-\d{2}-\d{2}$/.test(x)) {
    return end ? `${x}T23:59:59.999Z` : `${x}T00:00:00.000Z`;
  }
  return x; // assume caller passed an ISO timestamp
}

export async function GET(req: Request){
  try {
    // Some runtimes may provide a relative req.url (e.g. "/api/events?...").
    // Use the request Host header to build an absolute URL when necessary.
    const host = req.headers.get("host") || "localhost:3000";
    const base = `http://${host}`;
    const url = new URL(req.url, base);
    const city = url.searchParams.get("city") ?? "";
    const fromRaw = url.searchParams.get("from");
    const toRaw   = url.searchParams.get("to");
    const from = normalizeISO(fromRaw, false);
    const to   = normalizeISO(toRaw, true);
    const tags = (url.searchParams.get("tags")||"").split(",").filter(Boolean);
    const q    = url.searchParams.get("q") ?? "";
    const page = Math.max(1, parseInt(url.searchParams.get("page")||"1"));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit")||"20")));
    const offset = (page-1)*limit;

    const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!SUPA_URL || !SUPA_ANON) {
      return NextResponse.json({ items: [], page: 1, total: 0, warning: "MISSING_SUPABASE_ENV" }, { status: 200 });
    }

    const supa = createClient(SUPA_URL, SUPA_ANON);

    let query = supa.from("events").select("*", { count: "exact" });
    if (city) query = query.eq("city", city);
    if (from) query = query.gte("date_start", from);
    if (to)   query = query.lte("date_start", to);
    if (tags.length) query = query.contains("tags", tags);
    if (q)    query = query.textSearch("title", q);
    query = query.order("date_start", { ascending: true }).range(offset, offset+limit-1);

    const { data, error, count } = await query;
    if (error) return NextResponse.json({ items: [], page: 1, total: 0, error: error.message }, { status: 200 });

    return NextResponse.json({ items: data||[], page, total: count||0 }, { headers: { "cache-control":"no-store" }});
  } catch (e:any) {
    return NextResponse.json({ items: [], page: 1, total: 0, error: e?.message || "unknown" }, { status: 200 });
  }
}
