'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/shared/Header';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import EDPropertiesCard from '@/components/shared/EDPropertiesCard';
import MortgageCalculatorCard from '@/components/shared/MortgageCalculatorCard';
import RegisterInterestCard from '@/components/shared/RegisterInterestCard';
import FooterClientWrapper from '@/components/shared/FooterClientWrapper';

interface CommercialProperty {
  _id: string;
  name: string;
  images: string[];
  price: string;
  location: string;
  propertyCategory: string;
  area: string;
  description: string;
  reference: string;
  title: string;
  zoneName: string;
  dldPermitNumber: string;
  qrCode: string;
}

export default function CommercialPropertyPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [property, setProperty] = useState<CommercialProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchProperty();
    // eslint-disable-next-line
  }, [id]);

  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      const data = await response.json();
      setProperty(data);
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (index: number = 0) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const getAllImages = () => {
    if (!property) return [];
    return property.images.map(src => ({ src: src || '/placeholder.jpg' }));
  };

  if (isLoading) {
    return (
      <main>
        <Header transparent={false} />
        <div>Loading...</div>
      </main>
    );
  }

  if (!property) {
    return (
      <main>
        <Header transparent={false} />
        <div>Property not found</div>
      </main>
    );
  }

  return (
    <main>
      <Header transparent={false} />
      <div className="pt-22 pb-8 max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <Link 
            href="/commercial"
            className="text-black hover:text-black flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Commercial Properties
          </Link>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[300px] lg:h-[500px]">
          {/* Main large image - takes up 3 columns */}
          <div 
            className="col-span-1 lg:col-span-3 relative rounded-xl overflow-hidden cursor-pointer h-full"
            onClick={() => handleImageClick(0)}
          >
            <Image
              src={property.images[0] || '/placeholder.jpg'}
              alt={property.name || 'Commercial Property Image'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button 
                className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(0);
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {property.images.length} photos
              </button>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location + ', Dubai, UAE')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Map
              </a>
            </div>
          </div>

          {/* Right column with 2 smaller images */}
          <div className="col-span-1 flex flex-col gap-4 h-full">
            {property.images.slice(1, 3).map((image, index) => (
              <div 
                key={index}
                className="relative h-[calc(50%-8px)] rounded-xl overflow-hidden cursor-pointer"
                onClick={() => handleImageClick(index + 1)}
              >
                <Image
                  src={image || '/placeholder.jpg'}
                  alt={`${property.name || 'Commercial Property'} - Image ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={getAllImages()}
        index={photoIndex}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />

      {/* Property Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - 7/12 */}
          <div className="lg:col-span-7">
            {/* Property Type Label */}
            {/* Price and Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="inline-block bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm font-medium mb-4">
                {property.propertyCategory}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AED {property.price}
              </h1>
              <h2 className="text-[15px] text-gray-600 mb-2">
                {property.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {property.location} | {property.reference}
              </p>

              <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="text-[15px] text-gray-600">{property.area} sq.ft</span>
                </div>
              </div>
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
            {/* Regulatory Information Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
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

          {/* Right Column - 5/12 */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              <EDPropertiesCard />
              <MortgageCalculatorCard />
            </div>
            <div className="mt-6 lg:sticky lg:top-6">
              <RegisterInterestCard propertyType="commercial" />
            </div>
          </div>
        </div>
      </div>
      <FooterClientWrapper />
    </main>
  );
} 