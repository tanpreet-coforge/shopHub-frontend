import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useCart } from './useAuth';
import { useWishlist } from './useWishlist';

/**
 * Hook to sync user data to appState when user logs in
 * Automatically fetches cart and wishlist when user authentication status changes
 * 
 * @example
 * // In App.jsx after providers are set up
 * useSyncUserDataOnLogin();
 */
export const useSyncUserDataOnLogin = () => {
  const { isAuthenticated } = useAuth();
  const { fetchCart } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    // When user logs in (isAuthenticated becomes true), fetch their data
    if (isAuthenticated) {
      // Fetch cart data
      fetchCart().catch((err) => {
        console.error('Failed to fetch cart on login:', err);
      });
      
      // Wishlist is already synced via context, but we can add any additional logic here
    }
  }, [isAuthenticated, fetchCart]);
};

export default useSyncUserDataOnLogin;
