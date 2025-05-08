import { Search } from 'lucide-react';
import OffPlanSlider from './OffPlanSlider';

const LatestLaunches = () => {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <div className="rounded-lg">
            <h2 className="text-xl text-gray-900">Be the first to explore the latest launches</h2>
          </div>

          {/* Right Column */}
          <div className="rounded-lg flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
              Search Properties
            </button>
          </div>
        </div>

        {/* Off-Plan Slider */}
        <OffPlanSlider />
      </div>
    </section>
  );
};

export default LatestLaunches; 