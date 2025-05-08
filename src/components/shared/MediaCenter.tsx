import Link from 'next/link';
import Image from 'next/image';

const MediaCenter = () => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col justify-center pr-[15px]">
            <div className="text-sm text-gray-600 mb-4">Media Center</div>
            <h2 className="text-4xl font-bold mb-6">
              Elite Destination Properties Media Center
            </h2>
            <p className="text-gray-600 mb-8">
              Discover our latest property showcases, market insights, and success stories right here. We&apos;re excited to share how we&apos;re helping investors like you find exceptional opportunities in the UAE&apos;s premium real estate market.
            </p>
            <div>
              <Link 
                href="/media-center" 
                className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Visit Media Center
              </Link>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="rounded-lg overflow-hidden mb-3 relative aspect-[4/3]">
                  <Image
                    src="/images/harbour.jpg"
                    alt="Upcoming Projects"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
                <p className="text-center text-sm font-medium uppercase">Upcoming Projects</p>
              </div>
              <div>
                <div className="rounded-lg overflow-hidden mb-3 relative aspect-[4/3]">
                  <Image
                    src="/images/harbour.jpg"
                    alt="Upcoming Projects"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
                <p className="text-center text-sm font-medium uppercase">Upcoming Projects</p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="rounded-lg overflow-hidden mb-3 relative aspect-[4/3]">
                  <Image
                    src="/images/harbour.jpg"
                    alt="Upcoming Projects"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
                <p className="text-center text-sm font-medium uppercase">Upcoming Projects</p>
              </div>
              <div>
                <div className="rounded-lg overflow-hidden mb-3 relative aspect-[4/3]">
                  <Image
                    src="/images/harbour.jpg"
                    alt="Upcoming Projects"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
                <p className="text-center text-sm font-medium uppercase">Upcoming Projects</p>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="rounded-lg overflow-hidden mb-3 relative aspect-[4/3]">
                  <Image
                    src="/images/harbour.jpg"
                    alt="Upcoming Projects"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
                <p className="text-center text-sm font-medium uppercase">Upcoming Projects</p>
              </div>
              <div>
                <div className="rounded-lg overflow-hidden mb-3 relative aspect-[4/3]">
                  <Image
                    src="/images/harbour.jpg"
                    alt="Upcoming Projects"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
                <p className="text-center text-sm font-medium uppercase">Upcoming Projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaCenter; 