import Image from "next/image";

const PremiumProjects = () => {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* First Row - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Left Column */}
          <div className="rounded-lg h-full flex flex-col justify-end">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Our Premium Projects
              </h3>
              <h2 className="text-5xl font-bold text-gray-900 mt-3">
                Premium Properties in&apos; Premium Location
              </h2>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="rounded-lg h-full flex flex-col justify-end">
            <div>
              <p className="text-gray-600 text-sm leading-relaxed">
              You&apos;ll find our carefully chosen properties in the best locations across the UAE. Each home offers something special - from stunning designs to beautiful living spaces. More than just properties, we create communities where life feels truly special, all taken care of by our dedicated team who&apos;s always there when you need them.              </p>
              <button className="mt-6 px-6 py-3 border border-gray-900 rounded-full text-gray-900 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors">
                See All Premium Projects
              </button>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Large Project */}
          <div className="relative h-[400px] rounded-lg overflow-hidden group">
            <Image
              src="/images/harbour.jpg"
              alt="EXPO LIVING PROJECT"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-[5px] left-[5px] right-[5px] bg-black/40 backdrop-blur-md px-4 py-3 rounded-lg">
              <h3 className="text-[14px] font-bold text-white">EXPO LIVING PROJECT</h3>
            </div>
          </div>

          {/* Right Column - Stacked Projects */}
          <div className="flex flex-col gap-4 h-[400px]">
            {/* Top Project */}
            <div className="relative h-[192px] rounded-lg overflow-hidden group">
              <Image
                src="/images/heights.png"
                alt="THE HEIGHTS COUNTRY CLUB & WELLNESS"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-[5px] left-[5px] right-[5px] bg-black/40 backdrop-blur-md px-4 py-3 rounded-lg">
                <h3 className="text-[14px] font-bold text-white">THE HEIGHTS COUNTRY CLUB & WELLNESS</h3>
              </div>
            </div>

            {/* Bottom Row - Two Projects */}
            <div className="grid grid-cols-2 gap-4 h-[192px]">
              {/* Bottom Left Project */}
              <div className="relative rounded-lg overflow-hidden group">
                <Image
                  src="/images/creek.png"
                  alt="DUBAI CREEK HARBOR"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-[5px] left-[5px] right-[5px] bg-black/40 backdrop-blur-md px-4 py-3 rounded-lg">
                  <h3 className="text-[14px] font-bold text-white">DUBAI CREEK HARBOR</h3>
                </div>
              </div>

              {/* Bottom Right Project */}
              <div className="relative rounded-lg overflow-hidden group">
                <Image
                  src="/images/arabian.png"
                  alt="ARABIAN RANCHES"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-[5px] left-[5px] right-[5px] bg-black/40 backdrop-blur-md px-4 py-3 rounded-lg">
                  <h3 className="text-[14px] font-bold text-white">ARABIAN RANCHES</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumProjects; 