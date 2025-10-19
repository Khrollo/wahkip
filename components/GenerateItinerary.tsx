"use client";
import { useState } from "react";
import ItineraryTimeline from "./ItineraryTimeline";

type Out = { itinerary: any; picks: string[]; warning?: string };

export default function GenerateItinerary() {
  const [city, setCity] = useState("Kingston");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [interests, setInterests] = useState("music,food,culture");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<Out | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function go(e?:React.FormEvent) {
    e?.preventDefault();
    setLoading(true); setOut(null); setErr(null);
    try {
      const res = await fetch("/api/ai/itinerary", {
        method: "POST",
        headers: { "content-type":"application/json" },
        body: JSON.stringify({
          city,
          date,
          interests: interests.split(",").map(s=>s.trim()).filter(Boolean)
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Request failed");
      setOut(json);
    } catch (e:any) {
      setErr(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border rounded-2xl p-4 space-y-3">
      <form onSubmit={go} className="grid md:grid-cols-4 gap-2">
        <input className="border rounded px-3 py-2" value={city} onChange={e=>setCity(e.target.value)} placeholder="City" />
        <input type="date" className="border rounded px-3 py-2" value={date} onChange={e=>setDate(e.target.value)} />
        <input className="border rounded px-3 py-2" value={interests} onChange={e=>setInterests(e.target.value)} placeholder="Interests (comma-separated)" />
        <button disabled={loading} className="rounded bg-black text-white px-4 py-2">{loading ? "Generating..." : "Generate Itinerary"}</button>
      </form>

      {err && <div className="text-sm text-red-600">Error: {err}</div>}

      {out?.itinerary && (
        <div className="space-y-2">
          {out.warning === "AI_FALLBACK" && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
              AI unavailable or invalid JSON. Showing fallback.
            </div>
          )}
          <ItineraryTimeline data={out.itinerary}/>
        </div>
      )}
    </section>
  );
}
