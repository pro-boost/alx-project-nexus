import { GetServerSideProps } from "next";
import Head from "next/head";
import { tmdb } from "../../../lib/tmdb";
import MovieCard from "../../components/MovieCard";
import { Movie, GenrePageProps } from "../../types/movie";

interface Genre {
  id: number;
  name: string;
}

const GenrePage: React.FC<GenrePageProps> = ({
  movies,
  genre,
  currentPage,
  totalPages,
}) => {
  return (
    <>
      <Head>
        <title>{genre.name} Movies - CineScope</title>
        <meta
          name="description"
          content={`Discover the best ${genre.name} movies on CineScope`}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              {genre.name} Movies
            </h1>
            <p className="text-xl text-center text-blue-100">
              Discover amazing {genre.name.toLowerCase()} movies
            </p>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {movies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {movies.map((movie) => (
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No movies found
              </h2>
              <p className="text-gray-600">
                We couldn&apos;t find any {genre.name.toLowerCase()} movies at
                the moment.
              </p>
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
