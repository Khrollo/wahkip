import { createClient } from "@supabase/supabase-js";

const DECAY_FACTOR = 0.95;
const WEIGHTS = { view: 0.5, like: 1.0, save: 1.5 };

export async function getOrCreateUserProfile(sessionId: string) {
  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!,
    { auth: { persistSession: false } }
  );

  const { data: existing } = await supa
    .from("user_profiles")
    .select("id")
    .eq("session_id", sessionId)
    .single();

  if (existing) return existing.id;

  const { data: newProfile } = await supa
    .from("user_profiles")
    .insert({ session_id: sessionId })
    .select("id")
    .single();

  return newProfile?.id;
}

export async function upsertUserInterests(
  sessionId: string,
  tags: string[],
  action: "view" | "like" | "save" = "view"
) {
  const userId = await getOrCreateUserProfile(sessionId);
  if (!userId) return;

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!,
    { auth: { persistSession: false } }
  );

  const weight = WEIGHTS[action];

  for (const tag of tags) {
    const { data: existing } = await supa
      .from("user_interests")
      .select("weight")
      .eq("user_id", userId)
      .eq("tag", tag)
      .single();

    if (existing) {
      await supa
        .from("user_interests")
        .update({
          weight: existing.weight * DECAY_FACTOR + weight,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("tag", tag);
    } else {
      await supa.from("user_interests").insert({
        user_id: userId,
        tag,
        weight,
      });
    }
  }
}

export async function getUserVector(sessionId: string): Promise<Record<string, number>> {
  const userId = await getOrCreateUserProfile(sessionId);
  if (!userId) return {};

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supa
    .from("user_interests")
    .select("tag, weight")
    .eq("user_id", userId);

  const vec: Record<string, number> = {};
  (data || []).forEach((item: any) => {
    vec[item.tag] = item.weight;
  });

  return vec;
}

