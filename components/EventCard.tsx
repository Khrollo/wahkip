"use client";
export default function EventCard({ e }: { e: any }) {
  return (
    <div className="min-w-[220px] w-[220px] snap-start">
      <div className="aspect-video rounded-xl bg-gray-200 mb-2" />
      <div className="font-medium text-sm">{e.title}</div>
      <div className="text-xs text-gray-500">{new Date(e.date_start).toLocaleString()}</div>
      <div className="text-[11px] text-gray-600">{(e.tags||[]).join(" • ")}</div>
    </div>
  );
}

