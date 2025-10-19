import { NextResponse } from "next/server";
export const runtime = "edge";

export async function GET() {
  const ok = {
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    service: !!process.env.SUPABASE_SERVICE_ROLE,
  };
  return NextResponse.json({ ok, service: "wahkip" }, { headers: { "cache-control": "no-store" }});
}
