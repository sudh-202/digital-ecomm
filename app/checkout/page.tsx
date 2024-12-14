'use client';

import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { toast } from 'sonner';
import { CreditCard } from '@/components/ui/credit-card';

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay securely with your card',
    icon: '💳'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: '🔒'
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Pay with Bitcoin, Ethereum, or other cryptocurrencies',
    icon: '₿'
  }
];

export default function CheckoutPage() {
  const { items } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Calculate total from items
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the payment processing
    toast.success('Payment processed successfully!');
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] dark:bg-[#111827] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        {item.image && (
                          <Image
                            src={`/api/images/${item.image.split('/').pop()}`}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                          <div className="text-2xl">
                            {method.icon}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {selectedPayment === 'card' && (
                  <CreditCard
                    cardNumber={formData.cardNumber}
                    cardHolder={`${formData.firstName} ${formData.lastName}`.trim()}
                    expiryDate={formData.expiryDate}
                    cvv={formData.cvv}
                    isFlipped={isCardFlipped}
                  />
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          className="bg-white/50 dark:bg-gray-800/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                          className="bg-white/50 dark:bg-gray-800/50"
                        />
                      </div>
                    </div>
                    
                    {selectedPayment === 'card' && (
                      <>
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                              handleInputChange('cardNumber', value);
                            }}
                            required
                            className="bg-white/50 dark:bg-gray-800/50 font-mono"
                            maxLength={16}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                const formatted = value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
                                handleInputChange('expiryDate', formatted);
                              }}
                              required
                              className="bg-white/50 dark:bg-gray-800/50"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              type="text"
                              maxLength={4}
                              value={formData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                              required
                              className="bg-white/50 dark:bg-gray-800/50"
                              onFocus={() => setIsCardFlipped(true)}
                              onBlur={() => setIsCardFlipped(false)}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="bg-white/50 dark:bg-gray-800/50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="bg-white/50 dark:bg-gray-800/50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                        className="bg-white/50 dark:bg-gray-800/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          required
                          className="bg-white/50 dark:bg-gray-800/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          required
                          className="bg-white/50 dark:bg-gray-800/50"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">
                    Pay ${total.toFixed(2)}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
