'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import EDPropertiesCard from '@/components/shared/EDPropertiesCard';
import MortgageCalculatorCard from '@/components/shared/MortgageCalculatorCard';
import RegisterInterestCard from '@/components/shared/RegisterInterestCard';
import Footer from '@/components/shared/Footer';

interface OffPlanProperty {
  title: string;
  images: string[];
  location: string;
  price: number;
  propertyCategory: string;
  area: number;
  reference: string;
  zoneName: string;
  dldPermit: string;
  status: string;
  description?: string;
  features?: string[];
  pdf?: string;
  qrCode?: string;
  // The following fields may not exist in DB, but keep for UI compatibility
  developer?: string;
  handoverDate?: string;
  beds?: string;
  paymentPlan?: {
    installment1?: string;
    installment2?: string;
  };
}

export default function OffPlanPropertyClient() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [property, setProperty] = useState<OffPlanProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    async function fetchProperty() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) throw new Error('Failed to fetch property');
        setProperty(await response.json());
      } catch (err) {
        setError('Failed to load property. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchProperty();
  }, [id]);

  const getAllImages = () => property?.images?.map((src) => ({ src: src || '/placeholder.jpg' })) || [];

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center text-red-500">{error || 'Property not found'}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header transparent={false} />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-[1200px]">
        {/* Back Button */}
        <button
          onClick={() => window.location.href = '/off-plan'}
          className="text-black cursor-pointer hover:text-black flex items-center mb-8"
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
          Back to Off-Plan Properties
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Texts */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-2">Off Plan</span>
            <h1 className="text-4xl font-bold text-black">{property.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{property.location || 'Location not specified'}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-center font-medium">
                Register your interest
              </button>
              <button className="px-6 py-3 bg-white text-black border-2 border-black rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Brochure
              </button>
            </div>
          </div>
          {/* Right: Gallery */}
          <div className="lg:col-span-6">
            <div
              className="relative h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => { setPhotoIndex(0); setIsOpen(true); }}
            >
              <Image
                src={property.images?.[0] || '/placeholder.jpg'}
                alt={property.title || 'Off Plan Property'}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-4 left-4">
                <button
                  className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2"
                  onClick={e => { e.stopPropagation(); setPhotoIndex(0); setIsOpen(true); }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {property.images?.length || 0} photos
                </button>
              </div>
            </div>
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
          </div>
        </div>
        {/* New empty 2-column section below gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Left column: 7/12 */}
          <div className="lg:col-span-7 space-y-8">
            {/* Key Information Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6">Key information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 mb-1">Price</p>
                  <p className="text-xl font-semibold">AED {property.price || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Installment 1</p>
                  <p className="text-xl font-semibold">{property.paymentPlan?.installment1 || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Installment 2</p>
                  <p className="text-xl font-semibold">{property.paymentPlan?.installment2 || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Handover Date</p>
                  <p className="text-xl font-semibold">{property.handoverDate || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Property Type</p>
                  <p className="text-xl font-semibold">{property.propertyCategory || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Square Feet</p>
                  <p className="text-xl font-semibold">{property.area || '-'}</p>
                </div>
              </div>
            </div>
            {/* Master Developer & Project Name Section */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-[20px] p-6 border border-gray-100">
                <div className="text-[15px] text-gray-500 mb-2">Master Developer</div>
                <div className="text-[15px] font-medium">{property.developer || '-'}</div>
              </div>
              <div className="bg-white rounded-[20px] p-6 border border-gray-100">
                <div className="text-[15px] text-gray-500 mb-2">Project Name</div>
                <div className="text-[15px] font-medium">{property.title || '-'}</div>
              </div>
            </div>
            {/* About this Project Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6">About this Project</h2>
              <div className="text-gray-600">
                <p>{property.description || '-'}</p>
              </div>
            </div>
            {/* Payment Plan Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6">Payment Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Installment 1 */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-start">
                  <div className="bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-900 font-medium">1</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">INSTALLMENT_1</div>
                  <div className="text-[40px] font-semibold mb-2">50</div>
                  <div className="text-gray-500">During Construction</div>
                </div>
                {/* Installment 2 */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-start">
                  <div className="bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-900 font-medium">2</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">Installment 2</div>
                  <div className="text-[40px] font-semibold mb-2">50</div>
                  <div className="text-gray-500">On Handover</div>
                </div>
              </div>
            </div>
            {/* Location Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6">Location</h2>
              <div className="flex items-start gap-2 mb-6">
                <svg className="w-5 h-5 mt-1 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div className="text-gray-900 font-medium">{property.location}</div>
                  <div className="text-gray-600">Dubai - United Arab Emirates</div>
                </div>
              </div>
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                <div className="text-gray-400">Map will be configured soon</div>
              </div>
            </div>
            {/* Regulatory Information Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6">Regulatory information</h2>
              <div className="flex justify-between items-center gap-8">
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-gray-600 mb-1">Reference</div>
                      <div className="text-gray-900 font-medium">{property.reference || '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">DLD Permit Number</div>
                      <div className="text-gray-900 font-medium">{property.dldPermit || '-'}</div>
                    </div>
                  </div>
                </div>
                {property.qrCode && (
                  <div className="w-40 h-40">
                    <img
                      src={property.qrCode}
                      alt="Property QR Code"
                      className="object-contain w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Right column: 5/12 (empty for now) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24 h-fit">
            <EDPropertiesCard />
            
            <RegisterInterestCard propertyType="off-plan" />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
} 