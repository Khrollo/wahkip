/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import GenerateItinerary from "../components/GenerateItinerary";
import ExploreRows from "../components/ExploreRows";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Wahkip
              </span>
            </Link>
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/explore" className="text-gray-700 hover:text-blue-600 font-medium">
                Explore
              </Link>
              <Link href="/helpers" className="text-gray-700 hover:text-blue-600 font-medium">
                Helpers
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            AI plans your perfect day
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us what you want to experience, and we'll create a personalized itinerary with local events, activities, and hidden gems.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#generate" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Plan My Day
            </a>
            <Link href="/explore" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition">
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold">Describe Your Day</h3>
            <p className="text-gray-600">Tell us what you want to experience - music, food, culture, or anything else!</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h3 className="text-xl font-semibold">AI Matches Events</h3>
            <p className="text-gray-600">Our AI finds the perfect events and activities based on your preferences.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-green-600">3</span>
            </div>
            <h3 className="text-xl font-semibold">Share & Enjoy</h3>
            <p className="text-gray-600">Get your personalized itinerary and share it with friends!</p>
          </div>
        </div>
      </section>

      {/* Generate Itinerary */}
      <section id="generate" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Create Your Itinerary</h2>
        <GenerateItinerary />
      </section>

      {/* Explore Rows */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Discover Events</h2>
        <ExploreRows />
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p className="font-semibold text-gray-900 mb-2">Wahkip</p>
          <p className="text-sm">Your local adventure starts here</p>
        </div>
      </footer>
    </div>
  );
}

