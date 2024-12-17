"use client";

const GradientBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Center container for gradient animations */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]">
        {/* Rotating gradient circle */}
        <div className="absolute inset-0">
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 dark:opacity-90 blur-3xl animate-rotate-gradient" />
        </div>
        
        {/* Revolving gradient circle */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-75 dark:opacity-90 blur-2xl animate-revolve-ellipse" />
        </div>
      </div>
      
      {/* Overlay to blend with background */}
      <div className="absolute inset-0 bg-gray-50/80 dark:bg-gray-900/80" />
    </div>
  );
};

export default GradientBackground;
