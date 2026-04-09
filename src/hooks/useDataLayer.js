import { useContext } from 'react';
import { DataLayerContext } from '../context/DataLayerContext';
import * as dataLayerService from '../services/dataLayer';

/**
 * Custom hook to use data layer functions
 * Returns all data layer functions for easy access
 */
export const useDataLayer = () => {
  const context = useContext(DataLayerContext);
  
  if (!context) {
    console.warn('useDataLayer must be used within DataLayerProvider');
  }

  // Return all data layer functions for easy access
  return {
    push: dataLayerService.pushToDataLayer,
    pageView: dataLayerService.pushPageView,
    productView: dataLayerService.pushProductView,
    addToCart: dataLayerService.pushAddToCart,
    removeFromCart: dataLayerService.pushRemoveFromCart,
    cartView: dataLayerService.pushCartView,
    search: dataLayerService.pushSearch,
    filterApplied: dataLayerService.pushFilterApplied,
    login: dataLayerService.pushLogin,
    signUp: dataLayerService.pushSignUp,
    logout: dataLayerService.pushLogout,
    checkoutStep: dataLayerService.pushCheckoutStep,
    purchase: dataLayerService.pushPurchase,
    wishlistEvent: dataLayerService.pushWishlistEvent,
    userInfo: dataLayerService.pushUserInfo,
    customEvent: dataLayerService.pushCustomEvent,
  };
};

export default useDataLayer;
