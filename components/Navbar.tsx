"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CartSidebar } from "./CartSidebar";
import { Button } from "./ui/button";
import { navLinks } from "@/constant";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

export default function Navbar() {
  const { items, setIsOpen } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const [, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <span className="text-blue-700">Digi </span>STORE
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center justify-center flex-1 px-8">
            {navLinks.map((link) => (
              <Link
                key={link.route}
                href={link.route}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4"
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
              className="relative"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.route}
                      href={link.route}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
