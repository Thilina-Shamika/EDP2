'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { toast } from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function ListPropertyPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    listingType: 'Sell',
    propertyAddress: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/list-property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      toast.success('Valuation request submitted successfully');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        listingType: 'Sell',
        propertyAddress: ''
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit request');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto bg-white border border-gray-200 shadow-md rounded-lg p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Book a Valuation</h1>
              <p className="text-gray-600">
                Ready to make your move? Start with a free property valuation. It's quick, easy, and informative.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="Name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="Email"
                />
              </div>

              {/* Mobile Field */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  international
                  defaultCountry="AE"
                  value={formData.mobile}
                  onChange={value => setFormData(prev => ({ ...prev, mobile: value || '' }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                  inputComponent="input"
                  placeholder="07400 123456"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Format: 07400 123456</p>
              </div>

              {/* Listing Type Field */}
              <div>
                <label htmlFor="listingType" className="block text-sm font-medium text-gray-700 mb-1">
                  Listing Type
                </label>
                <select
                  id="listingType"
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
                >
                  <option value="Sell">Sell</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>

              {/* Property Address Field */}
              <div>
                <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Address
                </label>
                <input
                  type="text"
                  id="propertyAddress"
                  name="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="Property Address"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 rounded-full hover:bg-gray-800 transition-colors"
              >
                Submit Details
              </button>

              <p className="text-sm text-gray-500 text-center">
                By clicking Submit, you agree to our Terms & Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
} 