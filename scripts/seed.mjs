import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE;
if (!url || !service) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE in .env.local");
  process.exit(1);
}
const db = createClient(url, service, { auth: { persistSession: false }});

function iso(dt) { return new Date(dt).toISOString(); }

async function run() {
  // Insert venues
  const { data: venues, error: vErr } = await db
    .from("venues")
    .insert([
      { name:"Dub Club", city:"Kingston", lat:18.024, lon:-76.789, address:"Jacks Hill" },
      { name:"Emancipation Park", city:"Kingston", lat:18.004, lon:-76.789, address:"New Kingston" },
      { name:"Hip Strip", city:"Montego Bay", lat:18.483, lon:-77.922, address:"Gloucester Ave" },
      { name:"Catherine Hall", city:"Montego Bay", lat:18.466, lon:-77.908, address:"Catherine Hall" },
    ])
    .select("*");
  if (vErr) { console.error("Venues error:", vErr.message); process.exit(1); }

  const byName = Object.fromEntries((venues||[]).map(v=>[v.name, v]));

  // Events (today + tomorrow)
  const now = new Date();
  const inH = h => new Date(now.getTime()+h*3600*1000);
  const events = [
    { venue_id: byName["Dub Club"]?.id, title:"Reggae Sunset", city:"Kingston", date_start: iso(inH(2)), tags:["music","reggae"], image_url:"" },
    { venue_id: byName["Emancipation Park"]?.id, title:"Foodie Fest", city:"Kingston", date_start: iso(inH(5)), tags:["food","market"], image_url:"" },
    { venue_id: byName["Hip Strip"]?.id, title:"Beach Lime", city:"Montego Bay", date_start: iso(inH(8)), tags:["beach","chill"], image_url:"" },
    { venue_id: byName["Catherine Hall"]?.id, title:"Culture Night", city:"Montego Bay", date_start: iso(inH(24+3)), tags:["culture","music"], image_url:"" },
  ];
  const { error: eErr } = await db.from("events").insert(events);
  if (eErr) { console.error("Events error:", eErr.message); process.exit(1); }

  // Helpers
  const helpers = [
    { name:"Andre", city:"Kingston", langs:["en"], skills:["guide","driver"], rate_min:60, rate_max:120, verified:true, phone:"+1-876-000-0000", rating:4.8 },
    { name:"Keisha", city:"Kingston", langs:["en"], skills:["photography","guide"], rate_min:40, rate_max:90, verified:false, whatsapp:"+1-876-111-1111", rating:4.6 },
    { name:"Marlon", city:"Montego Bay", langs:["en"], skills:["guide"], rate_min:50, rate_max:100, verified:true, phone:"+1-876-222-2222", rating:4.7 },
  ];
  const { error: hErr } = await db.from("helpers").insert(helpers);
  if (hErr) { console.error("Helpers error:", hErr.message); process.exit(1); }

  console.log("? Seeded venues, events, helpers.");
}
run();
