import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pushPageView } from '../services/dataLayer';

/**
 * Custom hook for tracking page views 
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
    // Track the page view
    pushPageView(pageName, pageData);
  }, [location.pathname]); // Only re-run when the actual route changes
};

export default usePageView;
