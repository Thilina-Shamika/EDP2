"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';

const PROPERTY_TYPE_OPTIONS = [
  "Apartment", "Villa", "Townhouse", "Penthouse", "Duplex", "Studio", "Loft", "Plot", "Other"
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
  status: string;
  reference?: string;
  zoneName?: string;
  dldPermit?: string;
  qrCode?: string;
  pdf?: string;
}

export default function EditOffPlanProperty() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  // Form fields
  const [propertyType, setPropertyType] = useState("");
  const [price, setPrice] = useState("");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [reference, setReference] = useState("");
  const [dldPermit, setDldPermit] = useState("");
  const [area, setArea] = useState("");
  const [zoneName, setZoneName] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error('Failed to fetch property');
        const data = await res.json();
        setProperty(data);
        // Pre-fill form fields
        setPropertyType(data.propertyCategory || "");
        setProjectName(data.title || "");
        setDescription(data.description || "");
        setPrice(data.price?.toString() || "");
        setArea(data.area?.toString() || "");
        setLocationDetails(data.location || "");
        setReference(data.reference || "");
        setZoneName(data.zoneName || "");
        setDldPermit(data.dldPermit || "");
        // Optionally set other fields if you add them to the model
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

  // Handlers for file/image changes
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImages(prev => [...prev, ...Array.from(files)]);
    }
  };
  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };
  const handleRemoveExistingImage = (imgUrl: string) => {
    setProperty((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        images: prev.images.filter((url: string) => url !== imgUrl)
      };
    });
  };
  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setQrCode(e.target.files[0]);
  };
  const handleRemoveQrCode = () => setQrCode(null);
  const handleRemoveExistingQrCode = () => {
    setProperty((prev) => {
      if (!prev) return null;
      return { ...prev, qrCode: undefined };
    });
  };
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setPdf(e.target.files[0]);
  };
  const handleRemovePdf = () => setPdf(null);
  const handleRemoveExistingPdf = () => {
    setProperty((prev) => {
      if (!prev) return null;
      return { ...prev, pdf: undefined };
    });
  };

  // Cloudinary upload helpers
  const uploadImagesToCloudinary = async (files: File[], resourceType = "image") => {
    const urls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "edprop_unsigned");
      formData.append("cloud_name", "djoe6vb5c");
      const url = resourceType === "raw"
        ? "https://api.cloudinary.com/v1_1/djoe6vb5c/raw/upload"
        : "https://api.cloudinary.com/v1_1/djoe6vb5c/image/upload";
      const res = await fetch(url, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) urls.push(data.secure_url);
    }
    return urls;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Validation
    if (!propertyType) { setError("Property Type is required."); setLoading(false); return; }
    if (!price) { setError("Price is required."); setLoading(false); return; }
    if (!projectName) { setError("Project Name is required."); setLoading(false); return; }
    if (!description) { setError("Project Description is required."); setLoading(false); return; }
    if (!locationDetails) { setError("Location Details are required."); setLoading(false); return; }
    if (!reference) { setError("Reference is required."); setLoading(false); return; }
    if (!dldPermit) { setError("DLD Permit Number is required."); setLoading(false); return; }
    if (!area) { setError("Square Feet is required."); setLoading(false); return; }
    if (!zoneName) { setError("Zone Name is required."); setLoading(false); return; }
    // Upload images
    let imageUrls: string[] = [];
    let qrCodeUrl = property?.qrCode || "";
    let pdfUrl = property?.pdf || "";
    try {
      if (images.length > 0) imageUrls = await uploadImagesToCloudinary(images);
      if (qrCode) {
        const qrArr = await uploadImagesToCloudinary([qrCode]);
        qrCodeUrl = qrArr[0] || qrCodeUrl;
      }
      if (pdf) {
        const pdfArr = await uploadImagesToCloudinary([pdf], "raw");
        pdfUrl = pdfArr[0] || pdfUrl;
      }
    } catch {
      setError("File upload failed. Please try again.");
      setLoading(false);
      return;
    }
    // Merge with existing images
    const allImages = [...(property?.images || []), ...imageUrls];
    // Build data
    const data = {
      title: projectName,
      description,
      type: "off-plan",
      propertyCategory: propertyType,
      price,
      location: locationDetails,
      area,
      reference,
      zoneName,
      dldPermit,
      qrCode: qrCodeUrl,
      images: allImages,
      pdf: pdfUrl,
    };
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update property");
      router.push("/admin/manage-off-plan");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!property) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#495565' }}>Edit Off Plan Property</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Key Information */}
        <div className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Key Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Property Type</label>
              <select className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" value={propertyType} onChange={e => setPropertyType(e.target.value)} required>
                <option value="">Select Property Type</option>
                {PROPERTY_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Price (AED)</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Square Feet</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="number" value={area} onChange={e => setArea(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Project Name</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={projectName} onChange={e => setProjectName(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-1">Location Details</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={locationDetails} onChange={e => setLocationDetails(e.target.value)} required />
            </div>
          </div>
        </div>
        {/* About Project */}
        <div className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">About Project</h2>
          <label className="block text-sm font-medium text-gray-900 mb-1">Project Description</label>
          <textarea className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" rows={4} value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        {/* Regulatory Information */}
        <div className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Regulatory Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Reference</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={reference} onChange={e => setReference(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">DLD Permit Number</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={dldPermit} onChange={e => setDldPermit(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Zone Name</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={zoneName} onChange={e => setZoneName(e.target.value)} required />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-1">QR Code</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer">
              <input type="file" id="qrCode" accept="image/*" className="hidden" onChange={handleQrCodeChange} />
              <label htmlFor="qrCode" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <span className="text-gray-400 text-sm">Drag and drop QR code image here, or click to select</span>
              </label>
            </div>
            {/* Existing QR Code Preview */}
            {property.qrCode && !qrCode && (
              <div className="relative w-24 h-24 mt-4 border rounded overflow-hidden group">
                <Image
                  src={property.qrCode}
                  alt="QR Code"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
                <button type="button" onClick={handleRemoveExistingQrCode} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:bg-red-500 hover:text-white transition-colors shadow group-hover:visible" title="Remove QR code">&times;</button>
              </div>
            )}
            {/* New QR Code Preview */}
            {qrCode && (
              <div className="relative w-24 h-24 mt-4 border rounded overflow-hidden group">
                <Image
                  src={URL.createObjectURL(qrCode)}
                  alt={qrCode.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
                <button type="button" onClick={handleRemoveQrCode} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:bg-red-500 hover:text-white transition-colors shadow group-hover:visible" title="Remove QR code">&times;</button>
              </div>
            )}
          </div>
        </div>
        {/* Property Images */}
        <div className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Property Images</h2>
          {/* Existing Images */}
          {property.images && property.images.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-4">
              {property.images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden group">
                  <Image
                    src={img}
                    alt={`Property ${idx + 1}`}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                  <button type="button" onClick={() => handleRemoveExistingImage(img)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:bg-red-500 hover:text-white transition-colors shadow group-hover:visible" title="Remove image">&times;</button>
                </div>
              ))}
            </div>
          )}
          {/* New Images Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer">
            <input type="file" id="images" accept="image/*" multiple className="hidden" onChange={handleImagesChange} />
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
                  <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:bg-red-500 hover:text-white transition-colors shadow group-hover:visible" title="Remove image">&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* PDF Upload */}
        <div className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Project Brochure (PDF)</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer mb-4">
            <input type="file" id="pdf" accept="application/pdf" className="hidden" onChange={handlePdfChange} />
            <label htmlFor="pdf" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <span className="text-gray-400 text-sm">Drag and drop PDF here, or click to select</span>
            </label>
          </div>
          {/* Existing PDF */}
          {property.pdf && !pdf && (
            <div className="flex items-center gap-2 mt-2">
              <a href={property.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">View PDF</a>
              <button type="button" onClick={handleRemoveExistingPdf} className="text-red-500 hover:underline text-xs">Remove</button>
            </div>
          )}
          {/* New PDF */}
          {pdf && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-700 text-sm">{pdf.name}</span>
              <button type="button" onClick={handleRemovePdf} className="text-red-500 hover:underline text-xs">Remove</button>
            </div>
          )}
        </div>
        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="rounded-full bg-black text-white px-8 py-2 font-semibold text-lg shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
            {loading ? "Saving..." : "Update Property"}
          </button>
        </div>
      </form>
    </div>
  );
} 