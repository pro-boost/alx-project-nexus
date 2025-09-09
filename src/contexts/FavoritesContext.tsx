import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '../types/movie';

interface FavoritesContextType {
  favorites: Movie[];
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (movieId: number) => boolean;
  clearFavorites: () => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = 'cinescope_favorites';

interface FavoritesProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages favorites state globally across the application
 * Uses localStorage for persistence and provides consistent state to all components
 */
export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration and load favorites from localStorage
  useEffect(() => {
    setIsHydrated(true);
    
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

  /**
   * Add a movie to favorites if it's not already present
   */
  const addToFavorites = (movie: Movie) => {
    setFavorites(prev => {
      // Check if movie is already in favorites
      if (prev.some(fav => fav.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  /**
   * Remove a movie from favorites by ID
   */
  const removeFromFavorites = (movieId: number) => {
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
  };

  /**
   * Toggle a movie's favorite status
   */
  const toggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  /**
   * Check if a movie is in favorites
   */
  const isFavorite = (movieId: number): boolean => {
    return favorites.some(movie => movie.id === movieId);
  };

  /**
   * Clear all favorites
   */
  const clearFavorites = () => {
    setFavorites([]);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Custom hook to access favorites context
 * Throws error if used outside of FavoritesProvider
 */
export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;