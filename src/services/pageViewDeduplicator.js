/**
 * Utility to prevent duplicate page view events
 * Tracks which pages have already been viewed to avoid double-firing in React Strict Mode
 */

const pageViewCache = new Set();

/**
 * Safe page view tracking that prevents duplicates
 * @param {string} pageName - Name of the page
 * @param {object} pageData - Additional page data
 */
export const debouncedPageView = (pushPageView, pageName, pageData = {}) => {
  const cacheKey = `${pageName}_${pageData.pageType || 'default'}`;
  
  // Only fire if we haven't already tracked this page in this session
  if (!pageViewCache.has(cacheKey)) {
    pushPageView(pageName, pageData);
    pageViewCache.add(cacheKey);
  }
};

/**
 * Clear cache when needed (e.g., on page navigation)
 */
export const clearPageViewCache = () => {
  pageViewCache.clear();
};

export default {
  debouncedPageView,
  clearPageViewCache,
};
