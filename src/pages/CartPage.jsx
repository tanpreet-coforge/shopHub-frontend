import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useAuth';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useDataLayer } from '../hooks/useDataLayer';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '../components/Button';

export const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { error } = useToast();
  const { cartView, removeFromCart: trackRemoveFromCart, pageView } = useDataLayer();
  const {
    cart,
    isLoading,
    fetchCart,
    updateCartItem,
    removeFromCart,
  } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  // Track cart view when cart updates
  useEffect(() => {
    if (cart && isAuthenticated) {
      cartView(cart);
      pageView('Shopping Cart', { pageType: 'cart' });
    }
  }, [cart, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingCart size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your cart</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingCart size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add products to continue shopping</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (err) {
      error(err.message);
    }
  };

  const handleRemoveItem = async (itemId, item) => {
    try {
      await removeFromCart(itemId);
      // Track remove from cart event
      if (item && item.productId) {
        trackRemoveFromCart(item.productId, item.quantity);
      }
    } catch (err) {
      error(err.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-4 border-b last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
                    {item.productId && (
                      <img
                        src={item.productId.image}
                        alt={item.productId.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {item.productId?.name || 'Product'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Category: {item.productId?.category}
                    </p>
                    <p className="text-amazon-orange font-bold mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                      className="w-12 text-center border rounded py-1"
                      min="1"
                    />
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Total for Item */}
                  <div className="text-right min-w-[100px]">
                    <p className="text-lg font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item._id, item)}
                      className="text-red-600 hover:text-red-700 mt-2 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(cart.totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-amazon-orange">
                    ${(cart.totalPrice * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-amazon-orange text-black py-3 rounded-lg font-bold hover:bg-orange-600 transition mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full bg-gray-200 text-black py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
