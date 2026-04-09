import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { Heart, ShoppingCart, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardBody } from '../components/Card';
import { useCart } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success, error } = useToast();

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      success('Added to cart!');
    } catch (err) {
      error('Please login to add items to cart');
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Heart size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-6">Save your favorite items to shop later</p>
          <Button variant="primary" onClick={() => navigate('/products')}>
            Continue Shopping <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">{wishlist.length} item(s)</p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <Card key={product._id} hoverable>
              {/* Image */}
              <div className="relative bg-gray-200 h-48 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/products/${product._id}`)}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product._id);
                    success('Removed from wishlist');
                  }}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-red-50 transition"
                >
                  <Heart size={20} className="fill-red-500 text-red-500" />
                </button>
              </div>

              <CardBody>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  {product.category}
                </p>
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold text-amazon-orange">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  className="w-full"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
