/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Props = { city: string };

export default function EventsRealtimeClient({ city }: Props) {
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supa = createClient(url, anon);

    const channel = supa
      .channel("wahkip-events")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events" },
        (payload) => {
          // bump only when city matches (if payload has city)
          const row: any = payload.new;
          if (!city || row?.city === city) setNewCount((c) => c + 1);
        }
      )
      .subscribe();

    return () => {
      supa.removeChannel(channel);
    };
  }, [city]);

  if (!newCount) return null;

  return (
    <div className="text-sm rounded bg-emerald-50 border border-emerald-200 px-3 py-2 inline-flex items-center gap-2">
      <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" />
      <span>{newCount} new event{newCount > 1 ? "s" : ""} in {city}. Refresh the list.</span>
    </div>
  );
}

