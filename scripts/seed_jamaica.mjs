import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// ---- read env safely (no TS non-null assertions) ----
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE;
if (!url || !service) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE in .env.local");
  process.exit(1);
}
const db = createClient(url, service, { auth: { persistSession: false }});

// ---- helpers to work in America/Jamaica time (simple, good enough for demo) ----
const TZ = "America/Jamaica";

// Returns Date for Jamaica "now", constructed via formatToParts (approx; fine for demo)
function nowJA() {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map(p => [p.type, p.value]));
  // Construct a naive local timestamp then let JS parse; this is sufficient for demo seeding.
  return new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`);
}
const iso = (d) => d.toISOString();
const inHJA = (h) => {
  const d = nowJA();
  d.setHours(d.getHours() + h);
  return iso(d);
};

async function run() {
  // wipe demo data
  await db.from("reviews").delete().neq("id", null);
  await db.from("itineraries").delete().neq("id", null);
  await db.from("itinerary_requests").delete().neq("id", null);
  await db.from("helper_availability").delete().neq("id", null);
  await db.from("helpers").delete().neq("id", null);
  await db.from("events").delete().neq("id", null);
  await db.from("venues").delete().neq("id", null);

  // venues
  const { data: venues, error: vErr } = await db.from("venues").insert([
    { name:"Dub Club",            city:"Kingston",     lat:18.024, lon:-76.789, address:"Jacks Hill" },
    { name:"Emancipation Park",   city:"Kingston",     lat:18.004, lon:-76.789, address:"New Kingston" },
    { name:"Hip Strip",           city:"Montego Bay",  lat:18.483, lon:-77.922, address:"Gloucester Ave" },
  ]).select("*");
  if (vErr) { console.error("venues:", vErr.message); process.exit(1); }

  const byName = Object.fromEntries((venues||[]).map(v => [v.name, v]));

  // events today in Jamaica time: now+2h and +5h in Kingston, and +8h in MoBay
  const { error: eErr } = await db.from("events").insert([
    { venue_id: byName["Dub Club"]?.id,          title:"Reggae Sunset", city:"Kingston",     date_start: inHJA(2), tags:["music","reggae"] },
    { venue_id: byName["Emancipation Park"]?.id, title:"Foodie Fest",   city:"Kingston",     date_start: inHJA(5), tags:["food","market"] },
    { venue_id: byName["Hip Strip"]?.id,         title:"Beach Lime",    city:"Montego Bay",  date_start: inHJA(8), tags:["beach","chill"] },
  ]);
  if (eErr) { console.error("events:", eErr.message); process.exit(1); }

  // helpers
  const { error: hErr } = await db.from("helpers").insert([
    { name:"Andre",  city:"Kingston",    langs:["en"], skills:["guide","driver"], rate_min:60, rate_max:120, verified:true,  phone:"+1-876-000-0000", rating:4.8 },
    { name:"Keisha", city:"Kingston",    langs:["en"], skills:["photography","guide"], rate_min:40, rate_max:90, verified:false, whatsapp:"+1-876-111-1111", rating:4.6 },
    { name:"Marlon", city:"Montego Bay", langs:["en"], skills:["guide"], rate_min:50, rate_max:100, verified:true, phone:"+1-876-222-2222", rating:4.7 },
  ]);
  if (hErr) { console.error("helpers:", hErr.message); process.exit(1); }

  console.log("? Reseeded using America/Jamaica local time.");
}
run();
