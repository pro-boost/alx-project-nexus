import TrendingMovies from "../components/TrendingMovies";
import SearchBar from "../components/SearchBar";
import Link from "next/link";
import useFavorites from "../utils/useFavorites";

export default function Home() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-400">CineScope</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Your ultimate movie discovery platform with personalized
              recommendations, genre browsing, and favorites management.
            </p>
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/genres"
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-block"
              >
                Browse by Genre
              </Link>
              <Link
                href="/favorites"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors inline-block"
              >
                My Favorites ({favorites.length})
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive movie discovery platform with advanced
              search and personalization
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 - Search */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Search
              </h3>
              <p className="text-gray-600 text-sm">
                Search movies by title with genre filtering for precise results
              </p>
            </div>

            {/* Feature 2 - Genres */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14-7l2 2-2 2M5 13l-2-2 2-2m8-2v10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Genre Browse
              </h3>
              <p className="text-gray-600 text-sm">
                Discover movies by genre with dynamic filtering and pagination
              </p>
            </div>

            {/* Feature 3 - Favorites */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Favorites
              </h3>
              <p className="text-gray-600 text-sm">
                Save and manage your favorite movies with persistent storage
              </p>
            </div>

            {/* Feature 4 - Trending */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Trending
              </h3>
              <p className="text-gray-600 text-sm">
                Discover what&apos;s popular with real-time trending movies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-lg text-gray-600">
              Jump right into exploring movies with these popular options
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Action Movies */}
            <Link
              href="/genre/28"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500 to-pink-600 p-8 text-white cursor-pointer transform hover:scale-105 transition-transform block"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Action Movies</h3>
                <p className="text-red-100 mb-4">
                  High-octane thrills and explosive adventures
                </p>
                <span className="inline-flex items-center text-white font-semibold">
                  Explore Action
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Comedy Movies */}
            <Link
              href="/genre/35"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-8 text-white cursor-pointer transform hover:scale-105 transition-transform block"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Comedy Movies</h3>
                <p className="text-blue-100 mb-4">
                  Laugh-out-loud entertainment and feel-good stories
                </p>
                <span className="inline-flex items-center text-white font-semibold">
                  Browse Comedy
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Sci-Fi Movies */}
            <Link
              href="/genre/878"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-8 text-white cursor-pointer transform hover:scale-105 transition-transform block"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Sci-Fi Movies</h3>
                <p className="text-purple-100 mb-4">
                  Futuristic worlds and mind-bending concepts
                </p>
                <span className="inline-flex items-center text-white font-semibold">
                  Discover Sci-Fi
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Movies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrendingMovies />
        </div>
      </section>
    </div>
  );
}
