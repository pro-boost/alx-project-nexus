import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { tmdb } from "../../lib/tmdb";
import MovieCard from "../components/MovieCard";
import { SearchPageProps } from "../types/movie";

interface Genre {
  id: number;
  name: string;
}

const SearchPage: React.FC<SearchPageProps> = ({
  movies,
  query,
  genreId,
  genreName,
  totalResults,
  currentPage,
  totalPages,
}) => {
  const pageTitle = query
    ? `Search Results for "${query}"${genreName ? ` in ${genreName}` : ""}`
    : genreName
    ? `${genreName} Movies`
    : "Search Results";

  return (
    <>
      <Head>
        <title>{pageTitle} - CineScope</title>
        <meta name="description" content={`${pageTitle} on CineScope`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {pageTitle}
                </h1>
                <p className="mt-2 text-gray-600">
                  {totalResults > 0
                    ? `Found ${totalResults.toLocaleString()} result${
                        totalResults !== 1 ? "s" : ""
                      }`
                    : "No results found"}
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {movies.length > 0 ? (
            <>
              {/* Movies Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center space-x-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}${
                        genreId ? `&genre=${genreId}` : ""
                      }&page=${currentPage - 1}`}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Previous
                    </Link>
                  )}

                  <span className="px-4 py-2 text-sm font-medium text-gray-900">
                    Page {currentPage} of {totalPages}
                  </span>

                  {currentPage < totalPages && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}${
                        genreId ? `&genre=${genreId}` : ""
                      }&page=${currentPage + 1}`}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No movies found
              </h3>
              <p className="mt-2 text-gray-500">
                {query
                  ? `No movies found for "${query}"${
                      genreName ? ` in ${genreName}` : ""
                    }. Try a different search term.`
                  : "Try searching for a movie or selecting a different genre."}
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Browse Popular Movies
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const searchQuery = (query.q as string) || "";
  const genreId = query.genre as string;
  const page = parseInt((query.page as string) || "1", 10);

  try {
    let moviesResponse;
    let genreName = "";

    if (searchQuery.trim()) {
      // Search for movies by query
      moviesResponse = await tmdb.get("/search/movie", {
        params: {
          query: searchQuery,
          page,
          with_genres: genreId || undefined,
        },
      });
    } else if (genreId) {
      // Get movies by genre
      moviesResponse = await tmdb.get("/discover/movie", {
        params: {
          with_genres: genreId,
          page,
          sort_by: "popularity.desc",
        },
      });
    } else {
      // Fallback to popular movies
      moviesResponse = await tmdb.get("/movie/popular", {
        params: { page },
      });
    }

    // Get genre name if genreId is provided
    if (genreId) {
      try {
        const genresResponse = await tmdb.get("/genre/movie/list");
        const genre = genresResponse.data.genres.find(
          (g: Genre) => g.id.toString() === genreId
        );
        genreName = genre?.name || "";
      } catch (error) {
        console.error("Error fetching genre name:", error);
      }
    }

    return {
      props: {
        movies: moviesResponse.data.results || [],
        query: searchQuery,
        genreId: genreId || null,
        genreName,
        totalResults: moviesResponse.data.total_results || 0,
        currentPage: moviesResponse.data.page || 1,
        totalPages: Math.min(moviesResponse.data.total_pages || 1, 500), // TMDB limits to 500 pages
      },
    };
  } catch (error) {
    console.error("Error fetching search results:", error);
    return {
      props: {
        movies: [],
        query: searchQuery,
        genreId: genreId || null,
        genreName: "",
        totalResults: 0,
        currentPage: 1,
        totalPages: 1,
      },
    };
  }
};

export default SearchPage;