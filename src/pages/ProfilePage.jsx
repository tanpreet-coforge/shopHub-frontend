import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, isLoading } = useAuth();
  const { success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    street: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.address?.city || '',
        street: user.address?.street || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || '',
      });
    }
  }, [isAuthenticated, user, navigate]);

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
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
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
      await updateProfile(formData);
      success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      error(err.message || 'Failed to update profile');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-amazon-blue to-blue-700 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-blue-100">{formData.email}</p>
              </div>
            </div>
          </CardHeader>

          <CardBody>
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">First Name</label>
                    <p className="text-lg font-semibold text-gray-900">{formData.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Last Name</label>
                    <p className="text-lg font-semibold text-gray-900">{formData.lastName}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{formData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-900">{formData.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.street && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Address</h3>
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-gray-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">{formData.street}</p>
                        <p className="text-gray-600">
                          {formData.city}, {formData.state} {formData.postalCode}
                        </p>
                        <p className="text-gray-600">{formData.country}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                  />
                </div>

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled
                />

                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Address Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                    />
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                    <Input
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                    <Input
                      label="Postal Code"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                    <Input
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="primary" type="submit" loading={isLoading}>
                    <Save size={18} />
                    Save Changes
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    <X size={18} />
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardBody>

          {!isEditing && (
            <CardFooter>
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
                className="w-full"
              >
                <Edit2 size={18} />
                Edit Profile
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};
