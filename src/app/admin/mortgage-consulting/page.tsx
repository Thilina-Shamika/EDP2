"use client";

import { useEffect, useState } from "react";

interface CalculatorValues {
  purchasePrice?: number;
  downPayment?: number;
  loanPeriod?: number;
  interestRate?: number;
  monthlyRepayment?: number;
}

interface MortgageApproval {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  message?: string;
  calculatorValues?: CalculatorValues;
}

export default function MortgageConsulting() {
  const [approvals, setApprovals] = useState<MortgageApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchApprovals = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/mortgage-approval");
        if (!res.ok) throw new Error("Failed to fetch mortgage approvals");
        const data = await res.json();
        setApprovals(data);
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
    fetchApprovals();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mortgage approval?")) return;
    try {
      const res = await fetch(`/api/mortgage-approval?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete mortgage approval");
      setApprovals((prev) => prev.filter((a) => a._id !== id));
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
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#495565' }}>Mortgage Consulting Requests</h1>
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
                <th className="py-2 px-4">Message</th>
                <th className="py-2 px-4">Purchase Price</th>
                <th className="py-2 px-4">Down Payment</th>
                <th className="py-2 px-4">Loan Period</th>
                <th className="py-2 px-4">Interest Rate</th>
                <th className="py-2 px-4">Monthly Repayment</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody style={{ color: '#495565' }}>
              {approvals.map((a, idx) => (
                <tr key={a._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-4 align-middle">{a.name}</td>
                  <td className="py-2 px-4 align-middle">{a.email}</td>
                  <td className="py-2 px-4 align-middle">{a.mobile}</td>
                  <td className="py-2 px-4 align-middle">{a.message || '-'}</td>
                  <td className="py-2 px-4 align-middle">{a.calculatorValues?.purchasePrice ?? '-'}</td>
                  <td className="py-2 px-4 align-middle">{a.calculatorValues?.downPayment ?? '-'}</td>
                  <td className="py-2 px-4 align-middle">{a.calculatorValues?.loanPeriod ?? '-'}</td>
                  <td className="py-2 px-4 align-middle">{a.calculatorValues?.interestRate ?? '-'}</td>
                  <td className="py-2 px-4 align-middle">{a.calculatorValues?.monthlyRepayment ?? '-'}</td>
                  <td className="py-2 px-4 align-middle flex gap-2 items-center justify-center h-16">
                    <button
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(a._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {approvals.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-500">
                    No mortgage consulting requests found.
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