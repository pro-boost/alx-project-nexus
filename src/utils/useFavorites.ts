import { useState, useEffect } from 'react';
import { Movie } from '../types/movie';

const FAVORITES_KEY = 'cinescope_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
    
    // Load favorites from localStorage
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      localStorage.removeItem(FAVORITES_KEY);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites, isHydrated]);

  const addToFavorites = (movie: Movie) => {
    setFavorites(prev => {
      // Check if movie is already in favorites
      if (prev.some(fav => fav.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFromFavorites = (movieId: number) => {
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
  };

  const toggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const isFavorite = (movieId: number): boolean => {
    return favorites.some(movie => movie.id === movieId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };
};

export default useFavorites;