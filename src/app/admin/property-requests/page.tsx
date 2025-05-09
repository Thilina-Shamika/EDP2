"use client";

import { useEffect, useState } from "react";

interface PropertyRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  projectName: string;
  propertyType: string;
}

export default function PropertyRequests() {
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/inquiries");
        if (!res.ok) throw new Error("Failed to fetch property requests");
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
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
    fetchRequests();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property request?")) return;
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete property request");
      setRequests((prev) => prev.filter((req) => req._id !== id));
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
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#495565' }}>Property Requests</h1>
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
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Project Name</th>
                <th className="py-2 px-4">Property Type</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody style={{ color: '#495565' }}>
              {requests.map((req, idx) => (
                <tr key={req._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-4 align-middle">{req.name}</td>
                  <td className="py-2 px-4 align-middle">{req.email}</td>
                  <td className="py-2 px-4 align-middle">{req.phone}</td>
                  <td className="py-2 px-4 align-middle">{req.projectName}</td>
                  <td className="py-2 px-4 align-middle">{req.propertyType}</td>
                  <td className="py-2 px-4 align-middle flex gap-2 items-center justify-center h-16">
                    <button
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(req._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No property requests found.
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