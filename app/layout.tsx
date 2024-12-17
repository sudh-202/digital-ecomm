import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from './providers';
import { PurchasedProvider } from "@/context/purchased-context";

export const metadata: Metadata = {
  title: "Digital E-commerce",
  description: "Digital E-commerce Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <PurchasedProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <Toaster />
                <main className="flex-1">
                  {children}
                </main>
                <Footer/>
              </div>
            </CartProvider>
          </PurchasedProvider>
        </Providers>
      </body>
    </html>
  );
}
