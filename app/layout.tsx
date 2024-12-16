import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from './providers';

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
    <html lang="en">
      <body>
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
}
