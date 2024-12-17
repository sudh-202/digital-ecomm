"use client";

import { useCart } from "@/context/cart-context";
import { usePurchased } from "@/context/purchased-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { CreditCard } from "@/components/ui/credit-card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    description: "Pay securely with your card",
    icon: "💳"
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Pay with your PayPal account",
    icon: "🔒"
  },
  {
    id: "razorpay",
    name: "Razorpay",
    description: "UPI, Cards, NetBanking",
    icon: "₹"
  }
];

const CheckoutPage = () => {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { addPurchasedItems } = usePurchased();
  const [mounted, setMounted] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    holder: "",
    expiry: "",
    cvv: ""
  });

  // Calculate total from items
  const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePayment = async () => {
    // Simulate payment processing
    toast.loading("Processing payment...");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success
    toast.success("Payment successful! Redirecting to downloads...");
    
    // Save purchased items
    const purchasedItems = items.map(item => ({
      id: item.id.toString(),
      name: item.name,
      description: "Your purchased digital product",
      downloadUrl: `/data/downloads/${item.id}`,
      purchaseDate: new Date().toISOString()
    }));
    
    // Add to purchased context
    addPurchasedItems(purchasedItems);
    
    // Clear cart
    clearCart();
    
    // Redirect to downloads page
    setTimeout(() => {
      router.push("/dashboard/downloads");
    }, 1500);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold dark:text-white">Payment Method</CardTitle>
                <CardDescription className="dark:text-gray-300">Choose how you want to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedMethod}
                  onValueChange={setSelectedMethod}
                  className="space-y-4"
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label
                        htmlFor={method.id}
                        className="flex flex-1 items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="font-medium dark:text-white">{method.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {method.description}
                          </div>
                        </div>
                        <span className="text-2xl">{method.icon}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {selectedMethod === "card" && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold dark:text-white">Card Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CreditCard
                    cardNumber={cardDetails.number}
                    cardHolder={cardDetails.holder}
                    expiryDate={cardDetails.expiry}
                    cvv={cardDetails.cvv}
                    isFlipped={isFlipped}
                  />
                  <div className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="cardNumber" className="dark:text-white">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardHolder" className="dark:text-white">Card Holder</Label>
                      <Input
                        id="cardHolder"
                        value={cardDetails.holder}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, holder: e.target.value }))}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        placeholder="JOHN DOE"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="dark:text-white">Expiry Date</Label>
                        <Input
                          id="expiry"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="dark:text-white">CVV</Label>
                        <Input
                          id="cvv"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="dark:bg-gray-800 dark:border-gray-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold dark:text-white">Order Summary</CardTitle>
                <CardDescription className="dark:text-gray-300">{items.length} items in cart</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between dark:text-white">
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="flex justify-between font-bold dark:text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handlePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Pay ${total.toFixed(2)}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
