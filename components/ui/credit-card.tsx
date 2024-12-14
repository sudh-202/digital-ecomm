'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface CreditCardProps {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  isFlipped: boolean;
}

export function CreditCard({ cardNumber, cardHolder, expiryDate, cvv, isFlipped }: CreditCardProps) {
  const formattedCardNumber = cardNumber
    .replace(/\s/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim();

  return (
    <div className="perspective-1000 w-full max-w-[400px] h-[220px] relative mx-auto my-8">
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-600 to-blue-900 text-white shadow-xl">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="h-12 w-16 relative">
                <Image
                  src="/chip.svg"
                  alt="Card Chip"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="text-2xl tracking-wider font-medium">
                {formattedCardNumber || '•••• •••• •••• ••••'}
              </div>
            </div>
            <div className="text-sm font-medium opacity-75">
              DEBIT
            </div>
          </div>
          <div className="absolute bottom-6 w-[calc(100%-3rem)] flex justify-between items-end">
            <div>
              <div className="text-xs opacity-75 mb-1">Card Holder</div>
              <div className="font-medium tracking-wider">
                {cardHolder || 'YOUR NAME'}
              </div>
            </div>
            <div>
              <div className="text-xs opacity-75 mb-1">Expires</div>
              <div className="font-medium tracking-wider">
                {expiryDate || 'MM/YY'}
              </div>
            </div>
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-xl rotate-y-180">
          <div className="h-12 bg-black/30 mt-6" />
          <div className="px-6 mt-8">
            <div className="bg-white/30 h-10 flex items-center justify-end px-4 rounded">
              <div className="font-mono">{cvv || '•••'}</div>
            </div>
            <div className="mt-4 text-xs opacity-75 text-center">
              This card is property of Your Bank. Misuse is criminal offense.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
