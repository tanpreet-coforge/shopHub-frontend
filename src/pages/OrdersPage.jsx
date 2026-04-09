import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { orderAPI } from '../services/api';
import { Package, Calendar, DollarSign } from 'lucide-react';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your orders</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-amazon-orange text-black px-6 py-3 rounded font-semibold hover:bg-orange-600 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {loading ? (
          <div className="text-center py-12">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  {/* Order ID */}
                  <div>
                    <p className="text-gray-600 text-sm">Order ID</p>
                    <p className="font-semibold">{order.trackingNumber}</p>
                  </div>

                  {/* Order Date */}
                  <div>
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      <Calendar size={16} />
                      Order Date
                    </p>
                    <p className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Total Amount */}
                  <div>
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      <DollarSign size={16} />
                      Total
                    </p>
                    <p className="font-semibold text-amazon-orange">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className={`font-semibold capitalize ${
                      order.orderStatus === 'delivered' ? 'text-green-600' :
                      order.orderStatus === 'cancelled' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {order.orderStatus}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-gray-600">
                        <span>
                          {item.productName} x {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="border-t mt-6 pt-6">
                  <h4 className="font-semibold mb-3">Shipping Address</h4>
                  <p className="text-sm text-gray-700">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="border-t mt-6 pt-6 flex gap-3">
                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="bg-amazon-orange text-black px-4 py-2 rounded font-semibold hover:bg-orange-600 transition"
                  >
                    View Details
                  </button>
                  {order.orderStatus === 'pending' && (
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <Package size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">No orders yet</p>
            <button
              onClick={() => navigate('/products')}
              className="mt-6 bg-amazon-orange text-black px-6 py-2 rounded font-semibold hover:bg-orange-600 transition"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
