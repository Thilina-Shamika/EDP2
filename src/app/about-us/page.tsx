"use client";

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

const coreValues = [
  {
    title: "Commitment",
    content: "Trust is built through action. When we make a promise, we deliver. We consistently push ourselves to achieve remarkable results - whether finding your perfect property or securing the best possible deal."
  },
  {
    title: "Integrity",
    content: "Long-term relationships are built on trust. That's why we maintain complete transparency and honesty. We don't compromise on our principles or take shortcuts. Every interaction, every recommendation, every transaction is guided by doing what's right. This enables you to make decisions with absolute confidence."
  },
  {
    title: "Respect",
    content: "Relationships thrive on understanding. Each client brings their own story. Each partner brings their own strengths. Each team member brings their own perspective. We embrace these differences. We listen. We learn. We ensure everyone who works with us feels heard and valued."
  }
];

export default function AboutUs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Elite Destination Property (EDP)</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column - Image */}
              <div className="lg:col-span-6">
                <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
                  <Image
                    src="/images/harbour.jpg"
                    alt="About EDP"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-6">
                <div className="flex flex-col items-start space-y-6">
                  {/* Pill */}
                  <span className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                    Our Story
                  </span>

                  {/* Heading */}
                  <h2 className="text-3xl font-bold text-gray-900">Trust and relationships are <br/>at the heart of our story</h2>

                  {/* Paragraph */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Trust and relationships are at the heart of our story. It all started when our founders Abdul Basir Qayumi and Mirwais Janbaz shared a clear vision: put our investors first and build lasting partnerships through genuine understanding of our market.
                    <br /><br />
                    Since then, we've developed something truly special: a unique combination of skills that makes us different. We've created a team that brings together the best of both worlds - international expertise and strong local knowledge of the UAE. With over 15 years of combined experience and a multilingual team, we guide investment decisions with confidence. Market knowledge matters. Of course it does. But what truly sets us apart? It's the relationships we build. We're not interested in quick deals. Instead, we invest time to understand what matters to you - your dreams, your goals, and your investment aspirations.
                    <br /><br />
                    Our track record speaks for itself. Investors return to us because we've become trusted partners in their journey.
                    <br /><br />
                    Here's what we believe: when you win, we win.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision and Mission Section */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column - Mission */}
              <div className="lg:col-span-6">
                <div className="flex flex-col items-start space-y-6 p-8 border border-gray-200 rounded-lg bg-gray-50 h-full">
                  {/* Pill */}
                  <span className="inline-block bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                    Our Mission
                  </span>

                  {/* Heading */}
                  <h2 className="text-3xl font-bold text-gray-900">Building Global Reputation <br/>Through Excellence</h2>

                  {/* Paragraph */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our mission is to build a global reputation through our team of exceptional agents who deliver outstanding service. We achieve this by staying true to our founding principle: forming lasting partnerships with our stakeholders.
                    <br /><br />
                    What sets us apart is clear: We combine market expertise with deep client understanding to create real value for our investors.
                  </p>
                </div>
              </div>

              {/* Right Column - Vision */}
              <div className="lg:col-span-6">
                <div className="flex flex-col items-start space-y-6 p-8 border border-gray-200 rounded-lg bg-gray-100 h-full">
                  {/* Pill */}
                  <span className="inline-block bg-white text-gray-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                    Our Vision
                  </span>

                  {/* Heading */}
                  <h2 className="text-3xl font-bold text-gray-900">Leading the High-End <br/>Property Market</h2>

                  {/* Paragraph */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We aim to lead the high-end property market by consistently delivering on our core strength: providing exceptional client-focused service, every single day. No empty promises - just consistent excellence that elevates industry standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section - Full Width */}
        <div className="w-full bg-gray-50 py-16">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900">Our Core Values</h2>
              </div>

              {/* Values Accordion */}
              <div className="max-w-3xl mx-auto">
                <div className="space-y-4">
                  {coreValues.map((value, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                    >
                      <button
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                        onClick={() => toggleAccordion(index)}
                      >
                        <span className="font-medium text-gray-900">{value.title}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            openIndex === index ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openIndex === index && (
                        <div className="px-6 py-4 bg-gray-50">
                          <p className="text-gray-600">{value.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Promise Section */}
        <div className="w-full py-16">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900">Our Promise</h2>
              </div>

              {/* Promise Text */}
              <div className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  In the luxury real estate market, trust is everything. That's why we're dedicated to becoming the most trusted name in the UAE's high-end property market. Our distinction is clear: we prioritize building lasting relationships over simply closing deals.
                  <br /><br />
                  When you work with us, you're gaining more than an advisor - you're partnering with a team that's genuinely invested in guiding you through your property journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 