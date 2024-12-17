'use client';

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CartSidebar } from "./CartSidebar";
import { Button } from "./ui/button";
import { navLinks } from "@/constant";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { items, setIsOpen } = useCart();
  const [hasScrolled, setHasScrolled] = useState(false);
  const cartCount = items.length;
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        hasScrolled
          ? "bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 shadow-sm border-b dark:border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className={`text-2xl font-bold transition-colors duration-300 ${
              isDashboard || hasScrolled
                ? "text-foreground dark:text-white"
                : "text-foreground dark:text-white"
            }`}
          >
            <span className="text-blue-700">Digi</span>STORE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.route}
                href={link.route}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDashboard || hasScrolled
                    ? "text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white"
                    : "text-foreground/90 hover:text-foreground dark:text-gray-200 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className={`relative transition-colors duration-300 ${
                isDashboard || hasScrolled
                  ? "hover:bg-accent dark:hover:bg-gray-800"
                  : "hover:bg-white/10 dark:hover:bg-gray-800/50"
              }`}
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className={`h-5 w-5 transition-colors duration-300 ${
                isDashboard || hasScrolled
                  ? "text-foreground dark:text-white"
                  : "text-foreground dark:text-white"
              }`} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-700 flex items-center justify-center text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`transition-colors duration-300 ${
                    isDashboard || hasScrolled
                      ? "hover:bg-accent dark:hover:bg-gray-800"
                      : "hover:bg-white/10 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <Menu className={`h-5 w-5 transition-colors duration-300 ${
                    isDashboard || hasScrolled
                      ? "text-foreground dark:text-white"
                      : "text-foreground dark:text-white"
                  }`} />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[280px] bg-background dark:bg-gray-900">
                <SheetHeader>
                  <SheetTitle className="text-foreground dark:text-white">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col mt-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.route}
                      href={link.route}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white py-2 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <CartSidebar />
    </header>
  );
}
