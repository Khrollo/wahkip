import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserVector } from "@/lib/userModel";
import { eventVector, matchScore, normalizeVector } from "@/lib/similarity";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const city = url.searchParams.get("city") || "Kingston";
  const date = url.searchParams.get("date");
  const sessionId = url.searchParams.get("session_id") || "anon";
  const explain = url.searchParams.get("explain") === "true";

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let query = supa.from("events").select("*").eq("city", city).limit(40);

  if (date) {
    query = query
      .gte("date_start", `${date}T00:00:00.000Z`)
      .lt("date_start", `${date}T23:59:59.999Z`);
  }

  const { data: events } = await query;
  if (!events || events.length === 0) {
    return NextResponse.json({ items: [] });
  }

  const userVec = normalizeVector(await getUserVector(sessionId));
  const hasPreferences = Object.keys(userVec).length > 0;

  const items = events.map((event: any) => {
    const evtVec = eventVector(event);
    const match = hasPreferences ? matchScore(userVec, evtVec) : 50;

    let why: string | undefined;
    if (explain && hasPreferences && match > 60) {
      const topTags = Object.entries(userVec)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tag]) => tag);
      why = `Matches your interests in ${topTags.join(", ")}`;
    }

    return { ...event, match, why };
  });

  items.sort((a, b) => b.match - a.match);

  return NextResponse.json({ items });
}

