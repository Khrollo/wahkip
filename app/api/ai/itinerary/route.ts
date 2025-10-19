/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ItinerarySchema } from "@/lib/ai";

export const runtime = "nodejs";
const TIMEOUT_MS = 20_000;

function buildPrompt(city:string, date:string, events:any[], description:string) {
  const list = (events || []).slice(0,12)
    .map((e:any)=>`${e.id}|${e.date_start}|${e.title}|${(e.tags||[]).join("/")}`)
    .join("\n");
  return `
You are Wahkip, an expert local travel planner that creates personalized day itineraries.

City: ${city}
Date: ${date}
User's description: "${description}"

Available events (id|time|title|tags):
${list}

Create a personalized itinerary based on what the user wants to experience. Match events that align with their description.

Return STRICT JSON matching:
{
  "morning": string[],
  "midday": string[],
  "afternoon": string[],
  "evening": string[],
  "transportNotes": string,
  "costEstimate": { "low": number, "high": number, "currency": "USD" },
  "picks": string[]
}

Rules:
- Match events to what the user described they want to experience
- Distribute items across morning/midday/afternoon/evening time slots
- "picks" must be a subset of the event ids listed above
- Be creative but practical
- No extra commentary; ONLY JSON.
`.trim();
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=> ({} as any));
  const city: string | undefined = body.city;
  const date: string | undefined = body.date;
  const description: string = body.description || "I want to experience local culture and activities";

  if (!city || !date) {
    return NextResponse.json({ error: "city and date required" }, { status: 400 });
  }

  // Server-side Supabase (service role for writes)
  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE! // server-only secret
  );

  // Fetch candidate events for the given day
  const start = `${date}T00:00:00.000Z`;
  const end   = `${date}T23:59:59.999Z`;
  const { data: events, error: eErr } = await supa
    .from("events")
    .select("*")
    .eq("city", city)
    .gte("date_start", start)
    .lte("date_start", end)
    .order("date_start", { ascending: true })
    .limit(50);

  if (eErr) return NextResponse.json({ error: eErr.message }, { status: 400 });

  // ===== AI call with strict JSON + zod validation, with fallback =====
  let itinerary: any;
  let usedFallback = false;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const content = buildPrompt(city, date, events || [], description);

  async function tryOpenAI() {
    if (!process.env.OPENAI_API_KEY) throw new Error("NO_OPENAI");
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: "Return only valid JSON. No prose." },
          { role: "user", content },
        ],
      }),
      signal: controller.signal,
    });
    const raw = await resp.json();
    const txt = raw?.choices?.[0]?.message?.content;
    return JSON.parse(txt);
  }

  async function tryGemini() {
    if (!process.env.GEMINI_API_KEY) throw new Error("NO_GEMINI");
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: content }]}] }),
      signal: controller.signal,
    });
    const raw = await resp.json();
    const txt = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(txt);
  }

  try {
    let parsed: any;
    try {
      parsed = await tryOpenAI();
    } catch {
      parsed = await tryGemini();
    }
    clearTimeout(timer);
    itinerary = ItinerarySchema.parse(parsed);
  } catch {
    // deterministic fallback
    const picks = (events || []).slice(0, 4).map((e:any)=> e.id);
    itinerary = {
      morning: ["Coffee at a local spot", "Stroll a safe central area"],
      midday: ["Visit a cultural venue or market"],
      afternoon: ["Top event from the list"],
      evening: ["Dinner + nightlife cluster"],
      transportNotes: "Use taxi between clusters; walk for close venues.",
      costEstimate: { low: 40, high: 120, currency: "USD" },
      picks,
    };
    usedFallback = true;
  }

  // Persist the request + itinerary
  const { data: reqRow, error: rErr } = await supa
    .from("itinerary_requests")
    .insert({ city, date, interests: [] })
    .select("id")
    .single();
  if (rErr) return NextResponse.json({ error: rErr.message }, { status: 400 });

  const { data: itinRow, error: iErr } = await supa
    .from("itineraries")
    .insert({ request_id: reqRow!.id, json: itinerary, picks: itinerary.picks })
    .select("id")
    .single();
  if (iErr) return NextResponse.json({ error: iErr.message }, { status: 400 });

  return NextResponse.json({
    itinerary,
    picks: itinerary.picks,
    itinerary_id: itinRow!.id,
    ...(usedFallback ? { warning: "AI_FALLBACK" } : {}),
  });
}

