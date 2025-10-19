"use client";
import { useState, useEffect, useCallback } from "react";
import EventCard from "../../components/EventCard";
import Navigation from "../../components/Navigation";

export default function ExplorePage() {
  const [selectedCity, setSelectedCity] = useState("Kingston");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cities = ["Kingston", "Montego Bay", "Ocho Rios", "Negril"];
  const tags = ["music", "food", "culture", "wellness", "sports", "nightlife", "family", "art"];

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      // Get or create session ID for personalization
      let sessionId = localStorage.getItem("wahkip_session_id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("wahkip_session_id", sessionId);
      }

      const params = new URLSearchParams({ city: selectedCity, session_id: sessionId });
      if (selectedTag) params.append("tags", selectedTag);
      if (searchQuery) params.append("q", searchQuery);
      
      // Use recommendations API for match scores
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const res = await fetch(`${baseUrl}/api/recommendations?${params.toString()}`);
      const json = await res.json();
      setEvents(json.items || []);
    } catch (e) {
      console.error("Failed to load events:", e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCity, selectedTag, searchQuery]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  function handleSearch() {
    loadEvents();
  }

  function handleInteraction() {
    // No refresh needed - scores update locally in the card
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <div className="bg-yellow-50 dark:bg-black border-b border-yellow-200 dark:border-yellow-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Explore Events</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">Discover local events and activities in your city</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={e => e.key === "Enter" && handleSearch()}
            className="flex-1 border border-yellow-300 dark:border-yellow-800 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white px-6 py-2 rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
          >
            Search
          </button>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">City</label>
          <div className="flex flex-wrap gap-2">
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCity === city
                    ? "bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white shadow-lg"
                    : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-yellow-300 dark:border-yellow-800 hover:border-yellow-500 dark:hover:border-yellow-600"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag("")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedTag === ""
                  ? "bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white shadow-lg"
                  : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-yellow-300 dark:border-yellow-800 hover:border-yellow-500 dark:hover:border-yellow-600"
              }`}
            >
              All
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                  selectedTag === tag
                    ? "bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white shadow-lg"
                    : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-yellow-300 dark:border-yellow-800 hover:border-yellow-500 dark:hover:border-yellow-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 dark:border-yellow-400"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">Loading events...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map(event => (
              <EventCard key={event.id} e={event} match={event.match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-700 dark:text-gray-300 text-lg">No events found</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}

