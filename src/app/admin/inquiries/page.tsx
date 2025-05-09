"use client";

import { useEffect, useState } from "react";

interface HomeForm {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: string;
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<HomeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/home-form");
        if (!res.ok) throw new Error("Failed to fetch inquiries");
        const data = await res.json();
        console.log('Fetched data:', data); // Debug log
        setInquiries(Array.isArray(data) ? data : []);
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
    fetchInquiries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/home-form?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete inquiry");
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
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
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#495565' }}>Inquiries</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg" style={{ color: '#495565' }}>
            <thead>
              <tr className="bg-gray-100 text-left" style={{ color: '#495565' }}>
                <th className="py-2 px-4">Full Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Message</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody style={{ color: '#495565' }}>
              {inquiries.map((inq, idx) => (
                <tr key={inq._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-4 align-middle">{inq.fullName}</td>
                  <td className="py-2 px-4 align-middle">{inq.email}</td>
                  <td className="py-2 px-4 align-middle">{inq.phone}</td>
                  <td className="py-2 px-4 align-middle">{inq.message || '-'}</td>
                  <td className="py-2 px-4 align-middle flex gap-2 items-center justify-center h-16">
                    <button
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(inq._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No inquiries found.
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