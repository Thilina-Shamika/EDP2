"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import FooterClientWrapper from '@/components/shared/FooterClientWrapper';
import EDPropertiesCard from '@/components/shared/EDPropertiesCard';
import MortgageCalculatorCard from '@/components/shared/MortgageCalculatorCard';
import RegisterInterestCard from '@/components/shared/RegisterInterestCard';

interface BuyProperty {
  _id: string;
  name: string;
  images: string[];
  price: string;
  location: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  reference: string;
  description: string;
  features: string[];
  amenities: string[];
  zoneName: string;
  dldPermitNumber: string;
  qrCode?: string;
  developer?: string;
  completionDate?: string;
  paymentPlan?: {
    downPayment: number;
    installment1: string;
    installment2: string;
  };
  propertyCategory: string;
  furnishing?: string;
  title: string;
}

export default function BuyPropertyClient() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [property, setProperty] = useState<BuyProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      const data = await response.json();
      setProperty(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!property) {
    return null;
  }

  return (
    <main>
      <Header transparent={false} />
      <div className="px-4 sm:px-6 lg:px-8 pt-22 pb-8 max-w-7xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="text-black cursor-pointer hover:text-black flex items-center mb-6"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Properties
        </button>
        {/* Image Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[300px] lg:h-[500px] mb-6 lg:mb-8">
          {/* Main large image - takes up 3 columns on desktop */}
          <div
            className="col-span-1 lg:col-span-3 relative rounded-xl overflow-hidden cursor-pointer h-full"
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
          >
            <Image
              src={property.images[0] || '/placeholder.jpg'}
              alt={property.name || 'Property image'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-4 left-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2 shadow-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {property.images.length} photos
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location + ', Dubai, UAE')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2 shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Map
              </a>
            </div>
          </div>
          {/* Right side vertical images - hidden on mobile */}
          <div className="hidden lg:grid grid-rows-2 gap-4 h-full">
            {property.images.slice(1, 3).map((image, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => {
                  setLightboxIndex(index + 1);
                  setLightboxOpen(true);
                }}
              >
                <Image
                  src={image || '/placeholder.jpg'}
                  alt={`${property.name || 'Property'} - Image ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7">
            {/* Property Main Info Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-6">
              {/* Property Type */}
              <div className="inline-block px-4 py-2 bg-[#EEF2FF] text-[#4F46E5] rounded-full text-[13px] font-medium mb-4">
                {property.propertyCategory}
              </div>
              {/* Price */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AED {Number(property.price).toLocaleString()}
              </h1>
              {/* Property Title */}
              <h2 className="text-[15px] text-gray-600 mb-2">
                {property.title}
              </h2>
              {/* Location Address */}
              <h2 className="text-[15px] text-gray-600 mb-2">
                {property.location}
              </h2>
              {/* Icons Row */}
              <div className="flex items-center gap-8 text-gray-500 text-base">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bed-double-icon lucide-bed-double">
                    <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/>
                    <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/>
                    <path d="M12 4v6"/>
                    <path d="M2 18h20"/>
                  </svg>
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bath-icon lucide-bath">
                    <path d="M10 4 8 6"/>
                    <path d="M17 19v2"/>
                    <path d="M2 12h20"/>
                    <path d="M7 19v2"/>
                    <path d="M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
                  </svg>
                  <span>{property.bathrooms} Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span>{property.area} sq.ft</span>
                </div>
              </div>
            </div>
            {/* Property Description Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Description</h2>
              <p className="text-gray-500 whitespace-pre-line">{property.description}</p>
            </div>
            {/* Location Section */}
            <h2 className="text-[22px] font-bold text-[#19335A] mb-3 ml-2 mt-8">Location</h2>
            <section className="w-full pt-8 rounded-2xl" style={{background: 'url(/images/burdubai.png) center/cover no-repeat'}}>
              <div className="px-0 pb-8">
                <div className="max-w-full">
                  <div className="bg-white rounded-[16px] shadow-lg px-8 py-6 mx-2 md:mx-4 lg:mx-8" style={{minHeight: '90px'}}>
                    <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                      <div className="flex items-center gap-3 md:col-span-6">
                        <svg className="w-6 h-6 text-[#19335A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <circle cx="12" cy="11" r="3" stroke="#19335A" strokeWidth="2" fill="none" />
                        </svg>
                        <span className="text-sm font-semibold text-[#19335A]">{property.location}</span>
                      </div>
                      <div className="flex justify-end md:col-span-6">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location + ', Dubai, UAE')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-8 py-3 bg-[#19335A] text-white rounded-full font-semibold text-base shadow hover:bg-[#10213a] transition-colors"
                        >
                          View on Map
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Indoor Amenities Section */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {property.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F5F7FA] text-gray-700 px-4 py-2 rounded-full text-[16px] font-medium"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Furnishing Section */}
            {property.furnishing && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Furnishing</h2>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-[#F5F7FA] text-gray-700 px-4 py-2 rounded-full text-[16px] font-medium">
                    {property.furnishing}
                  </div>
                </div>
              </div>
            )}
            {/* Regulatory Information Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Regulatory information</h2>
              <div className="flex justify-between items-start">
                <div className="space-y-6">
                  <div>
                    <div className="text-base font-semibold text-[#495565] mb-1">
                      Reference
                    </div>
                    <div className="text-gray-700">{property.reference}</div>
                  </div>
                  <div>
                    <div className="text-base font-semibold text-[#495565] mb-1">
                      Zone name
                    </div>
                    <div className="text-gray-700">{property.zoneName}</div>
                  </div>
                  <div>
                    <div className="text-base font-semibold text-[#495565] mb-1">
                      DLD Permit Number
                    </div>
                    <div className="text-gray-700">{property.dldPermitNumber}</div>
                  </div>
                </div>
                {property.qrCode && (
                  <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={property.qrCode}
                      alt="Property QR Code"
                      className="rounded-lg object-contain w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="space-y-6">
              <EDPropertiesCard />
              <MortgageCalculatorCard />
            </div>
            <div className="mt-6 lg:sticky lg:top-6">
              <RegisterInterestCard propertyType="buy" />
            </div>
          </div>
        </div>
      </div>
      {/* Image Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={property.images.map((image) => ({ src: image || '/placeholder.jpg' }))}
        index={lightboxIndex}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      <FooterClientWrapper />
    </main>
  );
} 