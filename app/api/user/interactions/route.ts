import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertUserInterests } from "@/lib/userModel";

export const runtime = "nodejs";

const Schema = z.object({
  session_id: z.string(),
  event_tags: z.array(z.string()),
  action: z.enum(["view", "like", "save"]).default("view"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = Schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { session_id, event_tags, action } = validation.data;
    await upsertUserInterests(session_id, event_tags, action);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Error tracking interaction:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

