"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';

const PROPERTY_TYPE_OPTIONS = [
  'Retail', 'Warehouse', 'Industrial', 'Shop', 'Office', 'Restaurant', 'Hotel', 'Mixed Use',
];

interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  propertyCategory?: string;
  price: number;
  location: string;
  area: number;
  images: string[];
  features: string[];
  status: string;
  reference?: string;
  zoneName?: string;
  dldPermit?: string;
  qrCode?: string;
}

export default function EditCommercialProperty() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [qrCode, setQrCode] = useState<File | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error('Failed to fetch property');
        const data = await res.json();
        setProperty(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrCode(e.target.files[0]);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    // Gather fields
    const propertyCategory = formData.get('propertyCategory')?.toString().trim();
    const price = Number(formData.get('price'));
    const area = Number(formData.get('squareFeet'));
    const title = (formData.get('propertyName') || '').toString().trim();
    const location = (formData.get('location') || '').toString().trim();
    const description = (formData.get('description') || '').toString().trim();
    const reference = formData.get('reference')?.toString().trim();
    const zoneName = formData.get('zoneName')?.toString().trim();
    const dldPermit = formData.get('dldPermit')?.toString().trim();

    // Validation
    if (!propertyCategory) { setError('Property Type is required.'); setLoading(false); return; }
    if (!price || isNaN(price)) { setError('Price is required.'); setLoading(false); return; }
    if (!area || isNaN(area)) { setError('Square Feet is required.'); setLoading(false); return; }
    if (!title) { setError('Property Name is required.'); setLoading(false); return; }
    if (!location) { setError('Location is required.'); setLoading(false); return; }
    if (!description) { setError('Description is required.'); setLoading(false); return; }
    if (!reference) { setError('Reference Number is required.'); setLoading(false); return; }
    if (!zoneName) { setError('Zone Name is required.'); setLoading(false); return; }
    if (!dldPermit) { setError('DLD Permit Number is required.'); setLoading(false); return; }

    // Upload new images
    let imageUrls: string[] = [];
    try {
      imageUrls = await uploadImagesToCloudinary(images);
    } catch {
      setError('Image upload failed. Please try again.');
      setLoading(false);
      return;
    }

    // Merge with existing images
    const allImages = [...(property?.images || []), ...imageUrls];

    // Build data
    const data: Property = {
      _id: property?._id || '',
      title,
      description,
      type: 'commercial',
      propertyCategory,
      price,
      location,
      area,
      status: 'available',
      images: allImages,
      reference,
      zoneName,
      dldPermit,
      qrCode: property?.qrCode,
      features: property?.features || [],
    };

    // Handle QR code upload if a new one is selected
    if (qrCode) {
      try {
        const qrCodeUrls = await uploadImagesToCloudinary([qrCode]);
        if (qrCodeUrls.length > 0) {
          data.qrCode = qrCodeUrls[0];
        }
      } catch {
        setError('QR Code upload failed. Please try again.');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update property');
      }
      router.push('/admin/manage-commercial');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!property) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-8">
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
      <div className="bg-white rounded-lg p-8 shadow">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#495565' }}>Edit Commercial Property</h1>
        {/* Basic Information */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="propertyCategory" className="block text-sm font-medium text-gray-900">Property Type <span className="text-red-500">*</span></label>
            <select id="propertyCategory" name="propertyCategory" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" defaultValue={property.propertyCategory || ''}>
              <option value="" disabled>Select Property Type</option>
              {PROPERTY_TYPE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-900">Price (AED) <span className="text-red-500">*</span></label>
            <input type="number" id="price" name="price" required min="0" placeholder="Enter price in AED" defaultValue={property.price} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-900">Square Feet <span className="text-red-500">*</span></label>
            <input type="number" id="squareFeet" name="squareFeet" required min="0" placeholder="Enter square feet" defaultValue={property.area} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="propertyName" className="block text-sm font-medium text-gray-900">Property Name <span className="text-red-500">*</span></label>
            <input type="text" id="propertyName" name="propertyName" required placeholder="Enter property name" defaultValue={property.title} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-900">Location <span className="text-red-500">*</span></label>
            <input type="text" id="location" name="location" required placeholder="Enter location" defaultValue={property.location} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
        </div>
        {/* About Property */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">About Property</h2>
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-900">Property Description <span className="text-red-500">*</span></label>
          <textarea id="description" name="description" required rows={4} placeholder="Enter property description" defaultValue={property.description} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
        </div>
        {/* Regulatory Information */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Regulatory Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-gray-900">Reference Number</label>
            <input type="text" id="reference" name="reference" required placeholder="Enter reference number" defaultValue={property.reference} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="zoneName" className="block text-sm font-medium text-gray-900">Zone Name</label>
            <input type="text" id="zoneName" name="zoneName" required placeholder="Enter zone name" defaultValue={property.zoneName} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="dldPermit" className="block text-sm font-medium text-gray-900">DLD Permit Number</label>
            <input type="text" id="dldPermit" name="dldPermit" required placeholder="Enter DLD permit number" defaultValue={property.dldPermit} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label htmlFor="qrCode" className="block text-sm font-medium text-gray-900">QR Code Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer">
              <input type="file" id="qrCode" name="qrCode" accept="image/*" className="hidden" onChange={handleQrCodeChange} />
              <label htmlFor="qrCode" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <span className="text-gray-400 text-sm">Drop QR code image here, or click to select</span>
              </label>
            </div>
            {/* Existing QR Code Preview */}
            {property.qrCode && !qrCode && (
              <div className="relative w-24 h-24">
                <Image
                  src={property.qrCode}
                  alt="QR Code"
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={() => setProperty(prev => prev && ({ ...prev, qrCode: undefined }))}
                  className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:bg-red-500 hover:text-white transition-colors shadow group-hover:visible"
                  title="Remove QR code"
                >
                  &times;
                </button>
              </div>
            )}
            {/* New QR Code Preview */}
            {qrCode && (
              <div className="relative w-24 h-24">
                <Image
                  src={URL.createObjectURL(qrCode)}
                  alt={qrCode.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
        {/* Property Images */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Property Images</h2>
        <div className="mb-8">
          {/* Existing Images */}
          {property.images && property.images.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-4">
              {property.images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <Image
                    src={image}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setProperty(prev => prev && ({ ...prev, images: prev.images.filter((url: string) => url !== image) }))}
                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:bg-red-500 hover:text-white transition-colors shadow group-hover:visible"
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* New Images Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer">
            <input type="file" id="images" name="images" accept="image/*" multiple className="hidden" onChange={handleImagesChange} />
            <label htmlFor="images" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <span className="text-gray-400 text-sm">Drag and drop property images here, or click to select</span>
            </label>
          </div>
          {/* New Image Previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Image Preview ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
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
            {loading ? 'Saving...' : 'Update Property'}
          </button>
        </div>
      </div>
    </form>
  );
} 