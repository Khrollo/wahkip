import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const runtime = "nodejs";

const Schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date_start: z.string(),
  date_end: z.string().optional().nullable(),
  city: z.string().min(1),
  tags: z.array(z.string()),
  capacity: z.enum(["low", "medium", "high"]).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = Schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }

    const data = validation.data;

    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!,
      { auth: { persistSession: false } }
    );

    const { data: newEvent, error } = await supa.from("events").insert({
      title: data.title,
      description: data.description || null,
      date_start: data.date_start,
      date_end: data.date_end || null,
      city: data.city,
      tags: data.tags,
      capacity: data.capacity || null,
    }).select("id").single();

    if (error) throw error;

    return NextResponse.json({ ok: true, id: newEvent.id });
  } catch (e: any) {
    console.error("Error creating event:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

