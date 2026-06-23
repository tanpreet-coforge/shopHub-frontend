import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useDataLayer } from '../hooks/useDataLayer';
import { usePageView } from '../hooks/usePageView';
import { updateFiltersState, updateSearchTerm, clearSearchTerm, clearFilters } from '../services/appState';
import { ProductCard } from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

export const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { search, filterApplied } = useDataLayer();
  
  // Track page view - updates both dataLayer and appState
  usePageView('Products Page', { pageType: 'products_list' });
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: 'newest',
    page: 1,
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    brand: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // Update appState whenever filters or search changes
  useEffect(() => {
    if (filters.search) {
      updateSearchTerm(filters.search);
    } else {
      clearSearchTerm();
    }
    
    const filtersToUpdate = {};
    if (filters.category) filtersToUpdate.category = filters.category;
    if (filters.priceRange.min !== 0 || filters.priceRange.max !== 10000) {
      filtersToUpdate.priceRange = filters.priceRange;
    }
    if (filters.rating > 0) filtersToUpdate.rating = filters.rating;
    if (filters.brand) filtersToUpdate.brand = filters.brand;
    
    if (Object.keys(filtersToUpdate).length > 0) {
      updateFiltersState(filtersToUpdate);
    } else {
      clearFilters();
    }
  }, [filters.search, filters.category, filters.priceRange, filters.rating, filters.brand]);
  
  useEffect(() => {
    fetchProducts();
    // Track search or filter applied
    if (filters.search) {
      search(filters.search, filters, products.length);
    }
    if (filters.category || filters.brand || filters.rating > 0 || 
        (filters.priceRange.min !== 0 || filters.priceRange.max !== 10000)) {
      filterApplied(filters);
    }
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await productAPI.getCategories();
      // Extract unique brands from the response (adjust based on your API)
      // For now, using a placeholder - update with actual API endpoint if available
      setBrands([]);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        limit: 12,
        category: filters.category || undefined,
        search: filters.search || undefined,
        sort: filters.sort,
        minPrice: filters.priceRange.min,
        maxPrice: filters.priceRange.max,
        rating: filters.rating > 0 ? filters.rating : undefined,
        brand: filters.brand || undefined,
      };
      
      const response = await productAPI.getAllProducts(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
      );
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === 'priceMin' || filterName === 'priceMax') {
      const newPrice = { ...filters.priceRange };
      if (filterName === 'priceMin') {
        newPrice.min = parseInt(value) || 0;
      } else {
        newPrice.max = parseInt(value) || 10000;
      }
      setFilters({
        ...filters,
        priceRange: newPrice,
        page: 1,
      });
    } else {
      setFilters({
        ...filters,
        [filterName]: value,
        page: 1,
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({
      ...filters,
      page: 1,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              type="submit"
              className="bg-amazon-orange text-black px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter size={20} />
                Filters
              </h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Category</h4>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Min: ₹{filters.priceRange.min}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={filters.priceRange.min}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Max: ₹{filters.priceRange.max}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={filters.priceRange.max}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Minimum Rating</h4>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4 Stars & Up</option>
                  <option value="3">3 Stars & Up</option>
                  <option value="2">2 Stars & Up</option>
                  <option value="1">1 Star & Up</option>
                </select>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Brand</h4>
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Sort Filter */}
              <div>
                <h4 className="font-semibold mb-3">Sort By</h4>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-6">
                <button
                  onClick={() => {
                    setFilters({
                      search: '',
                      category: '',
                      sort: 'newest',
                      page: 1,
                      priceRange: { min: 0, max: 10000 },
                      rating: 0,
                      brand: '',
                    });
                    clearFilters();
                  }}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg h-96 animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onViewDetails={(id) => navigate(`/products/${id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
