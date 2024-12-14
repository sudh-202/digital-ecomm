'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export function CartSidebar() {
  const { isOpen, setIsOpen, items, removeFromCart, updateQuantity } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({items.length} items)</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="relative h-16 w-16">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">${item.price}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 ? (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between text-lg font-semibold ">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button 
              className="w-full bg-blue-700 hover:bg-blue-800" 
              size="lg"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
