"use client";

import Image from "next/image";
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
      <section className="relative min-h-screen flex items-center justify-between pt-24 px-6 md:px-10 overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Gradient Background */}
        <div className="absolute inset-0 z-0">
          {/* Rotating and revolving gradient circles */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 dark:opacity-90 blur-3xl animate-rotate-gradient" />
          </div>
          <div className="absolute left-1/2 top-1/2 w-[500px] h-[500px] animate-revolve-ellipse">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-75 dark:opacity-90 blur-2xl animate-rotate-gradient" />
          </div>
          
          {/* Comet Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* First Comet */}
            <div className="absolute top-1/4 w-[150px] h-[3px] animate-comet">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent dark:via-blue-300 opacity-70" />
              <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-blue-400 dark:bg-blue-300 blur-[2px]" />
              <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full bg-blue-400/30 dark:bg-blue-300/30 blur-[4px]" />
            </div>
            
            {/* Second Comet (delayed) */}
            <div className="absolute top-2/3 w-[150px] h-[3px] animate-comet [animation-delay:4s]">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-purple-400 to-transparent dark:via-purple-300 opacity-70" />
              <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-400 dark:bg-purple-300 blur-[2px]" />
              <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full bg-purple-400/30 dark:bg-purple-300/30 blur-[4px]" />
            </div>
          </div>
          
          {/* Overlay to blend with background */}
          <div className="absolute inset-0 bg-gray-50/80 dark:bg-gray-900/80" />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto w-full">
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
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Browse Products
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-blue-700 dark:border-white border-2 text-blue-700 dark:text-white font-semibold">
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
