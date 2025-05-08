import Image from 'next/image';
import Link from 'next/link';

const FullWidthSection = () => {
  return (
    <section className="w-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Column */}
        <div className="relative h-[350px] md:h-auto min-h-[300px]">
          <Image
            src="/images/fullwidth.jpeg"
            alt="Property Image"
            fill
            className="object-cover"
            priority={false}
          />
        </div>

        {/* Right Column */}
        <div className="h-full bg-[#393e46] py-16 px-6 md:py-24 md:px-12 flex flex-col justify-center">
          <h3 className="text-[14px] text-white">List your property with us</h3>
          <h2 className="text-4xl font-bold text-white mt-4 leading-tight">
            Unlock Your <br />Property&apos;s Value
          </h2>
          <p className="text-white/80 mt-6 text-sm max-w-lg">
            Want to know what your property could be worth? Let&apos;s talk. Our in-depth understanding of the market, combined with our connections to serious buyers and premium tenants looking for Dubai properties, means we can help you get the most from your investment. Just like every successful partnership we build, we&apos;ll guide you through the process with care and expertise.
          </p>
          <Link href="/list-property" className="w-fit">
            <button className="mt-8 px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors">
              List your Property
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FullWidthSection; 