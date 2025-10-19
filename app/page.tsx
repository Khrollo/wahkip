/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import GenerateItinerary from "../components/GenerateItinerary";
import Navigation from "../components/Navigation";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI plans your perfect day
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tell us what you want to experience, and we'll create a personalized itinerary with local events, activities, and hidden gems.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#generate" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Plan My Day
            </a>
            <Link href="/explore" className="border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-semibold hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Describe Your Day</h3>
            <p className="text-gray-600 dark:text-gray-300">Tell us what you want to experience - music, food, culture, or anything else!</p>
          </div>
          <div className="text-center space-y-4 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Matches Events</h3>
            <p className="text-gray-600 dark:text-gray-300">Our AI finds the perfect events and activities based on your preferences.</p>
          </div>
          <div className="text-center space-y-4 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Share & Enjoy</h3>
            <p className="text-gray-600 dark:text-gray-300">Get your personalized itinerary and share it with friends!</p>
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
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">From music and food to wellness and sports - find your perfect day</p>
        <Link 
          href="/explore" 
          className="inline-block bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Explore All Events →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">Wahkip</p>
          <p className="text-sm">Your local adventure starts here</p>
        </div>
      </footer>
    </div>
  );
}

