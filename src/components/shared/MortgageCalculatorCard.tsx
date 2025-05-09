import Link from 'next/link';

export default function MortgageCalculatorCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Need a mortgage?</h2>
      <Link
        href="/mortgage-calculator"
        className="block w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors text-center text-base font-medium"
      >
        Try Our Calculator
      </Link>
    </div>
  );
} 