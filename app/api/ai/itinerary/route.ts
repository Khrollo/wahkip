/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { ItinerarySchema, normalizeItinerary, stripCodeFences } from "@/lib/ai";

export const runtime = "nodejs";
const TIMEOUT_MS = 30_000;

// Request body validation
const RequestSchema = z.object({
  city: z.string().min(1, "City is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  description: z.string().optional().default("I want to experience local culture and activities"),
});

function buildPrompt(city: string, date: string, events: any[], description: string) {
  const list = events
    .slice(0, 12)
    .map((e: any) => `${e.id}|${e.date_start}|${e.title}|${(e.tags || []).join("/")}`)
    .join("\n");

  return `
You are Wahkip, an expert local travel planner creating itineraries ONLY from the provided events in ${city}.
USER REQUEST: "${description}"
DATE: ${date}

AVAILABLE EVENTS (id|time|title|tags):
${list}

OUTPUT STRICT JSON ONLY:
{
  "morning": ["Activity 1", "Activity 2"],
  "midday": ["Activity 3", "Activity 4"],
  "afternoon": ["Activity 5"],
  "evening": ["Activity 6"],
  "transportNotes": "Practical transportation advice",
  "costEstimate": { "low": 40, "high": 120, "currency": "USD" },
  "picks": ["event-id-1", "event-id-2"]
}

RULES:
1. "picks" MUST be valid event IDs from the list above (no made-up IDs).
2. If the user's request implies night plans, emphasize the "evening" section.
3. Be specific: reference actual event titles from the list.
4. Keep the plan realistic and sequenced.
5. Return ONLY valid JSON. No markdown. No commentary.
`.trim();
}

function createDeterministicFallback(events: any[], description: string, warning: string) {
  const eventList = events || [];
  
  // Parse description to find relevant events
  const lowerDesc = description.toLowerCase();
  const musicEvents = eventList.filter((e: any) => e.tags?.includes("music")).slice(0, 2);
  const foodEvents = eventList.filter((e: any) => e.tags?.includes("food")).slice(0, 1);
  const cultureEvents = eventList.filter((e: any) =>
    e.tags?.some((t: string) => ["culture", "art", "heritage"].includes(t))
  ).slice(0, 1);
  const wellnessEvents = eventList.filter((e: any) => e.tags?.includes("wellness")).slice(0, 1);

  const allPicks = [...musicEvents, ...foodEvents, ...cultureEvents, ...wellnessEvents]
    .map((e: any) => e.id)
    .filter(Boolean);

  const itinerary = {
    morning: [
      "Start your day with coffee at a local cafe",
      musicEvents[0]?.title || "Explore the city center",
    ],
    midday: [
      foodEvents[0]?.title || "Enjoy authentic local cuisine",
      cultureEvents[0]?.title || "Visit a cultural landmark",
    ],
    afternoon: [
      musicEvents[1]?.title || wellnessEvents[0]?.title || "Experience local attractions",
      "Relax and take in the atmosphere",
    ],
    evening: [
      "Dinner at a recommended restaurant",
      "Nightlife and entertainment",
    ],
    transportNotes: "Use local taxis or ride-sharing between venues. Most areas are walkable.",
    costEstimate: "$50-$150 USD",
    picks: allPicks.length > 0 ? allPicks : eventList.slice(0, 4).map((e: any) => e.id),
  };

  return { itinerary, warning };
}

export async function POST(req: NextRequest) {
  let timer: NodeJS.Timeout | undefined = undefined;

  try {
    // Validate request body
    const body = await req.json().catch(() => ({} as any));
    const validation = RequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { city, date, description } = validation.data;

    // Initialize Supabase client with service role (server-only)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials");
      return NextResponse.json(
        { error: "Server configuration error", warning: "NO_SUPABASE_CONFIG" },
        { status: 500 }
      );
    }

    const supa = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Fetch candidate events for the specified date
    const { data: events, error: eventsError } = await supa
      .from("events")
      .select("id, title, date_start, tags")
      .eq("city", city)
      .gte("date_start", `${date}T00:00:00.000Z`)
      .lt("date_start", `${date}T23:59:59.999Z`)
      .order("date_start", { ascending: true })
      .limit(50);

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
    }

    const candidateEvents = events || [];
    const candidateIds = candidateEvents.map((e: any) => e.id);

    // If no events, return evergreen fallback
    if (candidateEvents.length === 0) {
      const fallback = createDeterministicFallback([], description, "NO_EVENTS_FALLBACK");
      return NextResponse.json(fallback);
    }

    // Build prompt
    const content = buildPrompt(city, date, candidateEvents, description);

    // AI call with timeout
    const controller = new AbortController();
    timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let itinerary: any;
    let warning: string | undefined;

    // Try OpenAI first
    const openAIKey = process.env.OPENAI_API_KEY?.trim();
    
    if (openAIKey) {
      try {
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            authorization: `Bearer ${openAIKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.3,
            messages: [
              { role: "system", content: "Return only valid JSON. No prose. No markdown." },
              { role: "user", content },
            ],
          }),
          signal: controller.signal,
        });

        if (resp.ok) {
          const raw = await resp.json();
          const txt = raw?.choices?.[0]?.message?.content;
          
          if (txt) {
            const cleaned = stripCodeFences(txt);
            const parsed = JSON.parse(cleaned);
            const validated = ItinerarySchema.parse(parsed);
            
            // Filter picks to only include valid candidate IDs
            validated.picks = validated.picks.filter((id: string) => candidateIds.includes(id));
            
            // Normalize itinerary
            itinerary = normalizeItinerary(validated);
            if (timer) clearTimeout(timer);
            timer = undefined;
          } else {
            throw new Error("No content in OpenAI response");
          }
        } else {
          const error = await resp.json().catch(() => ({}));
          if (resp.status === 429) {
            warning = "AI_QUOTA";
          } else {
            throw new Error(`OpenAI API error: ${resp.status}`);
          }
        }
      } catch (e: any) {
        if (e.name === "AbortError") {
          warning = "AI_TIMEOUT";
        } else if (!warning) {
          warning = "AI_ERROR";
        }
        console.error("OpenAI call failed:", e.message);
      }
    } else {
      warning = "NO_OPENAI_KEY";
    }

    // If OpenAI failed, try Gemini
    if (!itinerary && process.env.GEMINI_API_KEY) {
      try {
        const geminiKey = process.env.GEMINI_API_KEY.trim();
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`;
        
        const resp = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: content }] }] }),
          signal: controller.signal,
        });

        if (resp.ok) {
          const raw = await resp.json();
          const txt = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (txt) {
            const cleaned = stripCodeFences(txt);
            const parsed = JSON.parse(cleaned);
            const validated = ItinerarySchema.parse(parsed);
            
            // Filter picks to only include valid candidate IDs
            validated.picks = validated.picks.filter((id: string) => candidateIds.includes(id));
            
            // Normalize itinerary
            itinerary = normalizeItinerary(validated);
            if (timer) clearTimeout(timer);
            timer = undefined;
          } else {
            throw new Error("No content in Gemini response");
          }
        } else {
          const error = await resp.json().catch(() => ({}));
          if (resp.status === 429) {
            warning = "AI_QUOTA";
          } else {
            throw new Error(`Gemini API error: ${resp.status}`);
          }
        }
      } catch (e: any) {
        if (e.name === "AbortError") {
          warning = "AI_TIMEOUT";
        } else if (!warning) {
          warning = "AI_ERROR";
        }
        console.error("Gemini call failed:", e.message);
      }
    }

    // If AI failed, use deterministic fallback
    if (!itinerary) {
      const fallback = createDeterministicFallback(
        candidateEvents,
        description,
        warning || "AI_FALLBACK"
      );
      itinerary = fallback.itinerary;
      warning = fallback.warning;
    }

    // Persist the request + itinerary
    const { data: reqRow, error: rErr } = await supa
      .from("itinerary_requests")
      .insert({ city, date, interests: [] })
      .select("id")
      .single();

    if (rErr) {
      console.error("Error inserting request:", rErr);
      return NextResponse.json(
        { error: "Failed to save itinerary", warning },
        { status: 500 }
      );
    }

    const { data: itinRow, error: iErr } = await supa
      .from("itineraries")
      .insert({
        request_id: reqRow!.id,
        json: itinerary,
        picks: itinerary.picks,
      })
      .select("id")
      .single();

    if (iErr) {
      console.error("Error inserting itinerary:", iErr);
      return NextResponse.json(
        { error: "Failed to save itinerary", warning },
        { status: 500 }
      );
    }

    return NextResponse.json({
      itinerary,
      picks: itinerary.picks,
      itinerary_id: itinRow!.id,
      ...(warning ? { warning } : {}),
    });
  } catch (e: any) {
    console.error("Unexpected error:", e);
    return NextResponse.json(
      { error: "Internal server error", warning: "UNEXPECTED_ERROR" },
      { status: 500 }
    );
  } finally {
    // Always clear timeout
    if (timer) {
      clearTimeout(timer);
    }
  }
}
