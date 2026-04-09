import { useCallback } from 'react';
import * as appStateService from '../services/appState';

/**
 * Custom hook to use app state functions
 * Returns all app state functions for easy access
 * 
 * @example
 * const { updatePageState, updateCartState } = useAppState();
 * updatePageState({ name: 'Product Page', type: 'product' });
 */
export const useAppState = () => {
  const updatePage = useCallback(appStateService.updatePageState, []);
  const updateCart = useCallback(appStateService.updateCartState, []);
  const updateUser = useCallback(appStateService.updateUserState, []);
  const updateFilters = useCallback(appStateService.updateFiltersState, []);
  const setSearchTerm = useCallback(appStateService.updateSearchTerm, []);
  const clearSearch = useCallback(appStateService.clearSearchTerm, []);
  const clearFiltersState = useCallback(appStateService.clearFilters, []);
  const getState = useCallback(appStateService.getAppState, []);
  const resetUser = useCallback(appStateService.resetUserState, []);
  const resetCart = useCallback(appStateService.resetCartState, []);
  const updateWishlist = useCallback(appStateService.updateWishlistState, []);

  return {
    updatePageState: updatePage,
    updateCartState: updateCart,
    updateUserState: updateUser,
    updateFiltersState: updateFilters,
    updateSearchTerm: setSearchTerm,
    clearSearchTerm: clearSearch,
    clearFilters: clearFiltersState,
    getAppState: getState,
    resetUserState: resetUser,
    resetCartState: resetCart,
    updateWishlistState: updateWishlist,
  };
};

export default useAppState;
