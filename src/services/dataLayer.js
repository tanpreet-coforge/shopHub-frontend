/**
 * Global Data Layer Utility for Adobe Launch/Analytics
 * Initializes and manages window.dataLayer for event tracking
 */

// Cache to prevent duplicate purchase event
const purchaseCache = new Set();

/**
 * Initialize the global data layer
 */
export const initializeDataLayer = () => {
  // Create global dataLayer array if it doesn't exist
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  console.log('✅ Data Layer initialized');
};

/**
 * Push data to the data layer
 * @param {object} data - Data object to push
 */
export const pushToDataLayer = (data) => {
  if (window.dataLayer) {
    window.dataLayer.push(data);
    console.log('📊 Data Layer Event Pushed:', data);
  } else {
    console.warn('⚠️  Data Layer not initialized. Call initializeDataLayer() first');
  }
};

/**
 * Push page view data
 * @param {string} pageName - Name of the page
 * @param {object} pageData - Additional page data
 */
export const pushPageView = (pageName, pageData = {}) => {

  pushToDataLayer({
    event: 'page_view',
    page_name: pageName,
    page_type: pageData.pageType,
    page_url: window.location.pathname,
    page_title: document.title,
    timestamp: new Date().toISOString(),
    ...pageData,
  });
  
};

/**
 * Push product view event
 * @param {object} product - Product object
 */
export const pushProductView = (product) => {
  pushToDataLayer({
    event: 'product_view',
    product_id: product._id,
    product_name: product.name,
    product_price: product.price,
    product_category: product.category,
    product_rating: product.rating,
    product_image: product.image,
    product_stock: product.stock,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Push add to cart event
 * @param {object} product - Product object
 * @param {number} quantity - Quantity added
 */
export const pushAddToCart = (product, quantity = 1) => {
  pushToDataLayer({
    event: 'add_to_cart',
    product_id: product._id,
    product_name: product.name,
    product_price: product.price,
    product_category: product.category,
    quantity: quantity,
    value: product.price * quantity,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Push remove from cart event
 * @param {object} product - Product object
 * @param {number} quantity - Quantity removed
 */
export const pushRemoveFromCart = (product, quantity = 1) => {
  pushToDataLayer({
    event: 'remove_from_cart',
    product_id: product._id,
    product_name: product.name,
    product_price: product.price,
    quantity: quantity,
    value: product.price * quantity,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Push cart view event
 * @param {object} cart - Cart object
 */
export const pushCartView = (cart) => {
  pushToDataLayer({
    event: 'cart_view',
    cart_items: cart.totalItems || 0,
    cart_value: cart.totalPrice || 0,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Push search event
 * @param {string} searchTerm - Search term
 * @param {object} filters - Filter object
 * @param {number} resultsCount - Number of results
 */
export const pushSearch = (searchTerm, filters = {}, resultsCount = 0) => {
  pushToDataLayer({
    event: 'search',
    search_term: searchTerm,
    search_category: filters.category,
    search_price_range: filters.priceRange,
    search_sort: filters.sort,
    search_results_count: resultsCount,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Push filter applied event
 * @param {object} filters - Applied filters
 */
export const pushFilterApplied = (filters) => {
  pushToDataLayer({
    event: 'filter_applied',
    filter_category: filters.category,
    filter_price_range: filters.priceRange,
    filter_rating: filters.rating,
    filter_brand: filters.brand,
    all_filters: JSON.stringify(filters),
    timestamp: new Date().toISOString(),
  });
};

/**
 * Push login event
 * @param {string} userId - User ID
 * @param {object} userData - Additional user data
 */
export const pushLogin = (userId, userData = {}) => {
  pushToDataLayer({
    event: 'login',
    user_id: userId,
    user_email: userData.email,
    user_name: userData.firstName,
    login_method: userData.method || 'email',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Push signup event
 * @param {string} userId - User ID
 * @param {object} userData - User data
 */
export const pushSignUp = (userId, userData = {}) => {
  pushToDataLayer({
    event: 'sign_up',
    user_id: userId,
    user_email: userData.email,
    user_name: userData.firstName,
    signup_method: userData.method || 'email',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Push logout event
 */
export const pushLogout = () => {
  pushToDataLayer({
    event: 'logout',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Push checkout step event
 * @param {number} step - Checkout step (1, 2, 3)
 * @param {object} checkoutData - Checkout data
 */
export const pushCheckoutStep = (step, checkoutData = {}) => {
  pushToDataLayer({
    event: `checkout_step_${step}`,
    checkout_step: step,
    cart_value: checkoutData.cartValue,
    cart_items: checkoutData.cartItems,
    payment_method: checkoutData.paymentMethod,
    shipping_method: checkoutData.shippingMethod,
    timestamp: new Date().toISOString(),
  });
};

/**
  * Push purchase event (deduplicated to prevent accidental duplicate orders)
 * @param {object} order - Order object
 */
export const pushPurchase = (order) => {
    const orderId = order._id || order.id;
  
  // Prevent duplicate purchase events for the same order
  if (purchaseCache.has(orderId)) {
    console.log('ℹ️  Purchase event already tracked (duplicate prevented):', orderId);
    return;
  }
  
  pushToDataLayer({
    event: 'purchase',
    order_id: order._id,
    order_total: order.totalPrice,
    order_items_count: order.items?.length || 0,
    order_items: order.items?.map(item => ({
      product_id: item.productId?._id || item.productId,
      product_name: item.productId?.name,
      product_price: item.price,
      quantity: item.quantity,
    })),
    currency: 'USD',
    timestamp: new Date().toISOString(),
  });

  purchaseCache.add(orderId);
};

/**
 * Push wishlist event
 * @param {object} product - Product object
 * @param {string} action - 'add' or 'remove'
 */
export const pushWishlistEvent = (product, action = 'add') => {
  pushToDataLayer({
    event: action === 'add' ? 'add_to_wishlist' : 'remove_from_wishlist',
    product_id: product._id,
    product_name: product.name,
    product_price: product.price,
    product_category: product.category,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Push page user info to data layer
 * @param {object} user - User object
 */
export const pushUserInfo = (user) => {
  if (user) {
    pushToDataLayer({
      user_id: user._id,
      user_email: user.email,
      user_name: `${user.firstName} ${user.lastName}`,
      user_first_name: user.firstName,
      user_last_name: user.lastName,
      user_phone: user.phone,
      user_authenticated: true,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Push custom event
 * @param {string} eventName - Event name
 * @param {object} eventData - Event data
 */
export const pushCustomEvent = (eventName, eventData = {}) => {
  pushToDataLayer({
    event: eventName,
    ...eventData,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Get current data layer
 * @returns {array} Current data layer
 */
export const getDataLayer = () => {
  return window.dataLayer || [];
};

export default {
  initializeDataLayer,
  pushToDataLayer,
  pushPageView,
  pushProductView,
  pushAddToCart,
  pushRemoveFromCart,
  pushCartView,
  pushSearch,
  pushFilterApplied,
  pushLogin,
  pushSignUp,
  pushLogout,
  pushCheckoutStep,
  pushPurchase,
  pushWishlistEvent,
  pushUserInfo,
  pushCustomEvent,
  getDataLayer,
};
