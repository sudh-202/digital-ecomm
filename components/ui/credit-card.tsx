"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CreditCardProps {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  isFlipped: boolean;
}

export const CreditCard = ({
  cardNumber,
  cardHolder,
  expiryDate,
  cvv,
  isFlipped,
}: CreditCardProps) => {
  const formatCardNumber = (number: string) => {
    const groups = number.match(/.{1,4}/g) || [];
    return groups.join(" ");
  };

  return (
    <div className="perspective-1000 relative h-56 w-full">
      <motion.div
        className={cn(
          "absolute inset-0 rounded-xl transition-transform duration-500",
          "bg-gradient-to-br from-violet-500 to-purple-500"
        )}
        initial={false}
        animate={{ rotateY: isFlipped ? "180deg" : "0deg" }}
      >
        {/* Front of card */}
        <div className={cn("absolute inset-0 p-6", isFlipped ? "invisible" : "visible")}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start">
              <div className="text-xl font-bold text-white">Digital Bank</div>
              <div className="w-12 h-12">
                <svg viewBox="0 0 24 24" className="text-white">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="text-2xl font-mono tracking-wider text-white">
                {formatCardNumber(cardNumber.padEnd(16, "•"))}
              </div>
            </div>
            <div className="flex justify-between items-end text-white">
              <div>
                <div className="text-xs opacity-75">Card Holder</div>
                <div className="font-medium">{cardHolder || "YOUR NAME"}</div>
              </div>
              <div>
                <div className="text-xs opacity-75">Expires</div>
                <div className="font-medium">{expiryDate || "MM/YY"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 p-6 rotate-y-180",
            isFlipped ? "visible" : "invisible"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="h-12 bg-black/50 -mx-6 mb-4" />
            <div className="flex items-center justify-end space-x-2">
              <div className="flex-1 h-8 bg-white/80 rounded" />
              <div className="font-mono text-white">{cvv || "•••"}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
