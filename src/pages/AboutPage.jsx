import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Zap, Globe, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardBody } from '../components/Card';

export const AboutPage = () => {
  const stats = [
    { icon: Users, label: 'Active Customers', value: '50,000+' },
    { icon: Award, label: 'Products Listed', value: '100,000+' },
    { icon: Zap, label: 'Orders Processed', value: '200,000+' },
    { icon: Globe, label: 'Countries Served', value: '25+' },
  ];

  const team = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      bio: 'Visionary leader with 10+ years in e-commerce',
      image: '👨‍💼',
    },
    {
      name: 'Sarah Smith',
      role: 'COO',
      bio: 'Operations expert ensuring smooth logistics',
      image: '👩‍💼',
    },
    {
      name: 'Mike Johnson',
      role: 'CTO',
      bio: 'Tech innovator building modern platforms',
      image: '👨‍💻',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amazon-blue to-amazon-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About ShopHub</h1>
          <p className="text-xl text-blue-100 mb-8">
            We're revolutionizing online shopping with quality products, exceptional service, and unbeatable prices.
          </p>
          <Link to="/products">
            <Button variant="primary" size="lg">
              Start Shopping <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                At ShopHub, our mission is to make quality products accessible to everyone, everywhere. We believe in fair pricing, transparent communication, and exceptional customer service. Every transaction is an opportunity to build trust and create lasting relationships with our customers.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We envision a world where shopping is seamless, secure, and satisfying. By leveraging technology and customer insights, we're building the future of e-commerce—where every customer feels valued, every product is trustworthy, and every experience is exceptional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">By The Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} hoverable className="text-center">
                  <CardBody>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amazon-orange/10 rounded-full mb-4">
                      <Icon className="text-amazon-orange" size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-amazon-orange mb-2">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality',
                description: 'We curate and verify every product to ensure only the best reaches our customers.',
              },
              {
                title: 'Integrity',
                description: 'Transparency and honesty guide every decision we make and every interaction we have.',
              },
              {
                title: 'Customer First',
                description: 'Your satisfaction is our priority. We listen, adapt, and improve based on your feedback.',
              },
              {
                title: 'Innovation',
                description: 'We embrace technology and new ideas to continuously enhance your shopping experience.',
              },
              {
                title: 'Sustainability',
                description: 'We care for our planet and promote eco-friendly practices throughout our operations.',
              },
              {
                title: 'Community',
                description: 'We support local businesses and give back to the communities we serve.',
              },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} hoverable>
                <CardBody className="text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-amazon-orange font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amazon-orange to-orange-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-orange-100 mb-8">
            Experience the ShopHub difference today. Quality products, great prices, exceptional service.
          </p>
          <Link to="/products">
            <Button variant="primary" size="lg" className="bg-white text-amazon-orange hover:bg-gray-100">
              Shop Now <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
