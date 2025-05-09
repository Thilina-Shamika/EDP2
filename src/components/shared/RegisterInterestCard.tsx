"use client";

import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';

interface RegisterInterestCardProps {
  propertyType?: string;
}

export default function RegisterInterestCard({ propertyType = 'buy' }: RegisterInterestCardProps) {
  const params = useParams();
  const propertyId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectName: '',
  });
  const [phone, setPhone] = useState<string | undefined>('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone,
          propertyId,
          propertyType
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit');
      }
      
      setFormData({ name: '', email: '', projectName: '' });
      setPhone('');
      toast.success('Thank you for your interest! We will contact you shortly.');
    } catch (err) {
      toast.error('Failed to register your interest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Register your interest</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Mobile <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            international
            defaultCountry="AE"
            value={phone}
            onChange={setPhone}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            Selected: {phone ? (() => {
              try {
                const match = phone.match(/^\+(\d{1,3})/);
                if (match) {
                  return `+${match[1]}`;
                }
              } catch {}
              return 'UAE (+971)';
            })() : 'UAE (+971)'} • Format: (123) 456-7890
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Project Name
          </label>
          <input
            type="text"
            name="projectName"
            placeholder="Project name"
            value={formData.projectName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors mt-6 font-medium disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit Details'}
        </button>
      </form>
    </div>
  );
} 