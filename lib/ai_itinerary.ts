import { stripCodeFences, ItinerarySchema, normalizeItinerary } from "./ai";
import { getDemoItinerary } from "./demo_itineraries";

const TIMEOUT_MS = 30_000;

export async function composeWithAI(payload: {
  city: string;
  date: string;
  description: string;
  events: any[];
}) {
  const { city, date, description, events } = payload;

  // Use curated demo itineraries for hackathon presentation
  if (process.env.DEMO_MODE === "true") {
    const demoItinerary = getDemoItinerary(description);
    // Merge with actual event picks if available
    if (events.length > 0) {
      demoItinerary.picks = events.slice(0, 4).map((e: any) => e.id);
    }
    return { itinerary: demoItinerary, warning: undefined };
  }

  const prompt = buildPrompt(city, date, events, description);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const isPrimaryGemini = process.env.AI_PRIMARY === "gemini";
  let itinerary: any;
  let warning: string | undefined;

  try {
    if (isPrimaryGemini) {
      try {
        itinerary = await callGemini(prompt, controller.signal);
      } catch {
        itinerary = await callOpenAI(prompt, controller.signal);
      }
    } else {
      try {
        itinerary = await callOpenAI(prompt, controller.signal);
      } catch {
        itinerary = await callGemini(prompt, controller.signal);
      }
    }
  } catch (e: any) {
    warning = e.message.includes("quota") ? "AI_QUOTA" : "AI_FALLBACK";
    itinerary = buildDeterministicFallback(events);
  } finally {
    clearTimeout(timer);
  }

  return { itinerary: normalizeItinerary(itinerary), warning };
}

async function callGemini(prompt: string, signal: AbortSignal) {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("NO_GEMINI");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    signal,
  });

  if (!resp.ok) throw new Error(`Gemini ${resp.status}`);

  const raw = await resp.json();
  const txt = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!txt) throw new Error("No Gemini content");

  const cleaned = stripCodeFences(txt);
  const parsed = JSON.parse(cleaned);
  return ItinerarySchema.parse(parsed);
}

async function callOpenAI(prompt: string, signal: AbortSignal) {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) throw new Error("NO_OPENAI");

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: "Return only valid JSON. No markdown." },
        { role: "user", content: prompt },
      ],
    }),
    signal,
  });

  if (!resp.ok) throw new Error(`OpenAI ${resp.status}`);

  const raw = await resp.json();
  const txt = raw?.choices?.[0]?.message?.content;
  if (!txt) throw new Error("No OpenAI content");

  const cleaned = stripCodeFences(txt);
  const parsed = JSON.parse(cleaned);
  return ItinerarySchema.parse(parsed);
}

function buildPrompt(city: string, date: string, events: any[], description: string) {
  const list = events.slice(0, 12)
    .map(e => `${e.id}|${e.date_start}|${e.title}|${e.tags.join("/")}`)
    .join("\n");

  return `
You are Wahkip. Create a day itinerary ONLY from these events in ${city}.
USER: "${description}"
DATE: ${date}

EVENTS (id|time|title|tags):
${list}

OUTPUT STRICT JSON:
{
  "morning": ["Activity 1"],
  "midday": ["Activity 2"],
  "afternoon": ["Activity 3"],
  "evening": ["Activity 4"],
  "transportNotes": "Transport advice",
  "costEstimate": {"low": 40, "high": 120, "currency": "USD"},
  "picks": ["event-id-1", "event-id-2"]
}

RULES:
1. picks = valid IDs from list
2. If night request → emphasize evening
3. Reference event titles
4. ONLY JSON. No markdown.
`.trim();
}

function buildDeterministicFallback(events: any[]) {
  const picks = events.slice(0, 4).map(e => e.id);
  return {
    morning: ["Start with coffee", events[0]?.title || "Explore city"],
    midday: ["Lunch", events[1]?.title || "Cultural venue"],
    afternoon: [events[2]?.title || "Afternoon activity"],
    evening: ["Dinner", events[3]?.title || "Evening entertainment"],
    transportNotes: "Use local taxis or walk between venues.",
    costEstimate: "$50-$150 USD",
    picks,
  };
}

