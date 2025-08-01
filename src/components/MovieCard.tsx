import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFavorites } from '../utils/useFavorites';
import { Movie, MovieCardProps } from '../types/movie';

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <div className="relative group">
      <Link href={`/movie/${movie.id}`}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div className="relative">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full h-auto object-cover"
                priority={false}
              />
            ) : (
              <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                isMovieFavorite
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
              } backdrop-blur-sm`}
              aria-label={isMovieFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg
                className="w-5 h-5"
                fill={isMovieFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{movie.title}</h3>
            <p className="text-sm text-gray-600">{movie.release_date.substring(0, 4)}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;