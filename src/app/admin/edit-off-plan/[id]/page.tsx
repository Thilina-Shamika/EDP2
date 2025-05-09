"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  installment1?: string;
  installment2?: string;
  handoverDate?: string;
  masterDeveloper?: string;
}

export default function EditOffPlanProperty() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [loading, setLoading] = useState(true);
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
  const [installment1, setInstallment1] = useState("");
  const [installment2, setInstallment2] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  const [masterDeveloper, setMasterDeveloper] = useState("");

  // Add state for removed images, QR code, and PDF
  const [removedImageIndexes, setRemovedImageIndexes] = useState<number[]>([]);
  const [removeQrCode, setRemoveQrCode] = useState(false);
  const [removePdf, setRemovePdf] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }
        const data = await response.json();
        setProperty(data);
        setPropertyType(data.propertyCategory || "");
        setPrice(data.price?.toString() || "");
        setProjectName(data.title || "");
        setDescription(data.description || "");
        setLocationDetails(data.location || "");
        setReference(data.reference || "");
        setDldPermit(data.dldPermit || "");
        setArea(data.area?.toString() || "");
        setZoneName(data.zoneName || "");
        setInstallment1(data.installment1 || "");
        setInstallment2(data.installment2 || "");
        setHandoverDate(data.handoverDate || "");
        setMasterDeveloper(data.masterDeveloper || "");
      } catch (error) {
        console.error('Failed to load property', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

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
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setPdf(e.target.files[0]);
  };

  // Update handleRemoveImage to support removing existing images
  const handleRemoveExistingImage = (idx: number) => {
    setRemovedImageIndexes(prev => [...prev, idx]);
  };

  // Remove QR code
  const handleRemoveExistingQrCode = () => {
    setRemoveQrCode(true);
  };

  // Remove PDF
  const handleRemoveExistingPdf = () => {
    setRemovePdf(true);
  };

  // Upload images to Cloudinary
  const uploadImagesToCloudinary = async (files: File[], resourceType: "image" | "raw" = "image") => {
    const formData = new FormData();
    files.forEach(file => formData.append("file", file));
    formData.append("upload_preset", "ml_default");
    formData.append("resource_type", resourceType);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload images");
    }

    const data = await response.json();
    return [data.secure_url];
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Validation
    if (!propertyType) { console.error("Property Type is required."); setLoading(false); return; }
    if (!price) { console.error("Price is required."); setLoading(false); return; }
    if (!projectName) { console.error("Project Name is required."); setLoading(false); return; }
    if (!description) { console.error("Project Description is required."); setLoading(false); return; }
    if (!locationDetails) { console.error("Location Details are required."); setLoading(false); return; }
    if (!reference) { console.error("Reference is required."); setLoading(false); return; }
    if (!dldPermit) { console.error("DLD Permit Number is required."); setLoading(false); return; }
    if (!area) { console.error("Square Feet is required."); setLoading(false); return; }
    if (!zoneName) { console.error("Zone Name is required."); setLoading(false); return; }
    if (!masterDeveloper) { console.error("Master Developer is required."); setLoading(false); return; }
    if (!handoverDate) { console.error("Handover Date is required."); setLoading(false); return; }
    if (!installment1) { console.error("Installment 1 is required."); setLoading(false); return; }
    if (!installment2) { console.error("Installment 2 is required."); setLoading(false); return; }

    // Upload new images
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
    } catch (error) {
      console.error("File upload failed. Please try again.", error);
      setLoading(false);
      return;
    }
    // Filter out removed images from property.images
    const existingImages = (property?.images || []).filter((_, idx) => !removedImageIndexes.includes(idx));
    const allImages = [...existingImages, ...imageUrls];
    // Handle QR code and PDF removal
    if (removeQrCode) qrCodeUrl = "";
    if (removePdf) pdfUrl = "";
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
      installment1,
      installment2,
      handoverDate,
      masterDeveloper,
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
      console.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
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
              <label className="block text-sm font-medium text-gray-900 mb-1">Installment 1</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={installment1} onChange={e => setInstallment1(e.target.value)} required placeholder="e.g., 10% on booking" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Installment 2</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={installment2} onChange={e => setInstallment2(e.target.value)} required placeholder="e.g., 90% on handover" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Handover Date</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={handoverDate} onChange={e => setHandoverDate(e.target.value)} required placeholder="e.g., Q4 2024" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Square Feet</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="number" value={area} onChange={e => setArea(e.target.value)} required />
            </div>
          </div>
        </div>

        {/* Developer Information */}
        <div className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Developer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Master Developer</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={masterDeveloper} onChange={e => setMasterDeveloper(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Project Name</label>
              <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={projectName} onChange={e => setProjectName(e.target.value)} required />
            </div>
          </div>
        </div>

        {/* About Project */}
        <div className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">About Project</h2>
          <label className="block text-sm font-medium text-gray-900 mb-1">Project Description</label>
          <textarea className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" rows={4} value={description} onChange={e => setDescription(e.target.value)} required />
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Location</h2>
          <label className="block text-sm font-medium text-gray-900 mb-1">Location Details</label>
          <input className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-gray-900" type="text" value={locationDetails} onChange={e => setLocationDetails(e.target.value)} required />
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
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Images</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Property Images</label>
              <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="mt-1 block w-full" />
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={URL.createObjectURL(img)} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded" />
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {property.images && property.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.images.map((img, idx) =>
                  removedImageIndexes.includes(idx) ? null : (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Existing ${idx + 1}`} className="w-full h-32 object-cover rounded" />
                      <button type="button" onClick={() => handleRemoveExistingImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">QR Code</h2>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">QR Code Image</label>
            <input type="file" accept="image/*" onChange={handleQrCodeChange} className="mt-1 block w-full" />
            {property.qrCode && !removeQrCode && (
              <div className="mt-4 relative w-32 h-32">
                <img src={property.qrCode} alt="Existing QR Code" className="object-contain w-full h-full" />
                <button type="button" onClick={handleRemoveExistingQrCode} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PDF */}
        <div className="bg-white rounded-lg p-8 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">PDF</h2>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Property PDF</label>
            <input type="file" accept=".pdf" onChange={handlePdfChange} className="mt-1 block w-full" />
            {property.pdf && !removePdf && (
              <div className="mt-4 flex items-center gap-2">
                <a href={property.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">View existing PDF</a>
                <button type="button" onClick={handleRemoveExistingPdf} className="bg-red-500 text-white p-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
            {loading ? "Updating Property..." : "Update Property"}
          </button>
        </div>
      </form>
    </div>
  );
} 