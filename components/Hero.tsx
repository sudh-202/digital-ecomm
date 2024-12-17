"use client";

import { Button } from "./ui/button";
import GradientBackground from "./ui/gradient-background";
import CometEffect from "./ui/comet-effects";

const Hero = () => {
  return (
    <div className="relative w-full">
      <section className="relative lg:h-[65vh] flex items-start justify-between pt-24 px-6 md:px-10 overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Background Effects */}
        <GradientBackground />
        <CometEffect />

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto w-full md:mt-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold dark:text-white text-black mb-6">
                Discover Premium Digital Products
              </h1>
              <p className="text-lg md:text-xl dark:text-gray-200 text-gray-800 mb-8 max-w-2xl">
                Explore our curated collection of high-quality digital resources, templates, and educational content.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl">
                  Browse Products
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-blue-700 dark:border-white border-2 text-blue-700 dark:text-white font-semibold rounded-2xl">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Content - Stats */}
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {[
                { number: '1000+', label: 'Digital Products' },
                { number: '50K+', label: 'Happy Customers' },
                { number: '4.9', label: 'Average Rating' },
                { number: '24/7', label: 'Support Available' }
              ].map((stat, index) => (
                <div key={index} className="dark:bg-white/10 bg-gray-100 backdrop-blur-sm p-6 rounded-2xl text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.number}</div>
                  <div className="text-sm dark:text-gray-400 text-gray-700 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
