'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Toaster, toast } from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Link from 'next/link';

export default function MortgageCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [downPayment, setDownPayment] = useState(100000);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(50);
  const [loanPeriod, setLoanPeriod] = useState(1);
  const [interestRate, setInterestRate] = useState(1);
  const [monthlyRepayment, setMonthlyRepayment] = useState(0);
  const [showConsultingForm, setShowConsultingForm] = useState(false);

  // Consulting form state
  const [consultForm, setConsultForm] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [consultLoading, setConsultLoading] = useState(false);

  useEffect(() => {
    calculateMonthlyRepayment();
    // eslint-disable-next-line
  }, [purchasePrice, downPayment, loanPeriod, interestRate]);

  const calculateMonthlyRepayment = () => {
    const P = purchasePrice - downPayment;
    const r = interestRate / 12 / 100;
    const n = loanPeriod * 12;
    if (P <= 0 || r <= 0 || n <= 0) {
      setMonthlyRepayment(0);
      return;
    }
    // Standard mortgage formula
    const numerator = r * Math.pow(1 + r, n);
    const denominator = Math.pow(1 + r, n) - 1;
    const M = P * (numerator / denominator);
    setMonthlyRepayment(Math.round(M));
  };

  const handlePurchasePriceChange = (value: number) => {
    setPurchasePrice(value);
    const newDownPayment = (value * downPaymentPercentage) / 100;
    setDownPayment(Math.round(newDownPayment));
  };

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    const percentage = (value / purchasePrice) * 100;
    setDownPaymentPercentage(Math.min(Math.round(percentage * 10) / 10, 100));
  };

  const handleDownPaymentPercentageChange = (value: number) => {
    setDownPaymentPercentage(value);
    const newDownPayment = (purchasePrice * value) / 100;
    setDownPayment(Math.round(newDownPayment));
  };

  // Consulting form handlers
  const handleConsultChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConsultForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConsultMobileChange = (value: string | undefined) => {
    setConsultForm(prev => ({ ...prev, mobile: value || '' }));
  };

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultLoading(true);
    try {
      console.log('Submitting mortgage approval form...');
      const formData = {
        ...consultForm,
        calculatorValues: {
          purchasePrice,
          downPayment,
          loanPeriod,
          interestRate,
          monthlyRepayment,
        },
      };
      console.log('Form data:', formData);

      const response = await fetch('/api/mortgage-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      toast.success('Mortgage approval request submitted!');
      setConsultForm({ name: '', email: '', mobile: '', message: '' });
      setShowConsultingForm(false);
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setConsultLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Toaster position="top-right" />
      <Header />
      <div className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="max-w-2xl w-full border border-gray-200 shadow-md rounded-lg mx-auto px-4 py-6">
          <h1 className="text-xl font-bold text-[#002D4B] mb-4">
            Calculate your mortgage repayments
          </h1>

          <div className="space-y-4">
            {/* Purchase Price */}
            <div>
              <label className="block text-[#002D4B] font-medium mb-1 text-sm">
                Purchase Price
              </label>
              <input
                type="range"
                min={200000}
                max={3500000}
                value={purchasePrice}
                onChange={(e) => handlePurchasePriceChange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-0.5 text-xs text-gray-600">
                <span>AED {(200000).toLocaleString()}</span>
                <span>AED {(3500000).toLocaleString()}</span>
              </div>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => handlePurchasePriceChange(Number(e.target.value))}
                className="mt-1 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {/* Down Payment */}
            <div>
              <label className="block text-[#002D4B] font-medium mb-1 text-sm">
                Down Payment
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={purchasePrice}
                    value={downPayment}
                    onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-0.5 text-xs text-gray-600">
                    <span>AED {(0).toLocaleString()}</span>
                    <span>AED {purchasePrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    value={downPaymentPercentage}
                    onChange={(e) => handleDownPaymentPercentageChange(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    min={0}
                    max={100}
                  />
                  <span className="text-xs text-gray-600 mt-0.5 block text-right">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Loan Period */}
            <div>
              <label className="block text-[#002D4B] font-medium mb-1 text-sm">
                Loan Period
              </label>
              <input
                type="range"
                min={1}
                max={30}
                value={loanPeriod}
                onChange={(e) => setLoanPeriod(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-0.5 text-xs text-gray-600">
                <span>1 year</span>
                <span>30 years</span>
              </div>
              <input
                type="number"
                value={loanPeriod}
                onChange={(e) => setLoanPeriod(Number(e.target.value))}
                className="mt-1 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-[#002D4B] font-medium mb-1 text-sm">
                Interest Rate:
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-0.5 text-xs text-gray-600">
                <span>1%</span>
                <span>20%</span>
              </div>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="mt-1 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {/* Monthly Repayment */}
            <div className="mt-4">
              <p className="text-xs text-gray-600">Monthly repayment</p>
              <p className="text-xl font-bold text-[#002D4B]">
                AED {monthlyRepayment.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                * Estimated initial monthly payments based on a AED {purchasePrice.toLocaleString()} purchase price with a {interestRate}% fixed interest rate.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-100 p-4 rounded-lg mt-4">
              <h2 className="text-lg font-bold text-[#002D4B] mb-3">
                Need help or ready to proceed?
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowConsultingForm(true)}
                  className="bg-[#393e46] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                >
                  Start Mortgage Approval
                </button>
                <Link href="/contact">
                <button className="border-2 text-black px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-colors text-sm">
                  Speak to our team
                </button>
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consulting Form Modal */}
      {showConsultingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowConsultingForm(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#002D4B]">Start Mortgage Approval</h2>
            <form onSubmit={handleConsultSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={consultForm.name}
                  onChange={handleConsultChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={consultForm.email}
                  onChange={handleConsultChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <PhoneInput
                  international
                  defaultCountry="AE"
                  value={consultForm.mobile}
                  onChange={handleConsultMobileChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="050 123 4567"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={consultForm.message}
                  onChange={handleConsultChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 rounded-full hover:bg-gray-800 transition-colors"
                disabled={consultLoading}
              >
                {consultLoading ? 'Submitting...' : 'Submit Details'}
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
} 