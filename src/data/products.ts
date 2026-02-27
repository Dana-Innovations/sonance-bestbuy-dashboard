export const products = [
  {"sku":3849012,"name":"Sonance - Sonamp 2-100 Amplifier","model":"SONAMP 2-100","regularPrice":990,"salePrice":742.99,"onSale":true,"category":"Power Amplifiers","inStore":true,"online":true,"rating":4.6,"reviewCount":7,"color":"Black","url":"https://api.bestbuy.com/click/-/3849012/pdp"}
] as const;
export type Product = typeof products[number];