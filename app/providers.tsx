'use client';

import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      storageKey="digital-ecomm-theme"
    >
      <CartProvider>
        {children}
        <Toaster />
      </CartProvider>
    </ThemeProvider>
  );
}
