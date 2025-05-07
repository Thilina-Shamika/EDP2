"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from 'next/image';

const PROPERTY_TYPE_OPTIONS = [
  'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex', 'Studio', 'Loft',
];
const FURNISHING_OPTIONS = [
  'Unfurnished', 'Semi-Furnished', 'Furnished',
];
const INDOOR_AMENITIES = [
  'Air Conditioning/Heating', 'Fitness Center/Gym', 'Sauna/Steam Room', 'Library/Reading Room',
  'Conference Room', "Children's Playroom", 'Parking Garage (Indoor)', 'Walk-in Closets',
];
const OUTDOOR_AMENITIES = [
  'Garden or Landscaping', 'Hot Tub/Jacuzzi', 'Tennis Court', 'Bike Racks', 'Picnic Area',
];

export default function AddBuyProperty() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [qrCode, setQrCode] = useState<File | null>(null);

  // Image handlers
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImages(Array.from(files));
    }
  };
  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };
  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrCode(e.target.files[0]);
    }
  };
  const handleRemoveQrCode = () => setQrCode(null);

  // Cloudinary upload helper
  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'edprop_unsigned');
      formData.append('cloud_name', 'djoe6vb5c');
      const res = await fetch('https://api.cloudinary.com/v1_1/djoe6vb5c/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) urls.push(data.secure_url);
    }
    return urls;
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    // Gather amenities
    const indoorAmenities = INDOOR_AMENITIES.filter(a => formData.get(a));
    const outdoorAmenities = OUTDOOR_AMENITIES.filter(a => formData.get(a));
    // Gather fields
    const title = (formData.get('propertyName') || '').toString().trim();
    const area = Number(formData.get('squareFeet'));
    const price = Number(formData.get('price'));
    const bedrooms = Number(formData.get('beds'));
    const bathrooms = Number(formData.get('baths'));
    const location = (formData.get('location') || '').toString().trim();
    const description = (formData.get('description') || '').toString().trim();
    const propertyCategory = formData.get('propertyCategory')?.toString().trim();
    const furnishing = formData.get('furnishing')?.toString().trim();
    const reference = formData.get('reference')?.toString().trim();
    const zoneName = formData.get('zoneName')?.toString().trim();
    const dldPermit = formData.get('dldPermit')?.toString().trim();
    // Validation
    if (!title || !area || !price || !bedrooms || !bathrooms || !location || !description) {
      setError('All required fields must be filled.'); setLoading(false); return;
    }
    if (!propertyCategory) { setError('Property Category is required.'); setLoading(false); return; }
    if (!furnishing) { setError('Furnishing Type is required.'); setLoading(false); return; }
    if (!reference) { setError('Reference Number is required.'); setLoading(false); return; }
    if (!zoneName) { setError('Zone Name is required.'); setLoading(false); return; }
    if (!dldPermit) { setError('DLD Permit Number is required.'); setLoading(false); return; }
    // Upload images
    let imageUrls: string[] = [];
    try { imageUrls = await uploadImagesToCloudinary(images); }
    catch { setError('Image upload failed. Please try again.'); setLoading(false); return; }
    // Upload QR code
    let qrCodeUrl: string | undefined = undefined;
    if (qrCode) {
      try {
        const qrUrls = await uploadImagesToCloudinary([qrCode]);
        if (qrUrls.length > 0) qrCodeUrl = qrUrls[0];
      } catch { setError('QR Code upload failed. Please try again.'); setLoading(false); return; }
    }
    // Build data
    const data = {
      title,
      description,
      type: 'buy',
      propertyCategory,
      price,
      location,
      bedrooms,
      bathrooms,
      area,
      status: 'available',
      images: imageUrls,
      features: [...indoorAmenities, ...outdoorAmenities],
      furnishing,
      reference,
      zoneName,
      dldPermit,
      ...(qrCodeUrl ? { qrCode: qrCodeUrl } : {}),
    };
    // Debug log
    console.log('DATA TO SEND:', data);

    // POST
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create property');
      }
      router.push('/admin/manage-buy');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-8">
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
      <div className="bg-white rounded-lg p-8 shadow">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#495565' }}>Add Buy Property</h1>
        {/* Basic Information */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="propertyCategory" className="block text-sm font-medium text-gray-900">Property Type <span className="text-red-500">*</span></label>
            <select id="propertyCategory" name="propertyCategory" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" defaultValue="">
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
          <select id="furnishing" name="furnishing" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" defaultValue="">
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
              </label>
            </div>
            {/* QR Code Preview */}
            {qrCode && (
              <div className="relative w-24 h-24 mt-4 border rounded overflow-hidden group">
                <Image
                  src={URL.createObjectURL(qrCode)}
                  alt={qrCode.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={handleRemoveQrCode}
                  className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:bg-red-500 hover:text-white transition-colors shadow group-hover:visible"
                  title="Remove QR code"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Property Images */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Property Images</h2>
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer">
            <input type="file" id="images" name="images" accept="image/*" multiple className="hidden" onChange={handleImagesChange} />
            <label htmlFor="images" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <span className="text-gray-400 text-sm">Drag and drop property images here, or click to select</span>
            </label>
          </div>
          {/* New Image Previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden group">
                  <Image
                    src={URL.createObjectURL(img)}
                    alt={img.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:bg-red-500 hover:text-white transition-colors shadow group-hover:visible"
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
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