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
        
        {/* Blue Mountain Engineering */}
        <div className="pt-8 border-t border-yellow-200 dark:border-yellow-900">
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <span className="text-xs">Engineered by</span>
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 28 L12 16 L16 28 Z" fill="currentColor" className="text-blue-600 dark:text-blue-400" />
                <path d="M14 28 L20 8 L26 28 Z" fill="currentColor" className="text-blue-700 dark:text-blue-300" />
                <path d="M24 28 L28 18 L32 28 Z" fill="currentColor" className="text-blue-600 dark:text-blue-400" />
                <line x1="6" y1="28" x2="34" y2="28" stroke="currentColor" strokeWidth="1.5" className="text-blue-800 dark:text-blue-500" />
              </svg>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Blue Mountain</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
