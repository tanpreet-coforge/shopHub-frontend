import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { useToast } from '../hooks/useToast';
import { useDataLayer } from '../hooks/useDataLayer';
import { Button } from './Button';

export const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart, isLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { success, error } = useToast();
  const { addToCart: trackAddToCart, wishlistEvent } = useDataLayer();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      // Track add to cart event
      trackAddToCart(product, quantity);
      setQuantity(1);
      success('Added to cart!');
    } catch (err) {
      error('Please login to add items to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product._id);
      // Track remove from wishlist
      wishlistEvent(product, 'remove');
      success('Removed from wishlist');
    } else {
      addToWishlist(product);
      // Track add to wishlist
      wishlistEvent(product, 'add');
      success('Added to wishlist!');
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col h-full group"
      onClick={() => onViewDetails(product._id)}
    >
      {/* Image Container */}
      <div className="relative bg-gray-200 h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
        >
          <Heart
            size={20}
            className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2 flex-1 group-hover:text-amazon-orange transition">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-amazon-orange">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <p className={`text-xs font-semibold mb-3 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock > 0 ? '✓ In Stock' : 'Out of Stock'}
        </p>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding || isLoading}
          variant={product.stock > 0 ? 'primary' : 'ghost'}
          size="sm"
          className="w-full"
          loading={adding}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
