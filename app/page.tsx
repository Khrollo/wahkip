/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import GenerateItinerary from "../components/GenerateItinerary";
import Navigation from "../components/Navigation";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            AI plans your <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-400 dark:to-yellow-500 bg-clip-text text-transparent">perfect day</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Tell us what you want to experience, and we'll create a personalized itinerary with local events, activities, and hidden gems.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#generate" className="bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Plan My Day
            </a>
            <Link href="/explore" className="border-2 border-yellow-500 dark:border-yellow-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-50 dark:hover:bg-yellow-950 transition-all">
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 p-6 rounded-xl bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-yellow-500 dark:bg-yellow-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Describe Your Day</h3>
            <p className="text-gray-700 dark:text-gray-300">Tell us what you want to experience - music, food, culture, or anything else!</p>
          </div>
          <div className="text-center space-y-4 p-6 rounded-xl bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-yellow-500 dark:bg-yellow-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Matches Events</h3>
            <p className="text-gray-700 dark:text-gray-300">Our AI finds the perfect events and activities based on your preferences.</p>
          </div>
          <div className="text-center space-y-4 p-6 rounded-xl bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-yellow-500 dark:bg-yellow-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Share & Enjoy</h3>
            <p className="text-gray-700 dark:text-gray-300">Get your personalized itinerary and share it with friends!</p>
          </div>
        </div>
      </section>

      {/* Generate Itinerary */}
      <section id="generate" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Create Your Itinerary</h2>
        <GenerateItinerary />
      </section>

      {/* CTA to Explore Page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Discover 60+ Local Events</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">From music and food to wellness and sports - find your perfect day</p>
        <Link 
          href="/explore" 
          className="inline-block bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Explore All Events →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-700 dark:text-gray-300">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">Wahkip</p>
          <p className="text-sm">Your local adventure starts here</p>
        </div>
      </footer>
    </div>
  );
}

