"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navigation from "../../components/Navigation";

export default function HelpersPage() {
  const [helpers, setHelpers] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 40, max: 120 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHelpers();
  }, []);

  async function loadHelpers() {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const res = await fetch(`${baseUrl}/api/helpers/search?city=Kingston`);
      const json = await res.json();
      setHelpers(json.items || []);
      setPriceRange(json.suggestedPriceRange || { min: 40, max: 120 });
    } catch (e) {
      console.error("Failed to fetch helpers:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <div className="bg-yellow-50 dark:bg-black border-b border-yellow-200 dark:border-yellow-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Wah Kip Helpers</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">Find trusted local guides and assistants</p>
            </div>
            <Link
              href="/helpers/register"
              className="bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
            >
              Become a Helper
            </Link>
          </div>
        </div>
      </div>

      {/* Price Range Banner */}
      <div className="bg-yellow-100 dark:bg-yellow-950/30 border-b border-yellow-200 dark:border-yellow-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-yellow-900 dark:text-yellow-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Suggested price range: ${priceRange.min}-${priceRange.max}/hour</span>
          </div>
        </div>
      </div>

      {/* Helpers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 dark:border-yellow-400"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">Loading helpers...</p>
          </div>
        ) : helpers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpers.map((h: any) => (
              <div key={h.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all border border-yellow-200 dark:border-yellow-900 p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <img 
                    src={h.photo_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(h.name) + "&background=fbbf24&color=000"} 
                    alt={h.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/helpers/${h.id}`}>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors cursor-pointer">{h.name}</h3>
                        </Link>
                        {h.verified && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-950 px-2 py-1 rounded-full mt-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                      {(h.rating_avg || h.rating) && (
                        <div className="flex items-center gap-1">
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-semibold text-gray-900 dark:text-white">{h.rating_avg?.toFixed(1) || h.rating}</span>
                          {h.rating_count > 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">({h.rating_count})</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{h.city}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L12 11.236 11.618 14z" clipRule="evenodd" />
                    </svg>
                    <span>{(h.langs || []).join(", ")}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(h.skills || []).map((skill: string) => (
                      <span key={skill} className="text-xs px-3 py-1 bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 rounded-full font-medium border border-yellow-200 dark:border-yellow-900">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-yellow-200 dark:border-yellow-900">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Rate</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${h.rate_min ?? "?"}-{h.rate_max ?? "?"}/hr
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {h.phone && (
                      <a
                        href={`tel:${h.phone}`}
                        className="flex-1 bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white text-center px-4 py-2 rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all font-medium shadow-lg hover:shadow-xl"
                      >
                        Call
                      </a>
                    )}
                    {h.whatsapp && (
                      <a
                        href={`https://wa.me/${h.whatsapp.replace(/\D/g, "")}`}
                        className="flex-1 bg-green-600 dark:bg-green-700 text-white text-center px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-all font-medium shadow-lg hover:shadow-xl"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-700 dark:text-gray-300 text-lg">No helpers available yet</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Be the first to register as a helper!</p>
            <Link
              href="/helpers/register"
              className="inline-block mt-4 bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
            >
              Register Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

