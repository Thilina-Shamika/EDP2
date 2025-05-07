'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [counts, setCounts] = useState({ buy: 0, commercial: 0, offplan: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const [buyRes, commercialRes, offplanRes] = await Promise.all([
          fetch("/api/properties?type=buy"),
          fetch("/api/properties?type=commercial"),
          fetch("/api/properties?type=off-plan"),
        ]);
        if (!buyRes.ok || !commercialRes.ok || !offplanRes.ok) throw new Error("Failed to fetch property counts");
        const [buy, commercial, offplan] = await Promise.all([
          buyRes.json(),
          commercialRes.json(),
          offplanRes.json(),
        ]);
        setCounts({ buy: buy.length, commercial: commercial.length, offplan: offplan.length });
      } catch {
        setError("Failed to load property counts");
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Welcome</h2>
          <p className="text-gray-600">
            Welcome back, {session?.user?.name || session?.user?.email}!
          </p>
          <p className="text-gray-600 mt-2">
            You are logged in as an {session?.user?.role}.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Listings</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Recent Activity</h2>
          <p className="text-gray-600">No recent activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold mb-2" style={{ color: '#495565' }}>Buy Properties</span>
          <span className="text-3xl font-bold" style={{ color: '#101728' }}>{loading ? '...' : counts.buy}</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold mb-2" style={{ color: '#495565' }}>Commercial Properties</span>
          <span className="text-3xl font-bold" style={{ color: '#101728' }}>{loading ? '...' : counts.commercial}</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold mb-2" style={{ color: '#495565' }}>Off Plan Properties</span>
          <span className="text-3xl font-bold" style={{ color: '#101728' }}>{loading ? '...' : counts.offplan}</span>
        </div>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
    </div>
  );
} 