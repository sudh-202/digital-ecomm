"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCart, Menu } from "lucide-react";
import { navLinks } from "@/constant";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "@/context/cart-context";
import { CartSidebar } from "./CartSidebar";

const Navbar = () => {
  const { totalItems, setIsOpen } = useCart();

  return (
    <header className="fixed top-0 w-full z-50 bg-background border-b border-border">
      <nav className="container mx-auto px-6 md:px-10 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Digital<span className="text-blue-600">Ecomm</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.route}
                href={link.route}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="icon" 
              className="hidden md:flex relative"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.route}
                      href={link.route}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-10 relative"
                    onClick={() => setIsOpen(true)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      <CartSidebar />
    </header>
  );
};

export default Navbar;