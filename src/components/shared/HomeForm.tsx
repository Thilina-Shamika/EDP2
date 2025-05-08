'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface CountryData {
  name: string;
  countryCode: string;
  dialCode: string;
}

const HomeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'Buy',
    message: ''
  });
  const [selectedCountry, setSelectedCountry] = useState({
    name: 'United Arab Emirates',
    format: '50 123 4567'
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch('/api/home-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Thank you! Your submission has been received.');
        setFormData({ name: '', phone: '', email: '', type: 'Buy', message: '' });
      } else {
        setError(data.error || 'Something went wrong.');
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (_err) {
      setError('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string, country: CountryData) => {
    setFormData({...formData, phone: value});
    setSelectedCountry({
      name: country.name,
      format: '50 123 4567' // Format for UAE
    });
  };

  return (
    <section className="py-20 relative">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/image-15.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <p className="text-sm text-white">Elite Destination Property</p>
            <h2 className="text-5xl font-bold text-white">
            Building Lasting Partnerships
            </h2>
            <p className="text-gray-300 text-[14px]">
            Ready to explore premium opportunities? Get in touch today and we&apos;ll help you discover the perfect opportunities. Our team is ready to understand your goals and guide you through your next property investment.            </p>
          </div>
          
          {/* Right Column - Form */}
          <div className="bg-gray-800/80 p-6 rounded-lg">
            <h3 className="text-white text-sm mb-6">Fill out this form and a member of our team will be in touch to understand your investment vision and guide you through the possibilities ahead.</h3>
            {success && <div className="mb-4 text-green-400 text-sm">{success}</div>}
            {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="w-full p-3 bg-[#1f2937] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <div className="grid grid-cols-1 gap-1">
                <div className="phone-input-container">
                  <PhoneInput
                    country={'ae'}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    inputProps={{
                      placeholder: '50 123 4567',
                      required: true,
                      className: "form-control !w-full !h-[50px] !pl-[130px] !bg-[#1f2937] !rounded !text-white !placeholder-gray-400 focus:!outline-none focus:!ring-2 focus:!ring-gray-700 !border-0"
                    }}
                    containerClass="phone-input"
                    inputClass="!w-full !h-[50px] !pl-[130px] !bg-[#1f2937] !rounded !text-white !placeholder-gray-400 !border-0 focus:!outline-none focus:!ring-2 focus:!ring-gray-700 !text-[15px]"
                    buttonClass="!bg-[#1f2937] !border-0 !rounded-l !w-[120px] !h-full"
                    dropdownClass="!bg-[#1f2937] !text-white"
                    enableSearch={false}
                    preferredCountries={['ae']}
                  />
                </div>
                <div className="text-gray-400 text-xs pl-1">
                  Selected: {selectedCountry.name} • Format: {selectedCountry.format}
                </div>
              </div>
                
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                className="w-full p-3 bg-[#1f2937] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <select
                name="type"
                className="w-full p-3 bg-[#1f2937] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 appearance-none"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Buy">Buy</option>
                <option value="Commercial">Commercial</option>
                <option value="Off Plan">Off Plan</option>
              </select>

              <textarea
                name="message"
                placeholder="Type your message here"
                rows={4}
                className="w-full p-3 bg-[#1f2937] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 resize-none"
                value={formData.message}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="w-full bg-white text-gray-900 py-3 rounded font-medium hover:bg-gray-100 transition-colors"
                disabled={submitting}
              >
                {submitting ? 'SENDING...' : 'SEND'}
              </button>

              <p className="text-xs text-gray-400 mt-4">
                By submitting this form, you consent to our collection, processing, retention and use of your personal information in accordance with our Data Privacy Policy, and you consent to receiving marketing communications from us and our affiliated entities.
              </p>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .phone-input-container {
          width: 100%;
        }
        .phone-input {
          width: 100%;
        }
        .phone-input .flag-dropdown {
          width: 120px !important;
          height: 100% !important;
          background-color: #1f2937 !important;
          border: none !important;
        }
        .phone-input .selected-flag {
          width: 120px !important;
          padding: 0 0 0 15px !important;
          background-color: transparent !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        .phone-input .selected-flag .flag {
          transform: scale(1.5);
        }
        .phone-input .selected-flag:after {
          content: "" !important;
          display: inline-block !important;
          width: 0 !important;
          height: 0 !important;
          margin-left: 4px !important;
          border-left: 5px solid transparent !important;
          border-right: 5px solid transparent !important;
          border-top: 5px solid #fff !important;
          position: absolute !important;
          right: 8px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
        }
        .phone-input .selected-flag .arrow {
          display: none !important;
        }
        .phone-input .form-control {
          height: 50px !important;
          padding-left: 130px !important;
          font-size: 15px !important;
          border: none !important;
          outline: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
        .phone-input .country-code {
          color: white !important;
          font-size: 15px !important;
          margin-left: 8px !important;
        }
        .phone-input .selected-flag:hover,
        .phone-input .selected-flag:focus,
        .phone-input .selected-flag.open {
          background-color: #1f2937 !important;
        }
        .phone-input .country-list {
          background-color: #1f2937 !important;
          color: white !important;
          margin-top: 2px !important;
          width: 350px !important;
          max-height: 300px !important;
          border: none !important;
        }
        .phone-input .country-list .country {
          padding: 12px 15px !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }
        .phone-input .country-list .country .flag {
          transform: scale(1.2);
        }
        .phone-input .country-list .country .dial-code {
          color: #9ca3af !important;
        }
        .phone-input .country-list .country:hover {
          background-color: #374151 !important;
        }
        .phone-input .country-list .country.highlight {
          background-color: #374151 !important;
        }
      `}</style>
    </section>
  );
};

export default HomeForm; 