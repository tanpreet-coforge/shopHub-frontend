import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useDataLayer } from '../hooks/useDataLayer';
import { ProductCard } from '../components/ProductCard';
import { ChevronRight, Truck, Star, Lock, Award, Zap } from 'lucide-react';
import { Button } from '../components/Button';

export const HomePage = () => {
  const navigate = useNavigate();
  const { pageView } = useDataLayer();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
    // Track page view
    pageView('Home Page', { pageType: 'homepage' });
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts({ limit: 8 });
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  const categories = [
    { name: 'Electronics', icon: '📱' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Home', icon: '🏠' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Books', icon: '📚' },
    { name: 'Toys', icon: '🎮' },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Get your orders delivered quickly and safely to your doorstep',
    },
    {
      icon: Award,
      title: 'Quality Products',
      description: 'Handpicked products from trusted sellers with verified reviews',
    },
    {
      icon: Lock,
      title: 'Secure Checkout',
      description: 'Safe and secure payment processing with multiple payment options',
    },
    {
      icon: Zap,
      title: 'Easy Returns',
      description: '30-day money-back guarantee on all purchases',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amazon-blue via-blue-600 to-amazon-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-grid-pattern" />
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideDown">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Welcome to <span className="text-amazon-orange">ShopHub</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl">
                Discover an amazing selection of products at unbeatable prices. Shop electronics, fashion, home goods, and much more!
              </p>
              <div className="flex gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/products')}
                  className="group"
                >
                  Shop Now
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/products')}
                >
                  Browse Products
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl transform hover:scale-105 transition duration-500 shadow-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg">Handpicked selections just for you</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-96 animate-shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewDetails={handleViewProduct}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/products')}
            >
              View All Products <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate(`/products?category=${category.name}`)}
                className="group bg-white hover:bg-amazon-orange hover:text-white p-6 rounded-xl text-center font-semibold transition duration-300 shadow-md hover:shadow-lg hover:-translate-y-2"
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition duration-300">
                  {category.icon}
                </div>
                <p className="text-sm md:text-base">{category.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose ShopHub?</h2>
            <p className="text-gray-600 text-lg">We're committed to your shopping experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="hover-lift bg-gray-50 p-8 rounded-xl text-center border border-gray-200"
                >
                  <div className="w-16 h-16 bg-amazon-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amazon-orange/20 transition">
                    <Icon className="text-amazon-orange" size={32} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amazon-blue to-amazon-dark text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of satisfied customers and find your perfect products today!
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/products')}
          >
            Explore Now <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
