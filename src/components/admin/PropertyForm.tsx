'use client';

import { useState } from 'react';
import { IProperty } from '@/models/Property';

interface PropertyFormProps {
  type: 'buy' | 'commercial' | 'off-plan';
  onSubmit: (data: Partial<IProperty>) => Promise<void>;
}

const PROPERTY_TYPE_OPTIONS = [
  'Apartment',
  'Villa',
  'Townhouse',
  'Penthouse',
  'Duplex',
  'Studio',
  'Loft',
];

const FURNISHING_OPTIONS = [
  'Unfurnished',
  'Semi-Furnished',
  'Furnished',
];

const INDOOR_AMENITIES = [
  'Air Conditioning/Heating',
  'Fitness Center/Gym',
  'Sauna/Steam Room',
  'Library/Reading Room',
  'Conference Room',
  "Children's Playroom",
  'Parking Garage (Indoor)',
  'Walk-in Closets',
];

const OUTDOOR_AMENITIES = [
  'Garden or Landscaping',
  'Hot Tub/Jacuzzi',
  'Tennis Court',
  'Bike Racks',
  'Picnic Area',
];

export default function PropertyForm({ type, onSubmit }: PropertyFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrCode(e.target.files[0]);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    // Amenities
    const indoorAmenities = INDOOR_AMENITIES.filter(a => formData.get(a));
    const outdoorAmenities = OUTDOOR_AMENITIES.filter(a => formData.get(a));
    const features = [...indoorAmenities, ...outdoorAmenities];

    // Images and QR code
    if (qrCode) formData.append('qrCode', qrCode);
    images.forEach(img => formData.append('images', img));

    const data: Partial<IProperty> = {
      propertyCategory: formData.get('propertyCategory')?.toString(),
      price: Number(formData.get('price')),
      title: formData.get('propertyName')?.toString(),
      location: formData.get('location')?.toString(),
      bedrooms: formData.get('beds') ? Number(formData.get('beds')) : undefined,
      bathrooms: formData.get('baths') ? Number(formData.get('baths')) : undefined,
      area: formData.get('squareFeet') ? Number(formData.get('squareFeet')) : undefined,
      description: formData.get('description')?.toString(),
      features,
      furnishing: formData.get('furnishing')?.toString(),
      reference: formData.get('reference')?.toString(),
      zoneName: formData.get('zoneName')?.toString(),
      dldPermit: formData.get('dldPermit')?.toString(),
      type,
      status: 'available',
    };

    // Remove any undefined or empty values
    Object.keys(data).forEach(key => {
      if (data[key as keyof typeof data] === undefined || data[key as keyof typeof data] === '') {
        delete data[key as keyof typeof data];
      }
    });

    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>
      )}
      <div className="bg-white rounded-lg p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Buy Property</h1>
        {/* Basic Information */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="propertyCategory" className="block text-sm font-medium text-gray-900">Property Type <span className="text-red-500">*</span></label>
            <select id="propertyCategory" name="propertyCategory" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900">
              <option value="" disabled>Select Property Type</option>
              {PROPERTY_TYPE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-900">Price (AED) <span className="text-red-500">*</span></label>
            <input type="number" id="price" name="price" required min="0" placeholder="Enter price in AED" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="propertyName" className="block text-sm font-medium text-gray-900">Property Name <span className="text-red-500">*</span></label>
            <input type="text" id="propertyName" name="propertyName" required placeholder="Enter property name" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-900">Location <span className="text-red-500">*</span></label>
            <input type="text" id="location" name="location" required placeholder="Enter location" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="beds" className="block text-sm font-medium text-gray-900">Beds <span className="text-red-500">*</span></label>
            <input type="number" id="beds" name="beds" required min="0" placeholder="Enter number of beds" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="baths" className="block text-sm font-medium text-gray-900">Baths <span className="text-red-500">*</span></label>
            <input type="number" id="baths" name="baths" required min="0" placeholder="Enter number of baths" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-900">Square Feet <span className="text-red-500">*</span></label>
            <input type="number" id="squareFeet" name="squareFeet" required min="0" placeholder="Enter square feet" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
        </div>
        {/* Description */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-900">Property Description <span className="text-red-500">*</span></label>
          <textarea id="description" name="description" required rows={4} placeholder="Enter property description" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
        </div>
        {/* Amenities */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Amenities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Indoor Amenities</h3>
            <div className="grid grid-cols-1 gap-2">
              {INDOOR_AMENITIES.map(a => (
                <label key={a} className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" name={a} className="mr-2" /> {a}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Outdoor Amenities</h3>
            <div className="grid grid-cols-1 gap-2">
              {OUTDOOR_AMENITIES.map(a => (
                <label key={a} className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" name={a} className="mr-2" /> {a}
                </label>
              ))}
            </div>
          </div>
        </div>
        {/* Furnishing */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Furnishing</h2>
        <div className="mb-6">
          <label htmlFor="furnishing" className="block text-sm font-medium text-gray-900">Furnishing Type <span className="text-red-500">*</span></label>
          <select id="furnishing" name="furnishing" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900">
            <option value="" disabled>Select Furnishing Type</option>
            {FURNISHING_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        {/* Regulatory Information */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Regulatory Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-gray-900">Reference <span className="text-red-500">*</span></label>
            <input type="text" id="reference" name="reference" required placeholder="Enter reference number" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="zoneName" className="block text-sm font-medium text-gray-900">Zone Name <span className="text-red-500">*</span></label>
            <input type="text" id="zoneName" name="zoneName" required placeholder="Enter zone name" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="dldPermit" className="block text-sm font-medium text-gray-900">DLD Permit Number <span className="text-red-500">*</span></label>
            <input type="text" id="dldPermit" name="dldPermit" required placeholder="Enter DLD permit number" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="qrCode" className="block text-sm font-medium text-gray-900">QR Code</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer">
              <input type="file" id="qrCode" name="qrCode" accept="image/*" className="hidden" onChange={handleQrCodeChange} />
              <label htmlFor="qrCode" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <span className="text-gray-400 text-sm">Drag and drop QR code image here, or click to select</span>
                {qrCode && <span className="text-xs text-gray-600 mt-2">{qrCode.name}</span>}
              </label>
            </div>
          </div>
        </div>
        {/* Property Images */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Property Images</h2>
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer">
            <input type="file" id="images" name="images" accept="image/*" multiple className="hidden" onChange={handleImagesChange} />
            <label htmlFor="images" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <span className="text-gray-400 text-sm">Drag and drop property images here, or click to select</span>
              {images.length > 0 && (
                <span className="text-xs text-gray-600 mt-2">{images.map(img => img.name).join(', ')}</span>
              )}
            </label>
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-black text-white px-8 py-2 font-semibold text-lg shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Create Property'}
          </button>
        </div>
      </div>
    </form>
  );
} 