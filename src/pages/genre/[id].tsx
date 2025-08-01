import { GetServerSideProps } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { tmdb } from "../../../lib/tmdb";
import MovieCard from "../../components/MovieCard";
import { GenrePageProps } from "../../types/movie";

interface Genre {
  id: number;
  name: string;
}

const GenrePage: React.FC<GenrePageProps> = ({
  movies: initialMovies,
  genre,
  currentPage,
  totalPages,
}) => {
  const [filteredMovies, setFilteredMovies] = useState(initialMovies);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let filtered = [...initialMovies];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply year filter
    if (yearFilter) {
      filtered = filtered.filter(movie => {
        const movieYear = new Date(movie.release_date).getFullYear();
        return movieYear.toString() === yearFilter;
      });
    }

    // Apply rating filter
    if (ratingFilter) {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(movie => movie.vote_average >= minRating);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity.desc':
          return b.popularity - a.popularity;
        case 'popularity.asc':
          return a.popularity - b.popularity;
        case 'vote_average.desc':
          return b.vote_average - a.vote_average;
        case 'vote_average.asc':
          return a.vote_average - b.vote_average;
        case 'release_date.desc':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        case 'release_date.asc':
          return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
        case 'title.asc':
          return a.title.localeCompare(b.title);
        case 'title.desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredMovies(filtered);
  }, [initialMovies, searchQuery, yearFilter, ratingFilter, sortBy]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setYearFilter('');
    setRatingFilter('');
    setSortBy('popularity.desc');
  };

  return (
    <>
      <Head>
        <title>{genre.name} Movies - Nexus</title>
        <meta
          name="description"
          content={`Discover the best ${genre.name} movies on Nexus`}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4">
              {genre.name} Movies
            </h1>
            <p className="text-lg md:text-xl text-center text-blue-100 mb-6">
              Discover amazing {genre.name.toLowerCase()} movies
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search ${genre.name} movies...`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-3 pl-12 text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Sort By */}
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="popularity.desc">Most Popular</option>
                    <option value="popularity.asc">Least Popular</option>
                    <option value="vote_average.desc">Highest Rated</option>
                    <option value="vote_average.asc">Lowest Rated</option>
                    <option value="release_date.desc">Newest First</option>
                    <option value="release_date.asc">Oldest First</option>
                    <option value="title.asc">Title A-Z</option>
                    <option value="title.desc">Title Z-A</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Release Year
                  </label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Years</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Rating
                  </label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="7">7+ Stars</option>
                    <option value="6">6+ Stars</option>
                    <option value="5">5+ Stars</option>
                    <option value="4">4+ Stars</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters & Results Count */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                  {filteredMovies.length} of {initialMovies.length} movies
                </div>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredMovies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {/* Pagination Info */}
              <div className="mt-12 text-center">
                <p className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                  {currentPage > 1 && (
                    <a
                      href={`/genre/${genre.id}?page=${currentPage - 1}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Previous
                    </a>
                  )}
                  {currentPage < totalPages && (
                    <a
                      href={`/genre/${genre.id}?page=${currentPage + 1}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Next
                    </a>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                  {searchQuery || yearFilter || ratingFilter ? 'No movies match your filters' : 'No movies found'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {searchQuery || yearFilter || ratingFilter 
                    ? 'Try adjusting your search criteria or filters to find more movies.'
                    : `We couldn't find any ${genre.name.toLowerCase()} movies at the moment.`
                  }
                </p>
                {(searchQuery || yearFilter || ratingFilter) && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, page = "1" } = context.query;
  const currentPage = parseInt(page as string, 10);

  try {
    // Fetch genre details
    const genreResponse = await tmdb.get("/genre/movie/list");
    const genre = genreResponse.data.genres.find(
      (g: Genre) => g.id === parseInt(id as string, 10)
    );

    if (!genre) {
      return {
        notFound: true,
      };
    }

    // Fetch movies by genre
    const moviesResponse = await tmdb.get("/discover/movie", {
      params: {
        with_genres: id,
        page: currentPage,
        sort_by: "popularity.desc",
      },
    });

    const movies = moviesResponse.data.results;
    const totalPages = Math.min(moviesResponse.data.total_pages, 500); // TMDB API limit

    return {
      props: {
        movies,
        genre,
        currentPage,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching genre movies:", error);
    return {
      notFound: true,
    };
  }
};

export default GenrePage;