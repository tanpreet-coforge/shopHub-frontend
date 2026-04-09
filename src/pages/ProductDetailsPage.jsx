import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useDataLayer } from '../hooks/useDataLayer';
import { updatePageState } from '../services/appState';
import { pushPageView } from '../services/dataLayer';
import { Star, ShoppingCart, ChevronLeft } from 'lucide-react';
import { Button } from '../components/Button';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { success, error } = useToast();
  const { productView, addToCart: trackAddToCart } = useDataLayer();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  
  // Track page view when product loads
  useEffect(() => {
    if (product) {
      pushPageView(`Product: ${product.name}`, { pageType: 'product_detail' });
      updatePageState({
        name: `Product: ${product.name}`,
        type: 'product_detail',
      });
    }
  }, [product]);
  
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      setProduct(response.data);
      // Track product view
      productView(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      // Track add to cart event
      trackAddToCart(product, quantity);
      setQuantity(1);
      success('Product added to cart!');
    } catch (err) {
      error('Please login to add items to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="py-20 text-center">Product not found</div>;
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="mb-8 text-amazon-orange hover:text-orange-600 font-semibold flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg h-96">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-cover"
              />
            </div>

            {/* Details */}
            <div>
              {/* Category & Rating */}
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviews.length} reviews)
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              {/* Price */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-amazon-orange">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">{product.description}</p>

              {/* Stock Status */}
              <div className="mb-6">
                <p className={`text-lg font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `✓ ${product.stock} in stock` : 'Out of Stock'}
                </p>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <label className="font-semibold">Quantity:</label>
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 text-center border-none"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || adding || isCartLoading}
                  className="w-full bg-amazon-orange text-black py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={24} />
                  {adding ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">Key Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Free shipping on orders over $50</li>
                  <li>✓ 30-day money-back guarantee</li>
                  <li>✓ 1-year warranty included</li>
                  <li>✓ 24/7 customer support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 pt-12 border-t">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            {product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{review.userName}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
