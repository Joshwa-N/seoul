export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  variants?: ProductVariant[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: Record<string, string>;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  color: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}
