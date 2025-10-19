"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navigation from "../../../components/Navigation";

export default function HelperDetailPage() {
  const params = useParams();
  const [helper, setHelper] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadHelper();
    loadReviews();
  }, [params.id]);

  async function loadHelper() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const res = await fetch(`${baseUrl}/api/helpers/search?city=Kingston`);
      const json = await res.json();
      const found = json.items.find((h: any) => h.id === params.id);
      setHelper(found);
    } catch (e) {
      console.error("Failed to load helper:", e);
    } finally {
      setLoading(false);
    }
  }

  async function loadReviews() {
    try {
      const res = await fetch(`/api/helpers/reviews?helper_id=${params.id}`);
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
      const res = await fetch("/api/helpers/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helper_id: params.id, rating, comment, session_id: sessionId }),
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

  if (!helper) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">Helper not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Helper Details */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-yellow-200 dark:border-yellow-900">
          <div className="flex items-start gap-6">
            <img 
              src={helper.photo_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(helper.name) + "&background=fbbf24&color=000"} 
              alt={helper.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{helper.name}</h1>
                  {helper.verified && (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-950 px-3 py-1 rounded-full">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                {(helper.rating_avg || helper.rating) && (
                  <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-950 px-4 py-2 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{helper.rating_avg?.toFixed(1) || helper.rating}</div>
                      {helper.rating_count > 0 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">{helper.rating_count} reviews</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{helper.city}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L12 11.236 11.618 14z" clipRule="evenodd" />
                  </svg>
                  <span>{(helper.langs || []).join(", ")}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(helper.skills || []).map((skill: string) => (
                    <span key={skill} className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full font-medium border border-yellow-300 dark:border-yellow-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white font-semibold">Hourly Rate</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    ${helper.rate_min ?? "?"}-{helper.rate_max ?? "?"}/hr
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                {helper.phone && (
                  <a
                    href={`tel:${helper.phone}`}
                    className="flex-1 bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white text-center px-6 py-3 rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all font-semibold shadow-lg hover:shadow-xl"
                  >
                    📞 Call
                  </a>
                )}
                {helper.whatsapp && (
                  <a
                    href={`https://wa.me/${helper.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 dark:bg-green-700 text-white text-center px-6 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-all font-semibold shadow-lg hover:shadow-xl"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
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
            placeholder="Share your experience with this helper..."
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

