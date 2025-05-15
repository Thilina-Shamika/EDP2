"use client";

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ChevronDown } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface CountryData {
  name: string;
  countryCode: string;
  dialCode: string;
}

const faqItems = [
  {
    question: "What services does Elite Destination Property offer?",
    answer: "We offer a comprehensive range of real estate services including property sales, rentals, property management, investment consulting, and market analysis. Our team specializes in residential, commercial, and off-plan properties across Dubai's most prestigious locations."
  },
  {
    question: "How can I schedule a property viewing?",
    answer: "You can schedule a property viewing through our website, by calling our office, or by contacting your dedicated property consultant. We offer both in-person and virtual viewings to accommodate your preferences and schedule."
  },
  {
    question: "What areas do you cover in Dubai?",
    answer: "We cover all major areas in Dubai including Dubai Marina, Downtown Dubai, Business Bay, Palm Jumeirah, Jumeirah Beach Residence, and other prime locations. Our extensive network allows us to serve clients across the entire Dubai real estate market."
  },
  {
    question: "Do you offer property management services?",
    answer: "Yes, we provide comprehensive property management services including tenant screening, rent collection, property maintenance, and regular property inspections. Our team ensures your property is well-maintained and generates optimal returns."
  },
  {
    question: "What are your office hours?",
    answer: "Our office is open Monday through Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM. We are closed on Sundays and public holidays. For urgent matters, our emergency contact line is available 24/7."
  }
];

export default function ContactPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'Buy',
    message: ''
  });
  const [selectedCountry, setSelectedCountry] = useState({
    name: 'United Arab Emirates',
    format: '50 123 4567'
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch('/api/home-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Thank you! Your submission has been received.');
        setFormData({ name: '', phone: '', email: '', type: 'Buy', message: '' });
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string, country: CountryData) => {
    setFormData({...formData, phone: value});
    setSelectedCountry({
      name: country.name,
      format: '50 123 4567'
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section with Background Image */}
        <div 
          className="relative h-[300px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/fullwidth.jpeg')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <span className="inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                Get in Touch
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column - FAQ Section */}
              <div className="lg:col-span-7">
                <div className="max-w-3xl">
                  <div className="flex flex-col items-start mb-12">
                    <h2 className="text-4xl font-bold text-gray-900">FAQ</h2>
                  </div>

                  <div className="space-y-4">
                    {faqItems.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                          onClick={() => toggleAccordion(index)}
                        >
                          <span className="font-medium text-gray-900">{item.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 transition-transform ${
                              openIndex === index ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        {openIndex === index && (
                          <div className="px-6 py-4 bg-gray-50">
                            <p className="text-gray-600">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
                  {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className="w-full p-3 bg-gray-50 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 border border-gray-200"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    
                    <div className="grid grid-cols-1 gap-1">
                      <div className="phone-input-container">
                        <PhoneInput
                          country={'ae'}
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          inputProps={{
                            placeholder: '50 123 4567',
                            required: true,
                            className: "form-control !w-full !h-[50px] !pl-[130px] !bg-gray-50 !rounded !text-gray-900 !placeholder-gray-500 focus:!outline-none focus:!ring-2 focus:!ring-gray-700 border !border-gray-200"
                          }}
                          containerClass="phone-input"
                          inputClass="!w-full !h-[50px] !pl-[130px] !bg-gray-50 !rounded !text-gray-900 !placeholder-gray-500 !border !border-gray-200 focus:!outline-none focus:!ring-2 focus:!ring-gray-700 !text-[15px]"
                          buttonClass="!bg-gray-50 !border !border-gray-200 !rounded-l !w-[120px] !h-full"
                          dropdownClass="!bg-white !text-gray-900"
                          enableSearch={false}
                          preferredCountries={['ae']}
                        />
                      </div>
                      <div className="text-gray-500 text-xs pl-1">
                        Selected: {selectedCountry.name} • Format: {selectedCountry.format}
                      </div>
                    </div>
                      
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      className="w-full p-3 bg-gray-50 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 border border-gray-200"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                    <select
                      name="type"
                      className="w-full p-3 bg-gray-50 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 border border-gray-200 appearance-none"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="Buy">Buy</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Off Plan">Off Plan</option>
                    </select>

                    <textarea
                      name="message"
                      placeholder="Type your message here"
                      rows={4}
                      className="w-full p-3 bg-gray-50 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 border border-gray-200 resize-none"
                      value={formData.message}
                      onChange={handleChange}
                    />

                    <button
                      type="submit"
                      className="w-full bg-[#393e46] text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors"
                      disabled={submitting}
                    >
                      {submitting ? 'SENDING...' : 'SEND MESSAGE'}
                    </button>

                    <p className="text-xs text-gray-500 mt-4">
                      By submitting this form, you consent to our collection, processing, retention and use of your personal information in accordance with our Data Privacy Policy, and you consent to receiving marketing communications from us and our affiliated entities.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        .phone-input-container {
          width: 100%;
        }
        .phone-input {
          width: 100%;
        }
        .phone-input .flag-dropdown {
          width: 120px !important;
          height: 100% !important;
          background-color: #f9fafb !important;
          border: 1px solid #e5e7eb !important;
        }
        .phone-input .selected-flag {
          width: 120px !important;
          padding: 0 0 0 15px !important;
          background-color: transparent !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        .phone-input .selected-flag .flag {
          transform: scale(1.5);
        }
        .phone-input .selected-flag:after {
          content: "" !important;
          display: inline-block !important;
          width: 0 !important;
          height: 0 !important;
          margin-left: 4px !important;
          border-left: 5px solid transparent !important;
          border-right: 5px solid transparent !important;
          border-top: 5px solid #374151 !important;
          position: absolute !important;
          right: 8px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
        }
        .phone-input .selected-flag .arrow {
          display: none !important;
        }
        .phone-input .form-control {
          height: 50px !important;
          padding-left: 130px !important;
          font-size: 15px !important;
          border: 1px solid #e5e7eb !important;
          outline: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
        .phone-input .country-code {
          color: #111827 !important;
          font-size: 15px !important;
          margin-left: 8px !important;
        }
        .phone-input .selected-flag:hover,
        .phone-input .selected-flag:focus,
        .phone-input .selected-flag.open {
          background-color: #f9fafb !important;
        }
        .phone-input .country-list {
          background-color: white !important;
          color: #111827 !important;
          margin-top: 2px !important;
          width: 350px !important;
          max-height: 300px !important;
          border: 1px solid #e5e7eb !important;
        }
        .phone-input .country-list .country {
          padding: 12px 15px !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }
        .phone-input .country-list .country .flag {
          transform: scale(1.2);
        }
        .phone-input .country-list .country .dial-code {
          color: #6b7280 !important;
        }
        .phone-input .country-list .country:hover {
          background-color: #f3f4f6 !important;
        }
        .phone-input .country-list .country.highlight {
          background-color: #f3f4f6 !important;
        }
      `}</style>
    </>
  );
} 