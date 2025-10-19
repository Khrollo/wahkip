"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../../components/Navigation";

export default function NewEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [city, setCity] = useState("Kingston");
  const [tags, setTags] = useState("");
  const [capacity, setCapacity] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          date_start: dateStart,
          date_end: dateEnd || null,
          city,
          tags: tags.split(",").map(s => s.trim()).filter(Boolean),
          capacity,
        }),
      });
      
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Creation failed");
      
      setSuccess(true);
      setTimeout(() => router.push("/explore"), 2000);
    } catch (e: any) {
      setError(e.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navigation />
        <main className="max-w-2xl mx-auto px-6 py-12">
          <div className="border border-yellow-200 dark:border-yellow-900 rounded-xl p-8 text-center space-y-4 bg-yellow-50 dark:bg-yellow-950">
            <div className="text-5xl">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Event Created!</h2>
            <p className="text-gray-700 dark:text-gray-300">Your event is now live and discoverable</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Redirecting to explore page...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-yellow-200 dark:border-yellow-900">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">List a New Event</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Share your event with the Wahkip community</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Event Title *</label>
              <input
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder="e.g., Live Jazz Night"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Description</label>
              <textarea
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe your event..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={dateStart}
                  onChange={e => setDateStart(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={dateEnd}
                  onChange={e => setDateEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">City *</label>
                <input
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Expected Capacity</label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={capacity}
                  onChange={e => setCapacity(e.target.value)}
                >
                  <option value="low">Low (1-20)</option>
                  <option value="medium">Medium (20-50)</option>
                  <option value="high">High (50+)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Tags (comma-separated) *</label>
              <input
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={tags}
                onChange={e => setTags(e.target.value)}
                required
                placeholder="music, food, nightlife"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available tags: music, food, culture, wellness, sports, nightlife, family, art</p>
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-300 dark:border-red-900 rounded-lg p-4 text-red-800 dark:text-red-200">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white rounded-lg px-6 py-3 font-semibold hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loading ? "Creating Event..." : "Create Event"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

