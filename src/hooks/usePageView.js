import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pushPageView } from '../services/dataLayer';
import { updatePageState } from '../services/appState';

/**
 * Custom hook for tracking page views 
 * Automatically updates both dataLayer and appState
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
    // Track the page view in dataLayer
    pushPageView(pageName, pageData);
     
    // Update app state with current page info
    updatePageState({
      name: pageName,
      type: pageData.pageType,
      url: location.pathname,
    });
  }, [location.pathname]); // Only re-run when the actual route changes
};

export default usePageView;
