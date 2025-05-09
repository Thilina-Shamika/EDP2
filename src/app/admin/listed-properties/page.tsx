"use client";

import { useEffect, useState } from "react";

interface ListedProperty {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  listingType: string;
  propertyAddress: string;
  createdAt: string;
}

export default function ListedProperties() {
  const [properties, setProperties] = useState<ListedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/list-property");
        if (!res.ok) throw new Error("Failed to fetch listed properties");
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : []);
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
    if (!confirm("Are you sure you want to delete this property listing?")) return;
    try {
      const res = await fetch(`/api/list-property?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete property listing");
      setProperties((prev) => prev.filter((prop) => prop._id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#495565' }}>Listed Properties</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg" style={{ color: '#495565' }}>
            <thead>
              <tr className="bg-gray-100 text-left" style={{ color: '#495565' }}>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Mobile</th>
                <th className="py-2 px-4">Listing Type</th>
                <th className="py-2 px-4">Property Address</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody style={{ color: '#495565' }}>
              {properties.map((prop, idx) => (
                <tr key={prop._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-4 align-middle">{prop.name}</td>
                  <td className="py-2 px-4 align-middle">{prop.email}</td>
                  <td className="py-2 px-4 align-middle">{prop.mobile}</td>
                  <td className="py-2 px-4 align-middle">{prop.listingType}</td>
                  <td className="py-2 px-4 align-middle">{prop.propertyAddress}</td>
                  <td className="py-2 px-4 align-middle flex gap-2 items-center justify-center h-16">
                    <button
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(prop._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No property listings found.
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