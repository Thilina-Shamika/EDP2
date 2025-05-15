import { Calculator, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Mortgage = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="rounded-lg h-full">
            <h3 className="text-[14px] text-gray-900">Let&apos;s Find the Mortgage That Fits You Best</h3>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3">Finding Dream Home Should Feel Effortless</h2>
            <p className="text-sm text-gray-900 mt-4">We know how important it is to get the right financing for your property investment. Our network of experienced mortgage advisors will work closely with you to find the most attractive rates and terms. Just like everything else we do, we keep it straightforward and focused on what matters to you.</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/mortgage-calculator">
                <button className="flex items-center gap-2 px-6 py-3 bg-[#393e46] text-white rounded-full hover:bg-gray-800 transition-colors">
                  <Calculator className="w-5 h-5" />
                  Mortgage Calculator
                </button>
              </Link>
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-colors">
                <CalendarDays className="w-5 h-5" />
                Schedule a Meeting
              </button>
            </div>
          </div>
          {/* Right Column */}
          <div className="relative h-[320px] md:h-full rounded-lg overflow-hidden">
            <Image 
              src="/images/mortgage.jpg"
              alt="Mortgage Services"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mortgage; 