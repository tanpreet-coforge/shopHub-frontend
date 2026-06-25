import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, Heart, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useToast } from '../hooks/useToast';
import { useDataLayer } from '../hooks/useDataLayer';
import { productAPI } from '../services/api';
import { Button } from './Button';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { success } = useToast();
  const { buttonClick } = useDataLayer();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const profileMenuRef = useRef(null);
  const categoriesMenuRef = useRef(null);

  const trackHeaderClick = (button_name, button_position, link_text, button_type = 'link') => () => {
    buttonClick({
      button_name,
      button_position,
      link_text,
      button_type,
      page_section: 'header',
    });
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (categoriesMenuRef.current && !categoriesMenuRef.current.contains(event.target)) {
        setCategoriesMenuOpen(false);
      }
    };

    if (profileMenuOpen || categoriesMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen, categoriesMenuOpen]);

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
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={trackHeaderClick('ShopHub Logo', 'header_navigation', 'ShopHub')}
          >
            <div className="w-8 h-8 bg-amazon-orange rounded-lg flex items-center justify-center group-hover:scale-110 transition">
              <span className="text-black font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-white">ShopHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-amazon-orange transition duration-200"
              onClick={trackHeaderClick('Home', 'header_navigation', 'Home')}
            >
              Home
            </Link>
            
            {/* Products Dropdown */}
            <div className="relative group" ref={categoriesMenuRef}>
              <button
                onClick={() => {
                  setCategoriesMenuOpen(!categoriesMenuOpen);
                  buttonClick({
                    button_name: 'Products Dropdown',
                    button_position: 'header_navigation',
                    button_type: 'button',
                    page_section: 'header',
                  });
                }}
                onMouseEnter={() => setCategoriesMenuOpen(true)}
                onMouseLeave={() => setCategoriesMenuOpen(false)}
                className="flex items-center gap-1 text-gray-300 hover:text-amazon-orange transition duration-200"
              >
                Products
                <ChevronDown size={16} className={`transition duration-200 ${categoriesMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Categories Dropdown Menu */}
              {categoriesMenuOpen && (
                <div 
                  className="absolute left-0 mt-0 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
                  onMouseEnter={() => setCategoriesMenuOpen(true)}
                  onMouseLeave={() => setCategoriesMenuOpen(false)}
                >
                  <Link
                    to="/products"
                    className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                    onClick={() => {
                      setCategoriesMenuOpen(false);
                      buttonClick({
                        button_name: 'All Products',
                        button_position: 'header_navigation',
                        link_text: 'All Products',
                        button_type: 'link',
                        page_section: 'header',
                      });
                    }}
                  >
                    All Products
                  </Link>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        navigate(`/products?category=${encodeURIComponent(category)}`);
                        setCategoriesMenuOpen(false);
                        buttonClick({
                          button_name: category,
                          button_position: 'header_navigation',
                          link_text: category,
                          button_type: 'link',
                          page_section: 'header',
                        });
                      }}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Link
              to="/about"
              className="text-gray-300 hover:text-amazon-orange transition duration-200"
              onClick={trackHeaderClick('About', 'header_navigation', 'About')}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-amazon-orange transition duration-200"
              onClick={trackHeaderClick('Contact', 'header_navigation', 'Contact')}
            >
              Contact
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                className="text-gray-300 hover:text-amazon-orange transition duration-200"
                onClick={trackHeaderClick('Orders', 'header_navigation', 'Orders')}
              >
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
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-700 rounded-lg transition md:flex hidden items-center justify-center"
              onClick={trackHeaderClick('Cart', 'header_quick_access', 'Cart')}
            >
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
                  onClick={() => {
                    setProfileMenuOpen(!profileMenuOpen);
                    buttonClick({
                      button_name: 'Account Menu Toggle',
                      button_position: 'header_profile',
                      button_type: 'button',
                      page_section: 'header',
                    });
                  }}
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
                      onClick={() => {
                        setProfileMenuOpen(false);
                        buttonClick({
                          button_name: 'My Profile',
                          button_position: 'header_profile',
                          link_text: 'My Profile',
                          button_type: 'link',
                          page_section: 'header',
                        });
                      }}
                    >
                      <User size={18} />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition text-gray-300 hover:text-amazon-orange"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        buttonClick({
                          button_name: 'My Orders',
                          button_position: 'header_profile',
                          link_text: 'My Orders',
                          button_type: 'link',
                          page_section: 'header',
                        });
                      }}
                    >
                      <ShoppingCart size={18} />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition text-gray-300 hover:text-amazon-orange md:hidden"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        buttonClick({
                          button_name: 'Wishlist',
                          button_position: 'header_profile',
                          link_text: 'Wishlist',
                          button_type: 'link',
                          page_section: 'header',
                        });
                      }}
                    >
                      <Heart size={18} />
                      <span>Wishlist</span>
                    </Link>
                    <div className="border-t border-gray-700">
                      <button
                        onClick={() => {
                          handleLogout();
                          buttonClick({
                            button_name: 'Logout',
                            button_position: 'header_profile',
                            button_type: 'button',
                            page_section: 'header',
                          });
                        }}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    trackingName="Sign In"
                    trackingPosition="header_auth"
                    trackingLinkText="Sign In"
                    trackingType="link"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="primary"
                    size="sm"
                    trackingName="Register"
                    trackingPosition="header_auth"
                    trackingLinkText="Register"
                    trackingType="link"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                buttonClick({
                  button_name: mobileMenuOpen ? 'Close Mobile Menu' : 'Open Mobile Menu',
                  button_position: 'header_menu',
                  button_type: 'button',
                  page_section: 'header',
                });
              }}
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
                onClick={() => {
                  setMobileMenuOpen(false);
                  buttonClick({
                    button_name: 'Home',
                    button_position: 'header_mobile_navigation',
                    link_text: 'Home',
                    button_type: 'link',
                    page_section: 'header',
                  });
                }}
              >
                Home
              </Link>
               
              {/* Mobile Products Menu */}
              <div className="border-t border-gray-600 pt-2">
                <p className="block px-4 py-2 text-gray-400 font-semibold text-sm uppercase">Products</p>
                <Link
                  to="/products"
                  className="block px-6 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    buttonClick({
                      button_name: 'All Products',
                      button_position: 'header_mobile_navigation',
                      link_text: 'All Products',
                      button_type: 'link',
                      page_section: 'header',
                    });
                  }}
                >
                  All Products
                </Link>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      navigate(`/products?category=${encodeURIComponent(category)}`);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-6 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                  >
                    {category}
                  </button>
                ))}
              </div>
               
              <Link
                to="/about"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                onClick={() => {
                  setMobileMenuOpen(false);
                  buttonClick({
                    button_name: 'About',
                    button_position: 'header_mobile_navigation',
                    link_text: 'About',
                    button_type: 'link',
                    page_section: 'header',
                  });
                }}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                onClick={() => {
                  setMobileMenuOpen(false);
                  buttonClick({
                    button_name: 'Contact',
                    button_position: 'header_mobile_navigation',
                    link_text: 'Contact',
                    button_type: 'link',
                    page_section: 'header',
                  });
                }}
              >
                Contact
              </Link>
              <Link
                to="/cart"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition flex items-center gap-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  buttonClick({
                    button_name: 'Cart',
                    button_position: 'header_mobile_quick_access',
                    link_text: 'Cart',
                    button_type: 'link',
                    page_section: 'header',
                  });
                }}
              >
                <ShoppingCart size={18} />
                Cart {cartItemsCount > 0 && <span className="ml-auto bg-amazon-orange text-black text-xs px-2 py-1 rounded-full font-bold">{cartItemsCount}</span>}
              </Link>
              <Link
                to="/wishlist"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition flex items-center gap-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  buttonClick({
                    button_name: 'Wishlist',
                    button_position: 'header_mobile_quick_access',
                    link_text: 'Wishlist',
                    button_type: 'link',
                    page_section: 'header',
                  });
                }}
              >
                <Heart size={18} />
                Wishlist {wishlistCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">{wishlistCount}</span>}
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      buttonClick({
                        button_name: 'Orders',
                        button_position: 'header_mobile_navigation',
                        link_text: 'Orders',
                        button_type: 'link',
                        page_section: 'header',
                      });
                    }}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition flex items-center gap-2"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      buttonClick({
                        button_name: 'Profile',
                        button_position: 'header_mobile_navigation',
                        link_text: 'Profile',
                        button_type: 'link',
                        page_section: 'header',
                      });
                    }}
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      buttonClick({
                        button_name: 'Logout',
                        button_position: 'header_mobile_navigation',
                        button_type: 'button',
                        page_section: 'header',
                      });
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
                    onClick={() => {
                      setMobileMenuOpen(false);
                      buttonClick({
                        button_name: 'Sign In',
                        button_position: 'header_mobile_auth',
                        link_text: 'Sign In',
                        button_type: 'link',
                        page_section: 'header',
                      });
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-amazon-orange transition"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      buttonClick({
                        button_name: 'Register',
                        button_position: 'header_mobile_auth',
                        link_text: 'Register',
                        button_type: 'link',
                        page_section: 'header',
                      });
                    }}
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
