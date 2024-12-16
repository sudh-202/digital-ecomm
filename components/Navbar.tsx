"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { ShoppingCart, Menu, UserCog, LogIn } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
import { clsx } from "clsx";

export default function Navbar() {
  const { items, setIsOpen } = useCart();
  const { user } = useAuth();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const [, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

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
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        hasScrolled
          ? "bg-[#F9FAFB] dark:bg-[#111827] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold dark:text-white"
          >
            <span className="text-blue-700">Digi </span>STORE
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center justify-center flex-1 px-4 lg:px-8">
            {navLinks.map((link) => (
              <Link
                key={link.route}
                href={link.route}
                className="text-md font-medium text-muted-foreground hover:text-foreground transition-colors px-4 dark:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 ">
            <ThemeToggle />

            {user?.role === "admin" ? (
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 sm:w-10 sm:h-10"
                >
                  <UserCog className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 dark:text-white text-black  group-hover:text-gray-500" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 sm:w-10 sm:h-10"
                >
                  <LogIn className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 dark:text-white text-black group-hover:text-gray-500" />
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative w-9 h-9 sm:w-10 sm:h-10"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 dark:text-white text-black group-hover:text-gray-500" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-blue-700 flex items-center justify-center text-[10px] sm:text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 sm:w-10 sm:h-10"
                >
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.route}
                      href={link.route}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 -mx-2 rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <CartSidebar />
    </header>
  );
}
