/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import TimelineView from "../../../components/TimelineView";
import Navigation from "../../../components/Navigation";

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
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Itinerary</h1>
          <button
            onClick={copyUrl}
            className="text-sm bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
          >
            {copied ? "✓ Copied!" : "📤 Share"}
          </button>
        </div>
        <TimelineView itinerary={data.json} />
      </main>
    </div>
  );
}
