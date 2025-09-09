import { useFavoritesContext } from '../contexts/FavoritesContext';

/**
 * Custom hook that provides access to favorites functionality
 * This is a wrapper around the FavoritesContext for backward compatibility
 */
export const useFavorites = () => {
  return useFavoritesContext();
};

export default useFavorites;