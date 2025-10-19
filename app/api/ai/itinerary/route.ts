/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ItinerarySchema } from "@/lib/ai";

export const runtime = "nodejs";
const TIMEOUT_MS = 30_000; // Increased timeout for AI calls

function buildPrompt(city:string, date:string, events:any[], description:string) {
  const list = (events || []).slice(0,12)
    .map((e:any)=>`${e.id}|${e.date_start}|${e.title}|${(e.tags||[]).join("/")}`)
    .join("\n");
  return `
You are Wahkip, an expert local travel planner specializing in creating personalized day itineraries for ${city}.

USER REQUEST: "${description}"
DATE: ${date}

AVAILABLE EVENTS (id|time|title|tags):
${list}

TASK: Create a personalized itinerary that matches what the user wants to experience. Select specific events from the list above and organize them into a logical flow throughout the day.

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "morning": ["Activity 1", "Activity 2"],
  "midday": ["Activity 3", "Activity 4"],
  "afternoon": ["Activity 5"],
  "evening": ["Activity 6"],
  "transportNotes": "Practical transportation advice",
  "costEstimate": { "low": 40, "high": 120, "currency": "USD" },
  "picks": ["event-id-1", "event-id-2", "event-id-3"]
}

RULES:
1. "picks" MUST contain actual event IDs from the list above
2. Morning activities should start around 8-10am
3. Midday activities should be around 12-2pm
4. Afternoon activities should be around 2-5pm
5. Evening activities should be around 6pm+
6. Match activities to the user's description
7. Be specific - mention actual event names or locations
8. Provide realistic cost estimates based on the activities
9. Return ONLY valid JSON, no markdown, no explanations
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
    const apiKey = process.env.OPENAI_API_KEY.trim();
    console.log("🔑 OpenAI key present, making API call...");
    console.log("🔑 Key prefix:", apiKey.substring(0, 10));
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Using gpt-3.5-turbo for lower cost
        temperature: 0.3,
        messages: [
          { role: "system", content: "Return only valid JSON. No prose." },
          { role: "user", content },
        ],
      }),
      signal: controller.signal,
    });
    
    console.log(`📡 OpenAI response status: ${resp.status}`);
    
    if (!resp.ok) {
      const error = await resp.json().catch(() => ({}));
      console.error(`❌ OpenAI error response:`, error);
      throw new Error(`OpenAI API error: ${resp.status} - ${JSON.stringify(error)}`);
    }
    
    const raw = await resp.json();
    const txt = raw?.choices?.[0]?.message?.content;
    if (!txt) throw new Error("No content in OpenAI response");
    
    console.log(`📝 OpenAI response text (first 100 chars): ${txt.substring(0, 100)}`);
    
    // Clean up the response - remove markdown code blocks if present
    const cleaned = txt.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  }

  async function tryGemini() {
    if (!process.env.GEMINI_API_KEY) throw new Error("NO_GEMINI");
    console.log("🔑 Gemini key present, making API call...");
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + process.env.GEMINI_API_KEY;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: content }]}] }),
      signal: controller.signal,
    });
    
    console.log(`📡 Gemini response status: ${resp.status}`);
    
    if (!resp.ok) {
      const error = await resp.json().catch(() => ({}));
      console.error(`❌ Gemini error response:`, error);
      throw new Error(`Gemini API error: ${resp.status} - ${JSON.stringify(error)}`);
    }
    
    const raw = await resp.json();
    const txt = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!txt) throw new Error("No content in Gemini response");
    
    console.log(`📝 Gemini response text (first 100 chars): ${txt.substring(0, 100)}`);
    
    // Clean up the response - remove markdown code blocks if present
    const cleaned = txt.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  }

          try {
            let parsed: any;
            let errorLog = "";
            
            try {
              console.log("🤖 Attempting OpenAI...");
              console.log("Prompt length:", content.length);
              parsed = await tryOpenAI();
              console.log("✅ OpenAI success - Response:", JSON.stringify(parsed).substring(0, 200));
            } catch (e: any) {
              errorLog += `OpenAI: ${e.message}; `;
              console.error("❌ OpenAI failed:", e.message);
              
              try {
                console.log("🤖 Attempting Gemini...");
                parsed = await tryGemini();
                console.log("✅ Gemini success - Response:", JSON.stringify(parsed).substring(0, 200));
              } catch (e2: any) {
                errorLog += `Gemini: ${e2.message}`;
                console.error("❌ Gemini failed:", e2.message);
                throw new Error(errorLog);
              }
            }
            
            clearTimeout(timer);
            itinerary = ItinerarySchema.parse(parsed);
            console.log("✅ Itinerary validated and ready");
  } catch (e: any) {
    console.error("AI generation failed, using fallback:", e.message);
    // Smart fallback using actual events
    const eventList = events || [];
    const musicEvents = eventList.filter((e:any) => e.tags?.includes("music")).slice(0, 2);
    const foodEvents = eventList.filter((e:any) => e.tags?.includes("food")).slice(0, 1);
    const cultureEvents = eventList.filter((e:any) => e.tags?.some((t:string) => ["culture", "art", "heritage"].includes(t))).slice(0, 1);
    
    const allPicks = [...musicEvents, ...foodEvents, ...cultureEvents].map((e:any) => e.id);
    
    itinerary = {
      morning: [
        "Start your day with coffee at a local cafe",
        musicEvents[0] ? musicEvents[0].title : "Explore the city center"
      ],
      midday: [
        foodEvents[0] ? foodEvents[0].title : "Enjoy authentic local cuisine",
        cultureEvents[0] ? cultureEvents[0].title : "Visit a cultural landmark"
      ],
      afternoon: [
        musicEvents[1] ? musicEvents[1].title : "Experience local music scene",
        "Relax and take in the atmosphere"
      ],
      evening: [
        "Dinner at a recommended restaurant",
        "Nightlife and entertainment"
      ],
      transportNotes: "Use local taxis or ride-sharing between venues. Most areas are walkable.",
      costEstimate: { low: 50, high: 150, currency: "USD" },
      picks: allPicks.length > 0 ? allPicks : eventList.slice(0, 4).map((e:any) => e.id),
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

