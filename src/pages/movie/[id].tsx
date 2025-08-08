import { GetServerSideProps } from "next";
import Image from "next/image";
import Head from "next/head";
import { tmdb } from "../../../lib/tmdb";

interface Genre {
  id: number;
  name: string;
}

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  runtime: number;
  genres: Genre[];
  tagline: string;
}

interface MovieDetailPageProps {
  movie: MovieDetails;
}

const MovieDetailPage: React.FC<MovieDetailPageProps> = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-movie.jpg";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatRating = (rating: number) => {
    return (rating / 2).toFixed(1); // Convert from 10-point to 5-point scale
  };

  return (
    <>
      <Head>
        <title>{movie.title} - CineScope</title>
        <meta name="description" content={movie.overview} />
      </Head>

      <div className="bg-gray-900 text-white">
        {backdropUrl && (
          <div className="relative min-h-screen lg:h-[600px] overflow-hidden">
            {/* Backdrop Image */}
            <Image
              src={backdropUrl}
              alt={movie.title}
              fill
              className="object-cover opacity-30"
              priority
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

            {/* Movie Details */}
            <div className="relative z-10 flex items-center justify-center min-h-screen lg:min-h-screen">
              <div className="container mx-auto px-4 lg:px-12 py-8 flex flex-col lg:flex-row gap-8">
                {/* Poster */}
                <div className="flex-shrink-0 mx-auto lg:mx-0">
                  <div className="relative w-48 h-72 sm:w-56 sm:h-84 lg:w-64 lg:h-96 rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Movie Info */}
                <div className="flex-1">
                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                    {movie.title}
                  </h1>

                  {/* Tagline */}
                  {movie.tagline && (
                    <p className="text-lg sm:text-xl text-gray-300 italic mb-4">
                      {movie.tagline}
                    </p>
                  )}

                  {/* Rating and Runtime */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(movie.vote_average / 2)
                                ? "text-yellow-400"
                                : "text-gray-600"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-lg font-semibold">
                        {formatRating(movie.vote_average)}/5
                      </span>
                      <span className="text-gray-400">
                        ({movie.vote_count} votes)
                      </span>
                    </div>

                    {movie.runtime && (
                      <div className="text-gray-300">
                        <span className="font-semibold">Runtime:</span>{" "}
                        {formatRuntime(movie.runtime)}
                      </div>
                    )}

                    {movie.release_date && (
                      <div className="text-gray-300">
                        <span className="font-semibold">Release:</span>{" "}
                        {new Date(movie.release_date).getFullYear()}
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  {movie.genres && movie.genres.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Overview */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Overview</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {movie.overview || "No overview available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  try {
    const response = await tmdb.get(`/movie/${id}`);
    const movie = response.data;

    return {
      props: {
        movie,
      },
    };
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return {
      notFound: true,
    };
  }
};

export default MovieDetailPage;
