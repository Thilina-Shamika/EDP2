"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import FooterClientWrapper from '@/components/shared/FooterClientWrapper';

interface CommercialProperty {
  _id: string;
  name: string;
  images: string[];
  price: string;
  location: string;
  propertyType: string;
  area: string;
  description: string;
  reference: string;
  propertyCategory: string;
}

const PROPERTY_TYPE_OPTIONS = [
  'Retail', 'Warehouse', 'Industrial', 'Shop', 'Office', 'Restaurant', 'Hotel', 'Mixed Use', 'Others'
];

export default function CommercialPageContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<CommercialProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all',
    location: searchParams.get('location') || 'all',
    minPrice: searchParams.get('minPrice') || 'all',
    maxPrice: searchParams.get('maxPrice') || 'all'
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties?type=commercial', {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const filteredProperties = properties.filter((property) => {
    // Filter by property category/type
    if (
      filters.type !== 'all' &&
      property.propertyCategory?.toLowerCase() !== filters.type.toLowerCase()
    ) {
      return false;
    }
    // Filter by location
    if (
      filters.location !== 'all' &&
      property.location.toLowerCase() !== filters.location.toLowerCase()
    ) {
      return false;
    }
    // Filter by price range
    if (filters.minPrice !== 'all' || filters.maxPrice !== 'all') {
      const price = parseInt(property.price.replace(/[^0-9]/g, ''));
      const minPrice = filters.minPrice === 'all' ? 0 : parseInt(filters.minPrice);
      const maxPrice = filters.maxPrice === 'all' ? Infinity : parseInt(filters.maxPrice);
      if (price < minPrice || price > maxPrice) {
        return false;
      }
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-white">
      <Header transparent={false} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Commercial Properties
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our selection of commercial properties in Dubai&apos;s most prestigious locations
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Property Types</option>
                {PROPERTY_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="dubai marina">Dubai Marina</option>
                <option value="business bay">Business Bay</option>
                <option value="downtown dubai">Downtown Dubai</option>
                <option value="jumeirah lake towers">Jumeirah Lake Towers</option>
              </select>

              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              >
                <option value="all">Min Price</option>
                <option value="500000">500,000 AED</option>
                <option value="750000">750,000 AED</option>
                <option value="1000000">1M AED</option>
                <option value="2000000">2M AED</option>
                <option value="3000000">3M AED</option>
                <option value="4000000">4M AED</option>
                <option value="5000000">5M AED</option>
                <option value="6000000">6M AED</option>
                <option value="7000000">7M AED</option>
                <option value="8000000">8M AED</option>
                <option value="9000000">9M AED</option>
                <option value="10000000">10M AED</option>
                <option value="25000000">25M AED</option>
                <option value="30000000">30M AED</option>
                <option value="40000000">40M AED</option>
                <option value="50000000">50M AED</option>
                <option value="60000000">60M AED</option>
                <option value="70000000">70M AED</option>
                <option value="80000000">80M AED</option>
              </select>

              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              >
                <option value="all">Max Price</option>
                <option value="500000">500,000 AED</option>
                <option value="750000">750,000 AED</option>
                <option value="1000000">1M AED</option>
                <option value="2000000">2M AED</option>
                <option value="3000000">3M AED</option>
                <option value="4000000">4M AED</option>
                <option value="5000000">5M AED</option>
                <option value="6000000">6M AED</option>
                <option value="7000000">7M AED</option>
                <option value="8000000">8M AED</option>
                <option value="9000000">9M AED</option>
                <option value="10000000">10M AED</option>
                <option value="25000000">25M AED</option>
                <option value="30000000">30M AED</option>
                <option value="40000000">40M AED</option>
                <option value="50000000">50M AED</option>
                <option value="60000000">60M AED</option>
                <option value="70000000">70M AED</option>
                <option value="80000000">80M AED</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No properties match your selected filters
              </p>
              <button
                onClick={() =>
                  setFilters({
                    type: 'all',
                    location: 'all',
                    minPrice: 'all',
                    maxPrice: 'all',
                  })
                }
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <Link
                  key={property._id}
                  href={`/commercial/${property._id}`}
                  className="group"
                >
                  <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    {/* Image Container */}
                    <div className="relative h-[240px] w-full">
                      <Image
                        src={property.images[0] || '/placeholder.jpg'}
                        alt={property.name || 'Commercial Property Image'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority={false}
                      />
                    </div>

                    {/* Content Container */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {property.name}
                      </h3>
                      <p className="text-sm text-gray-600">{property.location}</p>

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Price:</span>
                          <span className="text-sm text-gray-900 ml-2">
                            AED {Number(property.price).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Area:</span>
                          <span className="text-sm text-gray-900 ml-2">
                            {property.area} sqft
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Type:</span>
                          <span className="text-sm text-gray-900 ml-2">
                            {property.propertyCategory}
                          </span>
                        </div>
                      </div>

                      <button className="w-full mt-4 px-6 py-2.5 bg-[#393e46] text-white rounded-full hover:bg-gray-800 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <FooterClientWrapper />
    </main>
  );
} 