'use client';

import { partnerLogos } from '@/constant';

const LogoSlider = () => {
  return (
    <div className="w-full bg-[#fff5ed] py-10 overflow-hidden">
      <div className="flex animate-scroll">
        <div className="flex space-x-16 min-w-full">
          {partnerLogos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={logo}
                alt={`Partner Logo ${index + 1}`}
                className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-200"
              />
            </div>
          ))}
        </div>
        <div className="flex space-x-16 min-w-full">
          {partnerLogos.map((logo, index) => (
            <div key={`duplicate-${index}`} className="flex items-center justify-center">
              <img
                src={logo}
                alt={`Partner Logo ${index + 1}`}
                className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSlider;