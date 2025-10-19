"use client";
import { useEffect, useState } from "react";
import EventCard from "./EventCard";

export default function HorizontalRow({ title, query }: { title: string; query: string }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    let live = true;
    fetch(`/api/events?${query}`).then(r=>r.json()).then(j=>{ if(live) setItems(j.items||[]) });
    return () => { live = false; };
  }, [query]);

  return (
    <section className="space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex gap-3 overflow-x-auto snap-x pb-2">
        {items.map((e)=> <EventCard key={e.id} e={e} />)}
        {!items.length && <div className="text-sm text-gray-500">Nothing yet.</div>}
      </div>
    </section>
  );
}

