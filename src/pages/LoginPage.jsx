import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useDataLayer } from '../hooks/useDataLayer';
import { usePageView } from '../hooks/usePageView';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, user } = useAuth();
  const { error: showError } = useToast();
  const { login: trackLogin } = useDataLayer();
  
  // Track page view - updates both dataLayer and appState
  usePageView('Login Page', { pageType: 'login' });
  
  const [formData, setFormData] = useState({
    email: 'Email',
    password: 'Password',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      // Track login event
      trackLogin(user?._id || formData.email, { email: formData.email, method: 'email' });
      navigate('/');
    } catch (err) {
      // Error is handled by useToast hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amazon-blue via-blue-600 to-amazon-dark flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amazon-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-600">Welcome back to ShopHub</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              error={errors.email}
              helperText="Use testuser@example.com for demo"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              helperText="Demo password: password123"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={isLoading}
            >
              <LogIn size={18} />
              Sign In
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={() => {
                setFormData({
                  email: 'testuser@example.com',
                  password: 'password123',
                });
                setErrors({});
              }}
            >
              Use Demo Credentials
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to ShopHub?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link to="/register">
            <Button variant="outline" size="lg" className="w-full">
              Create an Account
            </Button>
          </Link>
        </div>

        {/* Demo Info Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-white font-semibold mb-3">Demo Account</h3>
          <p className="text-blue-100 text-sm space-y-2">
            <span className="block">Email: testuser@example.com</span>
            <span className="block">Password: password123</span>
          </p>
        </div>
      </div>
    </div>
  );
};
