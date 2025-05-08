'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This should be moved to an API route for security
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEmail('');
        alert('Thank you for subscribing!');
      } else {
        throw new Error('Subscription failed');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-[#393e46] py-8 w-full">
      <div className="mx-auto max-w-[1200px] pt-20 px-4 sm:px-6">
        {/* First Row - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="col-span-1 flex items-end">
            <Image
              src="/images/logo.webp"
              alt="Elite Destination Property"
              width={180}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <div className="col-span-1">
            <div className="flex flex-col">
              <h3 className="text-white text-sm font-light mb-4 uppercase tracking-wider">
                Enter your email address
              </h3>
              <form onSubmit={handleSubscribe} className="relative flex w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email Address"
                  className="w-full px-4 py-2 rounded-full bg-white text-gray-800 text-sm focus:outline-none pr-36"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#1b2734] text-white px-6 py-1.5 rounded-full text-sm uppercase font-medium hover:bg-[#2c3e50] transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe Now'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Second Row - 5 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 mt-20 gap-8 mb-8">
          <div className="col-span-1">
            <h4 className="text-white text-sm font-medium uppercase mb-4">HEAD OFFICE</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  address line 01,<br />
                  address line 02,<br />
                  city,<br />
                  country
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <div className="text-sm">
                  <div>000 000 0000</div>
                  <div>000 000 0000</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <div className="text-sm">
                  info@example.com
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <h4 className="text-white text-sm font-medium uppercase mb-4">ABOUT ED PROPERTY</h4>
            <nav className="space-y-2">
              <Link href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Who We Are
              </Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Blogs
              </Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Media Center
              </Link>
            </nav>
          </div>
          <div className="col-span-1">
            <h4 className="text-white text-sm font-medium uppercase mb-4">MENU</h4>
            <nav className="space-y-2">
              <Link href="/buy" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Buy
              </Link>
              <Link href="/off-plan" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Off Plan
              </Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Listed Projects
              </Link>
              <Link href="/communities" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Communities
              </Link>
              <Link href="/media-center" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Media Center
              </Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Schedule a Meeting
              </Link>
              <Link href="/contact" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Contact Us
              </Link>
            </nav>
            
          </div>
          <div className="col-span-1">
            <h4 className="text-white text-sm font-medium uppercase mb-4">IMPORTANT LINKS</h4>
            <nav className="space-y-2">
              <Link href="/privacy-policy" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/cookie-policy" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </nav>
          </div>
          <div className="col-span-1">
            <h4 className="text-white text-sm font-medium uppercase mb-4">SOCIAL MEDIA</h4>
            <div className="flex gap-4">
              <Link 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-700/20 flex items-center justify-center text-gray-300 hover:bg-gray-700/40 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-700/20 flex items-center justify-center text-gray-300 hover:bg-gray-700/40 hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-700/20 flex items-center justify-center text-gray-300 hover:bg-gray-700/40 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="col-span-1 h-20 bg-gray-700/20 rounded"></div>
        </div>

        {/* Third Row - Copyright */}
        <div className="border-t border-gray-700 text-center">
          <div className="text-xs text-gray-400">
            All rights reserved @ ED Properties | Web Site Designed by{' '}
            <a 
              href="https://www.digixplanet.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              DigixPlanet
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 