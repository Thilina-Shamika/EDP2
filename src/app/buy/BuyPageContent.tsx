"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import FooterClientWrapper from '@/components/shared/FooterClientWrapper';

interface BuyProperty {
  _id: string;
  title: string;
  images: string[];
  price: number;
  location: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  reference: string;
  propertyCategory: string;
}

const PROPERTY_TYPE_OPTIONS = [
  'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex', 'Studio', 'Loft', 'Others'
];

export default function BuyPageContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<BuyProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all',
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || 'all',
    maxPrice: searchParams.get('maxPrice') || 'all',
    beds: searchParams.get('beds') || 'all',
  });

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties?type=buy', {
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
    // Filter by location search
    if (
      filters.location &&
      !property.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }
    // Filter by price range
    if (filters.minPrice !== 'all' || filters.maxPrice !== 'all') {
      const price = property.price;
      const minPrice = filters.minPrice === 'all' ? 0 : parseInt(filters.minPrice);
      const maxPrice = filters.maxPrice === 'all' ? Infinity : parseInt(filters.maxPrice);
      if (price < minPrice || price > maxPrice) {
        return false;
      }
    }
    // Filter by beds
    if (filters.beds !== 'all') {
      const beds = property.bedrooms ? property.bedrooms.toString() : '';
      switch (filters.beds) {
        case '1':
          return beds === '1';
        case '2':
          return beds === '2';
        case '3':
          return beds === '3';
        case '4':
          return beds === '4';
        case '5+':
          return parseInt(beds) >= 5;
        default:
          return true;
      }
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-white">
      <Header transparent={false} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 ">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Properties for Sale
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our exclusive collection of properties available for
              purchase in prime locations.
            </p>
          </div>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

              <input
                type="text"
                placeholder="Search by location..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />

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

              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.beds}
                onChange={(e) => handleFilterChange('beds', e.target.value)}
              >
                <option value="all">All Beds</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4 Beds</option>
                <option value="5+">5+ Beds</option>
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
                    location: '',
                    minPrice: 'all',
                    maxPrice: 'all',
                    beds: 'all',
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
                  href={`/buy/${property._id}`}
                  className="group"
                >
                  <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    {/* Image Container */}
                    <div className="relative h-[200px] w-full">
                      <Image
                        src={property.images[0] || '/placeholder.jpg'}
                        alt={property.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority={false}
                      />
                    </div>
                    {/* Content Container */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>{property.bedrooms} Beds</span>
                        <span>{property.bathrooms} Baths</span>
                        <span>{property.area} sq.ft</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {property.location}
                      </p>
                      <div className="mb-4">
                        <p className="text-xl font-bold text-gray-900">
                          AED {Number(property.price).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Type: {property.propertyCategory}
                        </p>
                      </div>
                      <button className="w-full bg-[#393e46] text-white py-3 px-4 rounded-full hover:bg-gray-800 transition-colors">
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