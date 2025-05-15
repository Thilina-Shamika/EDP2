'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OffPlanProperty {
  _id: string;
  title: string;
  description: string;
  type: string;
  propertyCategory: string;
  price: number;
  location: string;
  area: number;
  images: string[];
  features: string[];
  status: string;
  reference: string;
  zoneName: string;
  dldPermit: string;
  qrCode: string;
  pdf: string;
  createdAt: string;
  updatedAt: string;
  minPrice?: number;
  maxPrice?: number;
}

const OffPlanSlider = () => {
  const [properties, setProperties] = useState<OffPlanProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    dragFree: true
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/off-plan?showAll=true');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        // Filter by type === 'off-plan'
        const filtered = data.filter((p: OffPlanProperty) => p.type === 'off-plan');
        setProperties(filtered);
      } catch (error) {
        console.error('Failed to load properties. Please try again later.', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No off-plan properties available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="mt-16 -mx-4 sm:-mx-6 relative">
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-900" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-900" />
      </button>
      <div className="overflow-hidden px-4 sm:px-6" ref={emblaRef}>
        <div className="flex gap-4 md:gap-8">
          {properties.map((property) => (
            <div 
              className="flex-[0_0_calc(100%-2rem)] md:flex-[0_0_calc(31%-1rem)]" 
              key={property._id}
            >
              <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                {/* Image Container */}
                <div className="relative h-[240px] w-full">
                  <Image
                    src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.jpg'}
                    alt={property.title}
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
                      <span className="text-sm text-gray-500">Category:</span>
                      <span className="text-sm text-gray-900 ml-2">{property.propertyCategory}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">Price:</span>
                      <span className="text-sm text-gray-900 ml-2">
                        {typeof property.minPrice === 'number' && typeof property.maxPrice === 'number'
                          ? `AED ${property.minPrice.toLocaleString()} - ${property.maxPrice.toLocaleString()}`
                          : '-'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">Area:</span>
                      <span className="text-sm text-gray-900 ml-2">{property.area} sqft</span>
                    </div>
                  </div>
                  <Link 
                    href={`/off-plan/${property._id}`}
                    className="block w-full mt-4 px-6 py-2.5 bg-[#393e46] text-white rounded-full hover:bg-gray-800 transition-colors text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffPlanSlider; 