"use client";

import React from "react";
import  Navbar  from "@/components/Navbar";

interface ProviderProps {
  children: React.ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Provider;
