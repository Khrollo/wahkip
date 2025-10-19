/* eslint-disable @typescript-eslint/no-explicit-any */
import EventsRealtimeClient from "../components/EventsRealtimeClient";
import GenerateItinerary from "../components/GenerateItinerary";

async function getEvents() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/events?city=Kingston`, { cache: "no-store" });
  return res.json();
}

export default async function Page() {
  const data = await getEvents();
  return (
    <main className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Wahkip</h1>
        <p className="text-sm text-gray-600">Local events & 1-day itineraries</p>
      </header>

      <GenerateItinerary />
      <EventsRealtimeClient city="Kingston" />

      <section className="space-y-2">
        <h2 className="font-semibold">Upcoming in Kingston</h2>
        <ul className="space-y-2">
          {data.items?.map((e:any)=>(
            <li key={e.id} className="border rounded p-3">
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-gray-500">{new Date(e.date_start).toLocaleString()}</div>
              <div className="text-xs">{(e.tags||[]).join(", ")}</div>
            </li>
          ))}
          {!data.items?.length && <li className="text-sm text-gray-500">No events yet.</li>}
        </ul>
      </section>
    </main>
  );
}

