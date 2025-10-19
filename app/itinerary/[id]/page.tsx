/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import ItineraryTimeline from "../../../components/ItineraryTimeline";

type Props = { params: { id: string } };

export default function ItineraryPage({ params }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/itinerary?id=${params.id}`)
      .then(r => r.json())
      .then(j => {
        setData(j.item);
        setLoading(false);
      });
  }, [params.id]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <main className="p-6">Loading...</main>;
  if (!data) return <main className="p-6">Itinerary not found.</main>;

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Itinerary</h1>
        <button
          onClick={copyUrl}
          className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
        >
          {copied ? "Copied!" : "Share"}
        </button>
      </div>
      <ItineraryTimeline data={data.json} />
    </main>
  );
}
