import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { orderAPI } from '../services/api';
import { ChevronLeft, Package, Calendar, DollarSign, MapPin, User as UserIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Badge } from '../components/UI';

export const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchOrderDetails();
    }
  }, [isAuthenticated, orderId, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrderById(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-pulse">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Order Not Found</h2>
          <Button variant="primary" onClick={() => navigate('/orders')}>
            <ChevronLeft size={18} />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-200 text-yellow-800',
    confirmed: 'bg-blue-200 text-blue-800',
    shipped: 'bg-purple-200 text-purple-800',
    delivered: 'bg-green-200 text-green-800',
    cancelled: 'bg-red-200 text-red-800',
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/orders')}
          className="mb-6"
        >
          <ChevronLeft size={18} />
          Back to Orders
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-2">Order ID: {order._id}</p>
          </div>
          <Badge variant="primary" className={statusColors[order.status] || 'bg-gray-200 text-gray-800'}>
            {order.status?.toUpperCase()}
          </Badge>
        </div>

        {/* Order Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Order Timeline */}
          <Card>
            <CardBody>
              <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-amazon-orange" />
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ordered</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {order.shippedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipped</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(order.shippedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivered</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(order.deliveredAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Price Summary */}
          <Card>
            <CardBody>
              <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-amazon-orange" />
                Price Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-900">${order.shippingCost?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-amazon-orange">${order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Items */}
        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Order Items ({order.items?.length})</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex gap-4 border-b pb-4 last:border-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg bg-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">Qty: {item.quantity}</p>
                    <p className="text-amazon-orange font-semibold mt-2">${item.price?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={20} className="text-amazon-orange" />
              Shipping Address
            </h3>
          </CardHeader>
          <CardBody>
            <div className="flex items-start gap-3">
              <UserIcon size={18} className="text-gray-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                <p className="text-gray-600">{order.shippingAddress?.street}</p>
                <p className="text-gray-600">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                </p>
                <p className="text-gray-600">{order.shippingAddress?.country}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
