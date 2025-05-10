'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/shared/Header';

interface OffPlanProperty {
  _id: string;
  title: string;
  images: string[];
  handoverDate?: string;
  minPrice?: number;
  maxPrice?: number;
  location: string;
  developer: string;
  propertyCategory: string;
  description: string;
}

const PROPERTY_TYPE_OPTIONS = [
  'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex', 'Studio', 'Loft', 'Plot', 'Other'
];

export default function OffPlanPage() {
  const [properties, setProperties] = useState<OffPlanProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    location: 'all',
    minPrice: 'all',
    maxPrice: 'all'
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/properties?type=off-plan', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredProperties = properties.filter(property => {
    // Filter by property type
    if (filters.type !== 'all' && property.propertyCategory?.toLowerCase() !== filters.type.toLowerCase()) {
      return false;
    }
    // Filter by location
    if (filters.location !== 'all' && property.location.toLowerCase() !== filters.location.toLowerCase()) {
      return false;
    }
    // Filter by price range
    if (filters.minPrice !== 'all' || filters.maxPrice !== 'all') {
      const minPrice = filters.minPrice === 'all' ? 0 : parseInt(filters.minPrice);
      const maxPrice = filters.maxPrice === 'all' ? Infinity : parseInt(filters.maxPrice);
      const propertyMin = typeof property.minPrice === 'number' ? property.minPrice : 0;
      const propertyMax = typeof property.maxPrice === 'number' ? property.maxPrice : Infinity;
      if (propertyMin < minPrice || propertyMax > maxPrice) {
        return false;
      }
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Header transparent={false} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Off-Plan Properties</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our exclusive selection of upcoming developments in Dubai&apos;s most prestigious locations
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
                  <option key={type} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>

              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="dubai marina">Dubai Marina</option>
                <option value="palm jumeirah">Palm Jumeirah</option>
                <option value="downtown dubai">Downtown Dubai</option>
                <option value="dubai hills">Dubai Hills</option>
              </select>

              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              >
                <option value="all">Min Price</option>
                <option value="0">0 AED</option>
                <option value="1000000">1M AED</option>
                <option value="2000000">2M AED</option>
                <option value="3000000">3M AED</option>
                <option value="4000000">4M AED</option>
                <option value="5000000">5M AED</option>
              </select>

              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              >
                <option value="all">Max Price</option>
                <option value="1000000">1M AED</option>
                <option value="2000000">2M AED</option>
                <option value="3000000">3M AED</option>
                <option value="4000000">4M AED</option>
                <option value="5000000">5M AED</option>
                <option value="10000000">10M AED</option>
                <option value="20000000">20M AED</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No properties match your selected filters</p>
              <button 
                onClick={() => setFilters({ type: 'all', location: 'all', minPrice: 'all', maxPrice: 'all' })}
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
                  href={`/off-plan/${property._id}`}
                  className="group"
                >
                  <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    {/* Image Container */}
                    <div className="relative h-[240px] w-full">
                      <Image
                        src={property.images?.[0] || '/placeholder.jpg'}
                        alt={property.title || 'Off Plan Property'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority={false}
                      />
                    </div>

                    {/* Content Container */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-lg text-gray-900">{property.title}</h3>
                      <p className="text-sm text-gray-600">{property.location}</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Developer:</span>
                          <span className="text-sm text-gray-900 ml-2">{property.developer}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Price Range:</span>
                          <span className="text-sm text-gray-900 ml-2">
                            {typeof property.minPrice === 'number' && typeof property.maxPrice === 'number'
                              ? `${property.minPrice.toLocaleString('en-US', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 })} - ${property.maxPrice.toLocaleString('en-US', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 })}`
                              : '-'}
                          </span>
                        </div>
                        {property.handoverDate && (
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500">Handover:</span>
                            <span className="text-sm text-gray-900 ml-2">{property.handoverDate}</span>
                          </div>
                        )}
                      </div>
                      <button className="w-full mt-4 px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
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
    </main>
  );
} 