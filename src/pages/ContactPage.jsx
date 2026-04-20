import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '../components/Button';
import { usePageView } from '../hooks/usePageView';
import { Input, Textarea } from '../components/Input';
import { useToast } from '../hooks/useToast';
import { Card, CardBody } from '../components/Card';

export const ContactPage = () => {
    // Track page view - updates both dataLayer and appState
  usePageView('Contact Page', { pageType: 'Contact_form' });
  
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
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
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      success('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      description: 'Call us anytime',
      details: '1-800-SHOP-HUB (1-800-746-7482)',
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us an email',
      details: 'support@shophub.com',
    },
    {
      icon: MapPin,
      title: 'Address',
      description: 'Visit our office',
      details: '123 Commerce Street, New York, NY 10001',
    },
    {
      icon: Clock,
      title: 'Hours',
      description: 'We\'re available',
      details: 'Mon - Fri: 9am - 8pm, Sat - Sun: 10am - 6pm',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amazon-blue to-amazon-dark text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100">
            Have questions? We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </div>

      {/* Contact Info Grid */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} hoverable>
                  <CardBody className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amazon-orange/10 rounded-full mb-4">
                      <Icon className="text-amazon-orange" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <p className="font-semibold text-gray-900">{item.details}</p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Form & Map */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Your Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  error={errors.name}
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  error={errors.email}
                />

                <Input
                  label="Subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  error={errors.subject}
                />

                <Textarea
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  error={errors.message}
                />

                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                  <Send size={18} />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">We're Here to Help</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Customer Support</h3>
                    <p className="text-gray-600 mb-4">
                      Our dedicated support team is ready to assist you with any questions or concerns about your orders, products, or account.
                    </p>
                    <p className="text-amazon-orange font-semibold">Available 24/7</p>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Returns & Exchanges</h3>
                    <p className="text-gray-600 mb-4">
                      Not satisfied? We offer hassle-free returns within 30 days of purchase. Your satisfaction is our guarantee.
                    </p>
                    <p className="text-amazon-orange font-semibold">30-Day Money Back Guarantee</p>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Feedback & Suggestions</h3>
                    <p className="text-gray-600 mb-4">
                      We value your opinions and suggestions. Help us improve by sharing your feedback and ideas for making ShopHub better.
                    </p>
                    <p className="text-amazon-orange font-semibold">Your Voice Matters</p>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How long does shipping take?',
                a: 'Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 day delivery.',
              },
              {
                q: 'What is your return policy?',
                a: 'We offer a 30-day money-back guarantee on all purchases. Items must be in original condition.',
              },
              {
                q: 'Do you ship internationally?',
                a: 'Yes, we ship to 25+ countries worldwide. International shipping rates vary by location.',
              },
              {
                q: 'How secure is my payment information?',
                a: 'We use industry-leading SSL encryption and comply with all PCI DSS standards to protect your data.',
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardBody>
                  <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
