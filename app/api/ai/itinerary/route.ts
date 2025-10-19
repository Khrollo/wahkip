/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { composeWithAI } from "@/lib/ai_itinerary";

export const runtime = "nodejs";

// Request body validation
const RequestSchema = z.object({
  city: z.string().min(1, "City is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  description: z.string().optional().default("I want to experience local culture and activities"),
});

export async function POST(req: NextRequest) {
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

    // If no events, return evergreen fallback
    if (candidateEvents.length === 0) {
      return NextResponse.json({
        itinerary: {
          morning: ["Start your day with coffee"],
          midday: ["Lunch"],
          afternoon: ["Explore the city"],
          evening: ["Dinner"],
          transportNotes: "Use local transportation",
          costEstimate: "$50-$100 USD",
          picks: [],
        },
        warning: "NO_EVENTS_FALLBACK",
      });
    }

    // Use composeWithAI for Gemini-primary, OpenAI-fallback logic
    const { itinerary, warning } = await composeWithAI({
      city,
      date,
      description,
      events: candidateEvents,
    });

    // Filter picks to only include valid candidate IDs
    const candidateIds = candidateEvents.map((e: any) => e.id);
    itinerary.picks = itinerary.picks.filter((id: string) => candidateIds.includes(id));

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
