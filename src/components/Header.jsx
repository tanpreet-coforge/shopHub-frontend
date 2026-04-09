import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, Heart, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useToast } from '../hooks/useToast';
import { Button } from './Button';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { success } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully!');
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-amazon-dark to-gray-900 text-white sticky top-0 z-50 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-amazon-orange rounded-lg flex items-center justify-center group-hover:scale-110 transition">
              <span className="text-black font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-white">ShopHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-300 hover:text-amazon-orange transition duration-200">
              Home
            </Link>
            <Link to="/products" className="text-gray-300 hover:text-amazon-orange transition duration-200">
              Products
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-amazon-orange transition duration-200">
              About
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-amazon-orange transition duration-200">
              Contact
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="text-gray-300 hover:text-amazon-orange transition duration-200">
                Orders
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-gray-700 rounded-lg transition md:flex hidden items-center justify-center">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-700 rounded-lg transition md:flex hidden items-center justify-center">
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amazon-orange text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-700 relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 hover:bg-gray-700 rounded-lg px-3 py-2 transition"
                >
                  <div className="w-10 h-10 bg-amazon-orange rounded-full flex items-center justify-center text-black font-bold">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-semibold text-white">{user?.firstName}</p>
                    <p className="text-xs text-gray-400">Account</p>
                  </div>
                  <ChevronDown size={16} className={`transition duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition text-gray-300 hover:text-amazon-orange"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition text-gray-300 hover:text-amazon-orange"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <ShoppingCart size={18} />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition text-gray-300 hover:text-amazon-orange md:hidden"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <Heart size={18} />
                      <span>Wishlist</span>
                    </Link>
                    <div className="border-t border-gray-700">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-600 transition text-gray-300 hover:text-white"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-amazon-dark">
            <nav className="py-4 space-y-1">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/cart"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart size={18} />
                Cart {cartItemsCount > 0 && <span className="ml-auto bg-amazon-orange text-black text-xs px-2 py-1 rounded-full font-bold">{cartItemsCount}</span>}
              </Link>
              <Link
                to="/wishlist"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart size={18} />
                Wishlist {wishlistCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">{wishlistCount}</span>}
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white transition flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
