"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
}

export default function ManageOffPlan() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/properties?type=off-plan");
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();
        setProperties(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete property');
      }
      setProperties(properties.filter(property => property._id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#495565' }}>Manage Off Plan Properties</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg" style={{ color: '#495565' }}>
            <thead>
              <tr className="bg-gray-100 text-left" style={{ color: '#495565' }}>
                <th className="py-2 px-4">Image</th>
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Price (AED)</th>
                <th className="py-2 px-4">Area (sq ft)</th>
                <th className="py-2 px-4">Location</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody style={{ color: '#495565' }}>
              {properties.map((p, idx) => (
                <tr key={p._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-4 align-middle">
                    {p.images && p.images.length > 0 ? (
                      <div className="flex items-center justify-center h-16">
                        <img src={p.images[0]} alt="Property" className="w-16 h-16 object-cover rounded" />
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-2 px-4 align-middle">{p.title}</td>
                  <td className="py-2 px-4 align-middle">{p.price?.toLocaleString()}</td>
                  <td className="py-2 px-4 align-middle">{p.area}</td>
                  <td className="py-2 px-4 align-middle">{p.location}</td>
                  <td className="py-2 px-4 align-middle">{p.status}</td>
                  <td className="py-2 px-4 align-middle flex gap-2 items-center justify-center h-16">
                    <button
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => router.push(`/admin/edit-off-plan/${p._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 