"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navigation from "../../../components/Navigation";

export default function EventPage() {
  const params = useParams();
  const [event, setEvent] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEvent();
    loadReviews();
  }, [params.id]);

  async function loadEvent() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const res = await fetch(`${baseUrl}/api/events?id=${params.id}`);
      const json = await res.json();
      setEvent(json.item);
    } catch (e) {
      console.error("Failed to load event:", e);
    } finally {
      setLoading(false);
    }
  }

  async function loadReviews() {
    try {
      const res = await fetch(`/api/events/reviews?event_id=${params.id}`);
      const json = await res.json();
      setReviews(json.reviews || []);
    } catch (e) {
      console.error("Failed to load reviews:", e);
    }
  }

  async function submitReview() {
    setSubmitting(true);
    const sessionId = localStorage.getItem("wahkip_session_id") || crypto.randomUUID();
    localStorage.setItem("wahkip_session_id", sessionId);

    try {
      const res = await fetch("/api/events/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: params.id, rating, comment, session_id: sessionId }),
      });

      const json = await res.json();
      if (json.ok) {
        setComment("");
        setRating(5);
        await loadReviews();
      }
    } catch (e) {
      console.error("Failed to submit review:", e);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">Event not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Event Details */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-yellow-200 dark:border-yellow-900">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{new Date(event.date_start).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{new Date(event.date_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {event.description && (
            <p className="text-gray-700 dark:text-gray-300 mb-4">{event.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-yellow-200 dark:border-yellow-900">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Leave a Review</h3>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            rows={4}
          />
          <button 
            onClick={submitReview} 
            disabled={submitting}
            className="bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reviews ({reviews.length})
          </h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-yellow-200 dark:border-yellow-900">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-500 text-lg">{"★".repeat(review.rating)}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{review.comment || "No comment"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to leave one!</p>
          )}
        </div>
      </div>
    </div>
  );
}

