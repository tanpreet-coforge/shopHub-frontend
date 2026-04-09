import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useAuth';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useDataLayer } from '../hooks/useDataLayer';
import { usePageView } from '../hooks/usePageView';
import { orderAPI } from '../services/api';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { success, error } = useToast();
  const { cart, clearCart } = useCart();
  const { checkoutStep, purchase } = useDataLayer();
  
  // Track page view - updates both dataLayer and appState
  usePageView('Checkout Page', { pageType: 'checkout' });
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || '',
    phone: user?.phone || '',
  });

  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'credit-card',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, cart]);

  // Track checkout step changes
  useEffect(() => {
    if (step && cart) {
      checkoutStep(step, {
        cartValue: cart.totalPrice,
        cartItems: cart.totalItems,
      });
    }
  }, [step, cart]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async () => {
    try {
      setLoading(true);

      const orderData = {
        items: cart.items.map((item) => ({
          productId: item.productId._id,
          productName: item.productId.name,
          quantity: item.quantity,
          price: item.price,
          image: item.productId.image,
        })),
        totalPrice: cart.totalPrice,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: paymentData.paymentMethod,
        paymentStatus: 'paid', // For demo, assume payment is successful
      };

      const response = await orderAPI.createOrder(orderData);
      // Track purchase event
      purchase({
        _id: response.data.order._id,
        totalPrice: response.data.order.totalPrice,
        items: response.data.order.items || cart.items,
      });
      setOrderId(response.data.order._id);
      await clearCart();
      success('Order created successfully!');
      setStep(3);
    } catch (err) {
      error('Error creating order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !cart) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  if (step === 3) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 text-center">
          <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <div className="bg-gray-50 p-4 rounded mb-6">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-lg font-bold">{orderId}</p>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            You will receive a confirmation email shortly with tracking information.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-amazon-orange text-black py-2 rounded font-semibold hover:bg-orange-600 transition"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-black py-2 rounded font-semibold hover:bg-gray-300 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = cart.totalPrice * 1.1; // Include tax

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              {/* Step Indicator */}
              <div className="flex gap-8 mb-8">
                <div className={`flex-1 text-center ${step >= 1 ? 'text-amazon-orange font-bold' : 'text-gray-400'}`}>
                  1. Shipping
                </div>
                <div className={`flex-1 text-center ${step >= 2 ? 'text-amazon-orange font-bold' : 'text-gray-400'}`}>
                  2. Payment
                </div>
                <div className={`flex-1 text-center ${step >= 3 ? 'text-amazon-orange font-bold' : 'text-gray-400'}`}>
                  3. Confirm
                </div>
              </div>

              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      className="col-span-2 sm:col-span-1 px-4 py-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      className="col-span-2 sm:col-span-1 px-4 py-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      name="street"
                      placeholder="Street Address"
                      value={formData.street}
                      onChange={handleFormChange}
                      className="col-span-2 px-4 py-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleFormChange}
                      className="col-span-2 sm:col-span-1 px-4 py-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleFormChange}
                      className="col-span-2 sm:col-span-1 px-4 py-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={handleFormChange}
                      className="col-span-2 sm:col-span-1 px-4 py-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleFormChange}
                      className="col-span-2 sm:col-span-1 px-4 py-2 border rounded"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="col-span-2 sm:col-span-1 px-4 py-2 border rounded"
                      required
                    />
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-amazon-orange text-black py-3 rounded font-semibold hover:bg-orange-600 transition"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Payment Information</h2>
                  <div className="mb-6">
                    <label className="block font-semibold mb-3">Payment Method</label>
                    <div className="space-y-3">
                      {['credit-card', 'debit-card', 'paypal'].map((method) => (
                        <label key={method} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={paymentData.paymentMethod === method}
                            onChange={handlePaymentChange}
                          />
                          <span className="capitalize">{method.replace('-', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {paymentData.paymentMethod !== 'paypal' && (
                    <div className="space-y-4 mb-6">
                      <input
                        type="text"
                        name="cardName"
                        placeholder="Cardholder Name"
                        value={paymentData.cardName}
                        onChange={handlePaymentChange}
                        className="w-full px-4 py-2 border rounded"
                      />
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number (16 digits)"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        className="w-full px-4 py-2 border rounded"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={handlePaymentChange}
                          className="px-4 py-2 border rounded"
                        />
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          className="px-4 py-2 border rounded"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 text-black py-2 rounded font-semibold hover:bg-gray-300 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 bg-amazon-orange text-black py-2 rounded font-semibold hover:bg-orange-600 transition"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>
                      {item.productId?.name?.substring(0, 20)}... x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>${(cart.totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-amazon-orange">${total.toFixed(2)}</span>
                </div>
              </div>

              {step === 2 && (
                <button
                  onClick={handleSubmitOrder}
                  disabled={loading}
                  className="w-full mt-6 bg-amazon-orange text-black py-3 rounded font-bold hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
