import React, { createContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      setIsLoading(true);
      const response = await cartAPI.addToCart({ productId, quantity });
      setCart(response.data.cart);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add to cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setIsLoading(true);
      const response = await cartAPI.updateCartItem(itemId, { quantity });
      setCart(response.data.cart);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setIsLoading(true);
      const response = await cartAPI.removeFromCart(itemId);
      setCart(response.data.cart);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to remove item';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartAPI.clearCart();
      setCart(response.data.cart);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to clear cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        cartItemsCount: cart?.totalItems || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
