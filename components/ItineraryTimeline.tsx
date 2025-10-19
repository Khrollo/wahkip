"use client";

type Itin = {
  morning: string[];
  midday: string[];
  afternoon: string[];
  evening: string[];
  transportNotes: string;
  costEstimate: { low: number; high: number; currency: string };
  picks: string[];
};

export default function ItineraryTimeline({ data }: { data: Itin }) {
  const Section = ({ title, items }: { title: string; items: string[] }) => (
    <div className="border rounded-xl p-4">
      <div className="font-semibold mb-2">{title}</div>
      {items?.length ? (
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {items.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">No items</div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">
        Transport: {data.transportNotes} • Cost: {data.costEstimate.low}-{data.costEstimate.high} {data.costEstimate.currency}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Section title="Morning"   items={data.morning} />
        <Section title="Midday"    items={data.midday} />
        <Section title="Afternoon" items={data.afternoon} />
        <Section title="Evening"   items={data.evening} />
      </div>
      {!!data.picks?.length && (
        <div className="text-xs text-gray-500">Event picks: {data.picks.join(", ")}</div>
      )}
    </div>
  );
}