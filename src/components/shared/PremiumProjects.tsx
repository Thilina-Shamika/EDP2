"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Property {
  _id: string;
  name: string;
  title: string;
  images: string[];
}

const PremiumProjects = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties?type=buy&limit=4', {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* First Row - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Left Column */}
          <div className="rounded-lg h-full flex flex-col justify-end">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Our Premium Projects
              </h3>
              <h2 className="text-5xl font-bold text-gray-900 mt-3">
                Properties in Premium Locations
              </h2>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="rounded-lg h-full flex flex-col justify-end">
            <div>
              <p className="text-gray-600 text-sm leading-relaxed">
                You&apos;ll find our carefully chosen properties in the best locations across the UAE. Each home offers something special - from stunning designs to beautiful living spaces.
              </p>
              
              <Link href="/buy">
                <button className="mt-6 px-6 py-3 border border-gray-900 rounded-full text-gray-900 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors">
                  See All Premium Projects
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Large Project */}
          {properties[0] && (
            <Link href={`/buy/${properties[0]._id}`} className="relative h-[400px] rounded-lg overflow-hidden group">
              <Image
                src={properties[0].images[0] || '/placeholder.jpg'}
                alt={properties[0].title || properties[0].name || 'Premium Property Image'}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-[5px] left-[5px] right-[5px] bg-black/40 backdrop-blur-md px-4 py-3 rounded-lg">
                <h3 className="text-[14px] font-bold text-white">{properties[0].title || properties[0].name}</h3>
              </div>
            </Link>
          )}

          {/* Right Column - Stacked Projects */}
          <div className="flex flex-col gap-4 h-[400px]">
            {/* Top Project */}
            {properties[1] && (
              <Link href={`/buy/${properties[1]._id}`} className="relative h-[192px] rounded-lg overflow-hidden group">
                <Image
                  src={properties[1].images[0] || '/placeholder.jpg'}
                  alt={properties[1].title || properties[1].name || 'Premium Property Image'}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-[5px] left-[5px] right-[5px] bg-black/40 backdrop-blur-md px-4 py-3 rounded-lg">
                  <h3 className="text-[14px] font-bold text-white">{properties[1].title || properties[1].name}</h3>
                </div>
              </Link>
            )}

            {/* Bottom Row - Two Projects */}
            <div className="grid grid-cols-2 gap-4 h-[192px]">
              {/* Bottom Left Project */}
              {properties[2] && (
                <Link href={`/buy/${properties[2]._id}`} className="relative rounded-lg overflow-hidden group">
                  <Image
                    src={properties[2].images[0] || '/placeholder.jpg'}
                    alt={properties[2].title || properties[2].name || 'Premium Property Image'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-[5px] left-[5px] right-[5px] bg-black/40 backdrop-blur-md px-4 py-3 rounded-lg">
                    <h3 className="text-[14px] font-bold text-white">{properties[2].title || properties[2].name}</h3>
                  </div>
                </Link>
              )}

              {/* Bottom Right Project */}
              {properties[3] && (
                <Link href={`/buy/${properties[3]._id}`} className="relative rounded-lg overflow-hidden group">
                  <Image
                    src={properties[3].images[0] || '/placeholder.jpg'}
                    alt={properties[3].title || properties[3].name || 'Premium Property Image'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-[5px] left-[5px] right-[5px] bg-black/40 backdrop-blur-md px-4 py-3 rounded-lg">
                    <h3 className="text-[14px] font-bold text-white">{properties[3].title || properties[3].name}</h3>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumProjects; 