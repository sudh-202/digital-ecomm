"use client";

import { Button } from "./ui/button";
// import dynamic from "next/dynamic";

// const SplineViewer = dynamic(() => import("./SplineViewer"), {
//   ssr: false,
//   loading: () => (
//     <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50" />
//   ),
// });

const Hero = () => {
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-between pt-24 px-6 md:px-10 bg-background overflow-hidden">
        {/* Spline Background */}
        <div className="absolute inset-0 z-0">
          {/* <SplineViewer
            url="https://prod.spline.design/PKzcNKmA00jv63hU/scene.splinecode"
            className="w-full h-full"
          /> */}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background pointer-events-none" />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto py-10 relative z-10">
          <div className="flex lg:flex-row flex-col justify-between items-end gap-8 max-w-7xl">
            <div className="flex flex-col gap-6">
              <p className="text-blue-500 dark:text-blue-400 text-lg md:text-xl font-medium">
                MORE THAN A WEBSITE BUILDER
              </p>

              <h2 className="text-4xl md:text-7xl font-bold text-foreground leading-tight relative">
                Your site should do
                <br />
                more than look good
                <div className="absolute -left-1 top-0 w-full h-full flex items-center pointer-events-none select-none opacity-30">
                  <span className="text-blue-500 dark:text-blue-400 transform translate-x-[2px]">
                    Your site should do
                    <br />
                    more than look good
                  </span>
                </div>
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl">
                As the first-ever website experience platform, Webflow lets
                marketers, designers, and developers come together to build,
                manage, and optimize web experiences that get results.
              </p>
            </div>
            <div className="flex justify-end lg:flex-row gap-4 mt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
                Start building
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                Contact sales →
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
