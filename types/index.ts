export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  highlights: string[];
  format: string | null;
  storage: string | null;
  image: string;
  mobileImage?: string;
  desktopImage?: string;
  createdAt: string;
  slug: string;
}

export type NewProduct = Omit<Product, 'id' | 'slug' | 'createdAt'>;
