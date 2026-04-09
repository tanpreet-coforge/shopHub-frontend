import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useDataLayer } from '../hooks/useDataLayer';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, user } = useAuth();
  const { error: showError } = useToast();
  const { signUp: trackSignUp, pageView } = useDataLayer();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  useEffect(() => {
    // Track page view
    pageView('Register Page', { pageType: 'register' });
  }, []);

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
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
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
      await register(formData);
      // Track sign up event
      trackSignUp(user?._id || formData.email, {
        email: formData.email,
        firstName: formData.firstName,
        method: 'email'
      });
      navigate('/');
    } catch (err) {
      // Error is handled by useToast hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amazon-blue via-blue-600 to-amazon-dark flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amazon-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join ShopHub and start shopping</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                icon={User}
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                error={errors.firstName}
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                icon={User}
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                error={errors.lastName}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              error={errors.password}
              helperText="At least 6 characters required"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              error={errors.confirmPassword}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={isLoading}
            >
              <UserPlus size={18} />
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
