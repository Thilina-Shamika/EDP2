'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import EDPropertiesCard from '@/components/shared/EDPropertiesCard';
import RegisterInterestCard from '@/components/shared/RegisterInterestCard';
import Footer from '@/components/shared/Footer';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface OffPlanProperty {
  title: string;
  images: string[];
  location: string;
  minPrice: number;
  maxPrice: number;
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
  installment1?: string;
  installment2?: string;
  handoverDate?: string;
  masterDeveloper?: string;
  beds?: string;
}

export default function OffPlanPropertyClient() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [property, setProperty] = useState<OffPlanProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    async function fetchProperty() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) throw new Error('Failed to fetch property');
        const data = await response.json();
        setProperty(data);
        console.log('Fetched property:', data);
      } catch {
        // Remove unused variables like 'err'.
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchProperty();
  }, [id]);

  // Modal form handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.email || !form.phone) {
      setFormError('Please fill all fields.');
      return;
    }
    setFormLoading(true);
    try {
      const res = await fetch('/api/brochure-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          propertyTitle: property?.title || '',
        }),
      });
      if (!res.ok) throw new Error('Failed to submit request');
      // Open PDF in new tab
      if (property?.pdf) window.open(property.pdf, '_blank');
      setShowModal(false);
      setForm({ name: '', email: '', phone: '' });
    } catch {
      setFormError('Submission failed. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center text-red-500">Property not found</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header transparent={false} />
      {/* Modal Popup for Download Brochure */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div ref={modalRef} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-center mb-2">Download Brochure</h2>
            <p className="text-center text-gray-600 mb-6">To download the brochure, please submit your WhatsApp number or Email address.</p>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="WhatsApp Number"
                value={form.phone}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-full flex items-center justify-center gap-2 text-lg font-semibold hover:bg-blue-800 transition-colors"
                disabled={formLoading}
              >
                {formLoading ? 'Submitting...' : 'Download Brochure'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Modal Popup for Register Your Interest */}
      {showInterestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowInterestModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <RegisterInterestCard propertyType="off-plan" />
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 pt-24 max-w-[1200px]">
        {/* Back Button */}
        <button
          onClick={() => window.location.href = '/off-plan'}
          className="text-black cursor-pointer hover:text-black flex items-center mb-4"
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
      </div>

      {/* Full width section with gray background */}
      <div className="w-full bg-[#393e46] py-0">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Texts */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-2">Off Plan</span>
              <h1 className="text-4xl font-bold text-white">{property.title}</h1>
              <div className="flex items-center text-gray-800 mb-4">
                <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white">{property.location || 'Location not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-colors text-center font-medium" onClick={() => setShowInterestModal(true)}>
                  Register your interest
                </button>
                <button
                  className="px-6 py-3 bg-white text-black border-2 border-black rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 font-medium"
                  onClick={() => setShowModal(true)}
                  disabled={!property.pdf}
                >
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 max-w-[1200px]">
        {/* New empty 2-column section below gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Left column: 7/12 */}
          <div className="lg:col-span-7 space-y-8">
            {/* Key Information Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6">Key information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 mb-1">Price Range</p>
                  <p className="text-xl font-semibold">
                    {property.minPrice && property.maxPrice 
                      ? `AED ${property.minPrice.toLocaleString()} - ${property.maxPrice.toLocaleString()}`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Installment 1</p>
                  <p className="text-xl font-semibold">{property.installment1 ? `${property.installment1}%` : '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Installment 2</p>
                  <p className="text-xl font-semibold">{property.installment2 ? `${property.installment2}%` : '-'}</p>
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
                <div className="text-[15px] font-medium">{property.masterDeveloper || '-'}</div>
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
                  <div className="text-sm font-bold text-gray-900 mb-2">Installment 1</div>
                  <div className="text-3xl font-extrabold text-black mb-2">{property.installment1 ? `${property.installment1}%` : '-'}</div>
                  <div className="text-sm text-gray-600">During Construction</div>
                </div>
                {/* Installment 2 */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-start">
                  <div className="text-sm font-bold text-gray-900 mb-2">Installment 2</div>
                  <div className="text-3xl font-extrabold text-black mb-2">{property.installment2 ? `${property.installment2}%` : '-'}</div>
                  <div className="text-sm text-gray-600">During Hand Over</div>
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
                  <div className="w-40 h-40 relative">
                    <Image
                      src={property.qrCode}
                      alt="Property QR Code"
                      fill
                      className="object-contain"
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
      {/* Lightbox for gallery */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={property.images?.map((src) => ({ src: src || '/placeholder.jpg' })) || []}
        index={photoIndex}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </main>
  );
} 