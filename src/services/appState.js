/**
 * Application State Object
 * Maintains current state of the website for analytics context
 * Unlike dataLayer (events array), this object updates in-place with current state
 */

/**
 * Initialize the app state object
 */
export const initializeAppState = () => {
  if (!window.appState) {
    window.appState = {
      page: {
        name: 'Home',
        type: 'homepage',
        url: window.location.pathname,
        title: document.title,
      },
      cart: {
        items: 0,
        value: 0,
        lastUpdated: new Date().toISOString(),
      },
      user: {
        logged_in: false,
        id: null,
        email: null,
        firstName: null,
        lastName: null,
      },
      filters: {},
      searchTerm: null,
      lastUpdated: new Date().toISOString(),
    };
  }
};

/**
 * Update page state
 * @param {object} pageData - Page data object { name, type, url?, title? }
 */
export const updatePageState = (pageData = {}) => {
  if (window.appState) {
    window.appState.page = {
      ...window.appState.page,
      name: pageData.name,
      type: pageData.type,
      url: pageData.url || window.location.pathname,
      title: pageData.title || document.title,
    };
    window.appState.lastUpdated = new Date().toISOString();
  }
};

/**
 * Update cart state
 * @param {object} cartData - Cart data { items, value }
 */
export const updateCartState = (cartData = {}) => {
  if (window.appState) {
    window.appState.cart = {
      ...window.appState.cart,
      items: cartData.items !== undefined ? cartData.items : window.appState.cart.items,
      value: cartData.value !== undefined ? cartData.value : window.appState.cart.value,
      lastUpdated: new Date().toISOString(),
    };
    window.appState.lastUpdated = new Date().toISOString();
  }
};

/**
 * Update user state
 * @param {object} userData - User data { logged_in, id, email, firstName, lastName }
 */
export const updateUserState = (userData = {}) => {
  if (window.appState) {
    window.appState.user = {
      logged_in: userData.logged_in !== undefined ? userData.logged_in : window.appState.user.logged_in,
      id: userData.id !== undefined ? userData.id : window.appState.user.id,
      email: userData.email !== undefined ? userData.email : window.appState.user.email,
      firstName: userData.firstName !== undefined ? userData.firstName : window.appState.user.firstName,
      lastName: userData.lastName !== undefined ? userData.lastName : window.appState.user.lastName,
    };
    window.appState.lastUpdated = new Date().toISOString();
  }
};

/**
 * Update filters state
 * @param {object} filters - Filters object { category?, priceRange?, rating?, brand? }
 */
export const updateFiltersState = (filters = {}) => {
  if (window.appState) {
    window.appState.filters = {
      ...window.appState.filters,
      ...filters,
    };
    window.appState.lastUpdated = new Date().toISOString();
  }
};

/**
 * Update search term
 * @param {string} searchTerm - Search term
 */
export const updateSearchTerm = (searchTerm) => {
  if (window.appState) {
    window.appState.searchTerm = searchTerm;
    window.appState.lastUpdated = new Date().toISOString();
  }
};

/**
 * Clear search term
 */
export const clearSearchTerm = () => {
  if (window.appState) {
    window.appState.searchTerm = null;
    window.appState.lastUpdated = new Date().toISOString();
  }
};

/**
 * Clear filters
 */
export const clearFilters = () => {
  if (window.appState) {
    window.appState.filters = {};
    window.appState.lastUpdated = new Date().toISOString();
  }
};

/**
 * Get current app state
 * @returns {object} Current app state
 */
export const getAppState = () => {
  return window.appState || null;
};

/**
 * Reset user state when logging out
 */
export const resetUserState = () => {
  if (window.appState) {
    window.appState.user = {
      logged_in: false,
      id: null,
      email: null,
      firstName: null,
      lastName: null,
    };
    window.appState.lastUpdated = new Date().toISOString();
  }
};

/**
 * Reset cart state
 */
export const resetCartState = () => {
  if (window.appState) {
    window.appState.cart = {
      items: 0,
      value: 0,
      lastUpdated: new Date().toISOString(),
    };
    window.appState.lastUpdated = new Date().toISOString();
  }
};

export default {
  initializeAppState,
  updatePageState,
  updateCartState,
  updateUserState,
  updateFiltersState,
  updateSearchTerm,
  clearSearchTerm,
  clearFilters,
  getAppState,
  resetUserState,
  resetCartState,
};
