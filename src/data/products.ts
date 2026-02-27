import { products1 } from "./products1";
import { products2 } from "./products2";
import { products3 } from "./products3";
import { products4 } from "./products4";
import { products5 } from "./products5";

export const products = [...products1, ...products2, ...products3, ...products4, ...products5] as const;
export type Product = typeof products[number];