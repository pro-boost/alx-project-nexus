export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  popularity: number;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  backdrop_path: string | null;
}

export interface MovieCardProps {
  movie: Movie;
}

export interface MovieDetailPageProps {
  movie: MovieDetails;
}

export interface GenrePageProps {
  movies: Movie[];
  genre: { id: number; name: string };
  currentPage: number;
  totalPages: number;
}

export interface SearchPageProps {
  movies: Movie[];
  query: string;
  genreId?: string;
  genreName?: string;
  totalResults: number;
  currentPage: number;
  totalPages: number;
}