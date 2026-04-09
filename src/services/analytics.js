/**
 * Adobe Analytics Tracking Utility
 * Use this file to centralize all analytics tracking calls
 */

/**
 * Track a page view
 * @param {string} pageName - Name of the page
 * @param {object} additionalData - Additional data object
 */
export const trackPageView = (pageName, additionalData = {}) => {
  if (window._satellite) {
    window.adobeDataLayer?.push({
      event: 'page_view',
      page_name: pageName,
      ...additionalData,
    });
    console.log(`📊 Tracked page view: ${pageName}`);
  }
};

/**
 * Track product view
 * @param {object} product - Product object
 */
export const trackProductView = (product) => {
  if (window._satellite) {
    window.adobeDataLayer?.push({
      event: 'product_view',
      product_id: product._id,
      product_name: product.name,
      product_price: product.price,
      product_category: product.category,
      product_rating: product.rating,
    });
    console.log(`📊 Tracked product view: ${product.name}`);
  }
};

/**
 * Track add to cart
 * @param {object} product - Product object
 * @param {number} quantity - Quantity added
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (window._satellite) {
    window.adobeDataLayer?.push({
      event: 'add_to_cart',
      product_id: product._id,
      product_name: product.name,
      product_price: product.price,
      quantity: quantity,
    });
    console.log(`📊 Tracked add to cart: ${product.name} x${quantity}`);
  }
};

/**
 * Track remove from cart
 * @param {object} product - Product object
 * @param {number} quantity - Quantity removed
 */
export const trackRemoveFromCart = (product, quantity = 1) => {
  if (window._satellite) {
    window.adobeDataLayer?.push({
      event: 'remove_from_cart',
      product_id: product._id,
      product_name: product.name,
      product_price: product.price,
      quantity: quantity,
    });
    console.log(`📊 Tracked remove from cart: ${product.name}`);
  }
};

/**
 * Track cart view
 * @param {object} cart - Cart object
 */
export const trackCartView = (cart) => {
  if (window._satellite) {
    window.adobeDataLayer?.push({
      event: 'cart_view',
      cart_items: cart.totalItems,
      cart_total: cart.totalPrice,
    });
    console.log(`📊 Tracked cart view: ${cart.totalItems} items`);
  }
};

/**
 * Track search
 * @param {string} searchTerm - Search term
 * @param {number} resultsCount - Number of results
 */
export const trackSearch = (searchTerm, resultsCount = 0) => {
  if (window._satellite) {
    window.adobeDataLayer?.push({
      event: 'search',
      search_term: searchTerm,
      search_results_count: resultsCount,
    });
    console.log(`📊 Tracked search: "${searchTerm}"`);
  }
};

/**
 * Track checkout step
 * @param {number} step - Checkout step (1, 2, 3, etc.)
 * @param {object} cartData - Cart data
 */
export const trackCheckoutStep = (step, cartData = {}) => {
  if (window._satellite) {
    window.adobeDataLayer?.push({
      event: `checkout_step_${step}`,
      checkout_step: step,
      ...cartData,
    });
    console.log(`📊 Tracked checkout step: ${step}`);
  }
};

/**
 * Track purchase
 * @param {object} order - Order object
 */
export const trackPurchase = (order) => {
  if (window._satellite) {
    window.adobeDataLayer?.push({
      event: 'purchase',
      order_id: order._id,
      order_total: order.totalPrice,
      order_items: order.items,
      items_count: order.items?.length || 0,
    });
    console.log(`📊 Tracked purchase: Order #${order._id}`);
  }
};

/**
 * Track user login
 * @param {string} userId - User ID
 */
export const trackUserLogin = (userId) => {
  if (window._satellite) {
    window.adobeDataLayer?.push({
      event: 'user_login',
      user_id: userId,
    });
    console.log(`📊 Tracked user login: ${userId}`);
  }
};

/**
 * Track user registration
 * @param {string} userId - User ID
 */
export const trackUserRegistration = (userId) => {
  if (window._satellite) {
    window.adobeDataLayer?.push({
      event: 'user_registration',
      user_id: userId,
    });
    console.log(`📊 Tracked user registration: ${userId}`);
  }
};

/**
 * Track user logout
 */
export const trackUserLogout = () => {
  if (window._satellite) {
    window.adobeDataLayer?.push({
      event: 'user_logout',
    });
    console.log(`📊 Tracked user logout`);
  }
};

/**
 * Track custom event
 * @param {string} eventName - Event name
 * @param {object} eventData - Event data
 */
export const trackCustomEvent = (eventName, eventData = {}) => {
  if (window._satellite) {
    window.adobeDataLayer?.push({
      event: eventName,
      ...eventData,
    });
    console.log(`📊 Tracked custom event: ${eventName}`, eventData);
  }
};
