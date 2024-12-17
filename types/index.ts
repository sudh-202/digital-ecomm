export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  highlights: string[];
  format: string;
  storage: string;
  image: string;
  mobileImage: string | null;
  desktopImage: string | null;
  userId: number;
  createdAt: string;
  slug: string;
}

export type NewProduct = Omit<Product, 'id' | 'createdAt' | 'slug'>;
