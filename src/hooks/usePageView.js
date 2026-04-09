import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pushPageView, clearPageViewCache } from '../services/dataLayer';

/**
 * Custom hook for tracking page views with automatic deduplication
 * Prevents duplicate page view events even in React Strict Mode
 * 
 * @param {string} pageName - Name of the page to track
 * @param {object} pageData - Additional page data (pageType, etc.)
 * 
 * @example
 * // In a page component:
 * usePageView('Home Page', { pageType: 'homepage' });
 */
export const usePageView = (pageName, pageData = {}) => {
  const location = useLocation();

  useEffect(() => {
    // Track the page view with automatic deduplication
    pushPageView(pageName, pageData);

    // Cleanup: clear cache when navigating away to allow re-tracking on return
    return () => {
      // Optional: clear cache for this specific page when unmounting
      // This allows the page to be tracked again if user returns to it
    };
  }, [location.pathname]); // Only re-run when the actual route changes
};

export default usePageView;
