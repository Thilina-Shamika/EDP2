'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, FC } from 'react';

const Hero: FC = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (propertyType) params.append('type', propertyType);
    if (location) params.append('location', location);
    if (activeTab === 'buy' && bedrooms) params.append('beds', bedrooms);
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.append('minPrice', min);
      if (max) params.append('maxPrice', max);
    }
    window.location.href = `/${activeTab}?${params.toString()}`;
  };

  return (
    <section className="relative min-h-[120vh] md:h-screen w-full overflow-hidden flex items-center py-20 md:py-0">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero_bg.jpeg"
          alt="Luxury Real Estate"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
          quality={100}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative w-full flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-8 text-white">
            {/* Headline */}
            <div className="w-full max-w-3xl p-6 text-center">
              <h1 className="text-3xl md:text-[45px] font-bold leading-tight">
                Ready to Begin Your <br />Real Estate Journey?
              </h1>
              <p className="mt-4 text-sm text-white/80 max-w-2xl mx-auto">
                Partner with us to explore premium investment opportunities in the UAE&apos;s most sought-after developments. Like every successful partnership we&apos;ve built, your journey with us will be defined by our commitment to excellence and a strong understanding of your investment goals.
              </p>
            </div>
            {/* Tabs */}
            <div className="w-full max-w-6xl">
              <div className="flex flex-wrap bg-[#f5f5f5] rounded-t-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab('buy')}
                  className={`px-8 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'buy'
                      ? 'bg-white text-gray-800'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setActiveTab('commercial')}
                  className={`px-8 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'commercial'
                      ? 'bg-white text-gray-800'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  COMMERCIAL
                </button>
                <Link
                  href="/off-plan"
                  className={`px-8 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'off-plan'
                      ? 'bg-white text-gray-800'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('off-plan')}
                >
                  OFF PLAN
                </Link>
                <Link
                  href="/list-property"
                  className="px-8 py-4 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  LIST YOUR PROPERTY
                </Link>
              </div>

              {/* Filter Section */}
              {isMounted && (
                <div className="bg-white rounded-b-lg p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                  <select
                    className="w-full md:flex-1 px-4 py-3 bg-transparent text-gray-600 text-sm focus:outline-none"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="">Select Property Type</option>
                    {activeTab === 'buy' ? (
                      <>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="duplex">Duplex</option>
                        <option value="studio">Studio</option>
                        <option value="loft">Loft</option>
                      </>
                    ) : (
                      <>
                        <option value="office">Office</option>
                        <option value="retail">Retail</option>
                        <option value="warehouse">Warehouse</option>
                        <option value="industrial">Industrial</option>
                        <option value="shop">Shop</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="hotel">Hotel</option>
                        <option value="mixed-use">Mixed Use</option>
                      </>
                    )}
                  </select>

                  <select
                    className="w-full md:flex-1 px-4 py-3 bg-transparent text-gray-600 text-sm focus:outline-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Select Location</option>
                    <option value="dubai-marina">Dubai Marina</option>
                    <option value="palm-jumeirah">Palm Jumeirah</option>
                    <option value="downtown-dubai">Downtown Dubai</option>
                    <option value="dubai-hills">Dubai Hills</option>
                  </select>

                  {activeTab === 'buy' && (
                    <select
                      className="w-full md:flex-1 px-4 py-3 bg-transparent text-gray-600 text-sm focus:outline-none"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                    >
                      <option value="">Bedrooms</option>
                      <option value="studio">Studio</option>
                      <option value="1">1 Bedroom</option>
                      <option value="2">2 Bedrooms</option>
                      <option value="3">3 Bedrooms</option>
                      <option value="4">4+ Bedrooms</option>
                    </select>
                  )}

                  <select
                    className="w-full md:flex-1 px-4 py-3 bg-transparent text-gray-600 text-sm focus:outline-none"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <option value="">Price Range</option>
                    <option value="0-1000000">Up to 1M</option>
                    <option value="1000000-2000000">1M - 2M</option>
                    <option value="2000000-5000000">2M - 5M</option>
                    <option value="5000000+">5M+</option>
                  </select>

                  <button
                    className="px-8 py-3 bg-[#1b2734] text-white rounded-full font-medium text-sm hover:bg-[#2c3e50] transition-colors"
                    onClick={handleSearch}
                  >
                    SEARCH PROPERTIES
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 