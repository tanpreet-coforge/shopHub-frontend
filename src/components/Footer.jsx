import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    {
      title: 'Company',
      items: ['About Us', 'Careers', 'Blog', 'Press'],
    },
    {
      title: 'Support',
      items: ['Help Center', 'Contact Us', 'Feedback', 'FAQ'],
    },
    {
      title: 'Legal',
      items: ['Privacy Policy', 'Terms of Service', 'Return Policy', 'Shipping Info'],
    },
  ];

  const socials = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-b from-amazon-dark to-gray-950 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-amazon-orange rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">S</span>
              </div>
              <h3 className="text-2xl font-bold text-white">ShopHub</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted online marketplace for quality products at great prices. Shop with confidence!
            </p>
          </div>

          {/* Links Sections */}
          {links.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4 text-lg">{section.title}</h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-amazon-orange transition duration-200 text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & Social Section */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-amazon-orange flex-shrink-0" />
                  <span className="text-gray-400 text-sm">support@shophub.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-amazon-orange flex-shrink-0" />
                  <span className="text-gray-400 text-sm">1-800-SHOP-HUB</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-amazon-orange flex-shrink-0" />
                  <span className="text-gray-400 text-sm">123 Commerce Street, New York, NY</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 bg-gray-700 hover:bg-amazon-orange text-gray-300 hover:text-black rounded-full flex items-center justify-center transition duration-200"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            © {currentYear} ShopHub. All rights reserved. | E-Commerce Prototype
          </p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <a href="#" className="text-gray-500 hover:text-amazon-orange text-sm transition">
              Terms & Conditions
            </a>
            <a href="#" className="text-gray-500 hover:text-amazon-orange text-sm transition">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-amazon-orange text-sm transition">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
