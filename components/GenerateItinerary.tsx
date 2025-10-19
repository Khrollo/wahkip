/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import ItineraryTimeline from "./ItineraryTimeline";

type Out = { itinerary: any; picks: string[]; itinerary_id?: string; warning?: string };

export default function GenerateItinerary() {
  const [city, setCity] = useState("Kingston");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [description, setDescription] = useState("I want to experience local music, try authentic food, and explore cultural venues");
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
          description
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
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <form onSubmit={go} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={city} 
              onChange={e=>setCity(e.target.value)} 
              placeholder="e.g., Kingston" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={date} 
              onChange={e=>setDate(e.target.value)} 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What do you want to experience?
          </label>
          <textarea 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={description} 
            onChange={e=>setDescription(e.target.value)} 
            placeholder="Describe your perfect day... e.g., I want to experience local music, try authentic food, and explore cultural venues"
          />
          <p className="text-xs text-gray-500 mt-1">Be as specific or general as you'd like!</p>
        </div>
        <button 
          disabled={loading} 
          className="w-full bg-blue-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Your Itinerary...
            </>
          ) : (
            "Generate My Itinerary"
          )}
        </button>
      </form>

      {err && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Error: {err}</span>
          </div>
        </div>
      )}

      {out?.itinerary && (
        <div className="space-y-4 border-t pt-6">
          {out.warning === "AI_FALLBACK" && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">AI unavailable. Showing fallback itinerary.</span>
              </div>
            </div>
          )}
          {out.itinerary_id && (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
              <span className="text-sm text-blue-900 font-medium">Your itinerary is ready!</span>
              <a 
                href={`/itinerary/${out.itinerary_id}`}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                View & Share →
              </a>
            </div>
          )}
          <ItineraryTimeline data={out.itinerary}/>
        </div>
      )}
    </div>
  );
}

