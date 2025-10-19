/* eslint-disable @typescript-eslint/no-explicit-any */
import EventsRealtimeClient from "../components/EventsRealtimeClient";
import GenerateItinerary from "../components/GenerateItinerary";
import ExploreRows from "../components/ExploreRows";

export const dynamic = "force-static";
export const revalidate = 60;

async function getEvents() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/events?city=Kingston`, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) return { items: [], error: `events ${res.status}` };
    return res.json();
  } catch (e: any) {
    return { items: [], error: e?.message || "fetch_failed" };
  }
}

export default async function Page() {
  const data = await getEvents();
  return (
    <main className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Wahkip</h1>
        <p className="text-sm text-gray-600">Local events & 1-day itineraries</p>
      </header>

      {data?.error && (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded">
          Unable to load events ({data.error}). You can still generate an itinerary below.
        </div>
      )}

      <GenerateItinerary />
      <EventsRealtimeClient city="Kingston" />

      {/* Explore rows */}
      <ExploreRows />
    </main>
  );
}

