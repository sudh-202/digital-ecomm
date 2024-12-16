'use client';

import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        {children}
        <Toaster richColors />
      </CartProvider>
    </ThemeProvider>
  );
}
