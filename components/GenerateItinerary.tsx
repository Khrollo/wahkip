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
    <div className="bg-white dark:bg-black rounded-2xl shadow-lg dark:shadow-2xl p-8 space-y-6 border border-yellow-200 dark:border-yellow-900">
      <form onSubmit={go} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">City</label>
            <input 
              className="w-full border border-yellow-300 dark:border-yellow-800 rounded-lg px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors" 
              value={city} 
              onChange={e=>setCity(e.target.value)} 
              placeholder="e.g., Kingston" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Date</label>
            <input 
              type="date" 
              className="w-full border border-yellow-300 dark:border-yellow-800 rounded-lg px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors" 
              value={date} 
              onChange={e=>setDate(e.target.value)} 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            What do you want to experience?
          </label>
          <textarea 
            className="w-full border border-yellow-300 dark:border-yellow-800 rounded-lg px-4 py-3 h-32 resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors" 
            value={description} 
            onChange={e=>setDescription(e.target.value)} 
            placeholder="Describe your perfect day... e.g., I want to experience local music, try authentic food, and explore cultural venues"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Be as specific or general as you'd like!</p>
        </div>
        <button 
          disabled={loading} 
          className="w-full bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white rounded-lg px-6 py-3 font-semibold hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
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
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-900 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Error: {err}</span>
          </div>
        </div>
      )}

      {out?.itinerary && (
        <div className="space-y-4 border-t border-yellow-200 dark:border-yellow-900 pt-6">
          {out.warning === "AI_FALLBACK" && (
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-300 dark:border-yellow-900 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">AI unavailable. Showing fallback itinerary.</span>
              </div>
            </div>
          )}
          {out.itinerary_id && (
            <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-300 dark:border-yellow-900 rounded-lg p-4">
              <span className="text-sm text-yellow-900 dark:text-yellow-300 font-medium">Your itinerary is ready!</span>
              <a 
                href={`/itinerary/${out.itinerary_id}`}
                className="text-sm bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all font-medium shadow-lg hover:shadow-xl"
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

