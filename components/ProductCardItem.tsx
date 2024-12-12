"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface ProductCardItemProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    user: {
      image: string;
      name: string;
    };
  };
}

const ProductCardItem = ({ product }: ProductCardItemProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-4 text-foreground line-clamp-1">
          {product.name}
        </h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden relative">
              <Image
                src={product.user.image}
                alt={product.user.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-muted-foreground text-sm">{product.user.name}</span>
          </div>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{product.price}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCardItem;