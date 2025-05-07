"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PROPERTY_TYPE_OPTIONS = [
  "Apartment", "Villa", "Townhouse", "Penthouse", "Duplex", "Studio", "Loft", "Plot", "Other"
];

export default function AddOffPlan() {
  const router = useRouter();
  // Key Info
  const [propertyType, setPropertyType] = useState("");
  const [beds, setBeds] = useState("");
  const [price, setPrice] = useState("");
  const [installment1, setInstallment1] = useState("");
  const [installment2, setInstallment2] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  // Developer Info
  const [masterDeveloper, setMasterDeveloper] = useState("");
  const [projectName, setProjectName] = useState("");
  // About Project
  const [description, setDescription] = useState("");
  // Location
  const [locationDetails, setLocationDetails] = useState("");
  // Regulatory
  const [reference, setReference] = useState("");
  const [dldPermit, setDldPermit] = useState("");
  const [qrCode, setQrCode] = useState<File | null>(null);
  // Images
  const [images, setImages] = useState<File[]>([]);
  // PDF
  const [pdf, setPdf] = useState<File | null>(null);
  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handlers
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImages(prev => [...prev, ...Array.from(files)]);
    }
  };
  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };
  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setQrCode(e.target.files[0]);
  };
  const handleRemoveQrCode = () => setQrCode(null);
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setPdf(e.target.files[0]);
  };
  const handleRemovePdf = () => setPdf(null);

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
    // Upload images
    let imageUrls: string[] = [];
    let qrCodeUrl = "";
    let pdfUrl = "";
    try {
      if (images.length > 0) imageUrls = await uploadImagesToCloudinary(images);
      if (qrCode) {
        const qrArr = await uploadImagesToCloudinary([qrCode]);
        qrCodeUrl = qrArr[0] || "";
      }
      if (pdf) {
        const pdfArr = await uploadImagesToCloudinary([pdf], "raw");
        pdfUrl = pdfArr[0] || "";
      }
    } catch {
      setError("File upload failed. Please try again.");
      setLoading(false);
      return;
    }
    // Build data
    const data = {
      type: "off-plan",
      propertyType,
      beds,
      price,
      installment1,
      installment2,
      handoverDate,
      masterDeveloper,
      projectName,
      description,
      locationDetails,
      reference,
      dldPermit,
      qrCode: qrCodeUrl,
      images: imageUrls,
      pdf: pdfUrl,
    };
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add property");
      router.push("/admin/manage-off-plan");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-8">
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm" style={{ color: '#101728' }}>{error}</div>}
      {/* Key Information */}
      <div className="bg-white rounded-lg p-8 shadow">
        <h2 className="text-lg font-bold mb-6" style={{ color: '#101728' }}>Key Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>Property Type</label>
            <select className="w-full border rounded px-3 py-2 text-base" style={{ color: '#101728' }} value={propertyType} onChange={e => setPropertyType(e.target.value)} required>
              <option value="">Select Property Type</option>
              {PROPERTY_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>Number of Beds</label>
            <input className="w-full border rounded px-3 py-2 text-base" style={{ color: '#101728' }} type="text" value={beds} onChange={e => setBeds(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>Price (AED)</label>
            <input className="w-full border rounded px-3 py-2 text-base" style={{ color: '#101728' }} type="number" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>Installment 1</label>
            <input className="w-full border rounded px-3 py-2 text-base" style={{ color: '#101728' }} type="text" value={installment1} onChange={e => setInstallment1(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>Installment 2</label>
            <input className="w-full border rounded px-3 py-2 text-base" style={{ color: '#101728' }} type="text" value={installment2} onChange={e => setInstallment2(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>Handover Date</label>
            <input className="w-full border rounded px-3 py-2 text-base" style={{ color: '#101728' }} type="text" placeholder="e.g., Q4 2025" value={handoverDate} onChange={e => setHandoverDate(e.target.value)} />
          </div>
        </div>
      </div>
      {/* Developer Information */}
      <div className="bg-white rounded-lg p-8 shadow">
        <h2 className="text-lg font-bold mb-6" style={{ color: '#101728' }}>Developer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>Master Developer</label>
            <input className="w-full border rounded px-3 py-2 text-base" style={{ color: '#101728' }} type="text" value={masterDeveloper} onChange={e => setMasterDeveloper(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>Project Name</label>
            <input className="w-full border rounded px-3 py-2 text-base" style={{ color: '#101728' }} type="text" value={projectName} onChange={e => setProjectName(e.target.value)} required />
          </div>
        </div>
      </div>
      {/* About Project */}
      <div className="bg-white rounded-lg p-8 shadow">
        <h2 className="text-lg font-bold mb-6" style={{ color: '#101728' }}>About Project</h2>
        <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>Project Description</label>
        <textarea className="w-full border rounded px-3 py-2 text-base" style={{ color: '#101728' }} rows={4} value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      {/* Location */}
      <div className="bg-white rounded-lg p-8 shadow">
        <h2 className="text-lg font-bold mb-6" style={{ color: '#101728' }}>Location</h2>
        <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>Location Details</label>
        <textarea className="w-full border rounded px-3 py-2 text-base" style={{ color: '#101728' }} rows={3} value={locationDetails} onChange={e => setLocationDetails(e.target.value)} required />
      </div>
      {/* Regulatory Information */}
      <div className="bg-white rounded-lg p-8 shadow">
        <h2 className="text-lg font-bold mb-6" style={{ color: '#101728' }}>Regulatory Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>Reference</label>
            <input className="w-full border rounded px-3 py-2 text-base" style={{ color: '#101728' }} type="text" value={reference} onChange={e => setReference(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>DLD Permit Number</label>
            <input className="w-full border rounded px-3 py-2 text-base" style={{ color: '#101728' }} type="text" value={dldPermit} onChange={e => setDldPermit(e.target.value)} required />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" style={{ color: '#101728' }}>QR Code</label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer">
            <input type="file" id="qrCode" accept="image/*" className="hidden" onChange={handleQrCodeChange} />
            <label htmlFor="qrCode" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <span className="text-gray-400 text-sm">Drag and drop QR code image here, or click to select</span>
            </label>
          </div>
          {qrCode && (
            <div className="relative w-24 h-24 mt-4 border rounded overflow-hidden group">
              <img src={URL.createObjectURL(qrCode)} alt={qrCode.name} className="object-cover w-full h-full" />
              <button type="button" onClick={handleRemoveQrCode} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:bg-red-500 hover:text-white transition-colors shadow group-hover:visible" title="Remove QR code">&times;</button>
            </div>
          )}
        </div>
      </div>
      {/* Property Images */}
      <div className="bg-white rounded-lg p-8 shadow">
        <h2 className="text-lg font-bold mb-6" style={{ color: '#101728' }}>Property Images</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer mb-4">
          <input type="file" id="images" accept="image/*" multiple className="hidden" onChange={handleImagesChange} />
          <label htmlFor="images" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <span className="text-gray-400 text-sm">Drag and drop property images here, or click to select</span>
          </label>
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden group">
                <img src={URL.createObjectURL(img)} alt={img.name} className="object-cover w-full h-full" />
                <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:bg-red-500 hover:text-white transition-colors shadow group-hover:visible" title="Remove image">&times;</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* PDF Upload */}
      <div className="bg-white rounded-lg p-8 shadow">
        <h2 className="text-lg font-bold mb-6" style={{ color: '#101728' }}>Project Brochure (PDF)</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer mb-4">
          <input type="file" id="pdf" accept="application/pdf" className="hidden" onChange={handlePdfChange} />
          <label htmlFor="pdf" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <span className="text-gray-400 text-sm">Drag and drop PDF here, or click to select</span>
          </label>
        </div>
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
          {loading ? "Adding..." : "Add Property"}
        </button>
      </div>
    </form>
  );
} 