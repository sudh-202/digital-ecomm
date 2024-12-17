"use client";

import { motion } from "framer-motion";

const CometEffect = () => {
  const comets = [
    { top: "top-24", delay: 0 },
    { top: "top-40", delay: 1.6 },
    { top: "top-56", delay: 3.2 },
    { top: "top-72", delay: 4.8 },
    { top: "top-88", delay: 6.4 },
  ];

  return (
    <div className="absolute inset-0 z-10">
      {comets.map((comet, index) => (
        <motion.div
          key={index}
          initial={{ x: "-100%" }}
          animate={{ x: "100vw" }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: comet.delay,
            repeatDelay: 0
          }}
          className={`fixed ${comet.top} w-[200px] h-[1px]`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40 blur-[1px]" />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/20 blur-[2px]" />
        </motion.div>
      ))}
    </div>
  );
};

export default CometEffect;
