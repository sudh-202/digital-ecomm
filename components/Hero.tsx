"use client";

import { Button } from "./ui/button";
import { useEffect, useRef } from 'react'

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Ensure video plays when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error)
      })
    }
  }, [])

  return (
    <div className="relative w-full">
      <section className="relative min-h-screen flex items-center justify-between pt-24 px-6 md:px-10 bg-background overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover opacity-90"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-poster.jpg"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 z-10" />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Discover Premium Digital Products
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
                Explore our curated collection of high-quality digital resources, templates, and educational content.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Browse Products
                </Button>
                <Button size="lg" variant="outline" className="">
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
                <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-400">{stat.number}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
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
