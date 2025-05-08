'use client';

import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const counterData = [
  {
    number: 2500,
    label: 'listings for sale'
  },
  {
    number: 1350,
    label: 'listings for rent'
  },
  {
    number: 900,
    label: 'property sold'
  },
  {
    number: 15,
    label: 'off plan'
  }
];

const Counter = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {counterData.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {inView ? (
                  <CountUp
                    end={item.number}
                    duration={2.5}
                    separator="," 
                    suffix="+"
                  />
                ) : '0'}
              </div>
              <div className="text-sm text-gray-900">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Counter; 