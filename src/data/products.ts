import { products1 } from "./products1";
import { products2 } from "./products2";
import { products3 } from "./products3";
import { products4 } from "./products4";
import { products5 } from "./products5";

export interface Product {
  sku: number;
  name: string;
  model: string;
  regularPrice: number;
  salePrice: number;
  onSale: boolean;
  category: string;
  inStore: boolean;
  online: boolean;
  rating: number | null;
  reviewCount: number;
  color: string;
  url: string;
}

export const products: Product[] = [
  ...products1,
  ...products2,
  ...products3,
  ...products4,
  ...products5,
];
