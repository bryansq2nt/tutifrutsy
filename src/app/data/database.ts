export interface Product {
  id: string; 
  name: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  origin: {
    es: string;
    en: string;
  };
  "Health Benefits": { 
    es: string;
    en: string;
  };
  "Best way to eat": { 
    es: string;
    en: string;
  };
}

import productsData from './database.json';

export async function getProduct(id: string): Promise<Product | null> {
  try {
    if (!productsData || !Array.isArray(productsData)) {
      console.error('Error: products.json structure is invalid or empty.');
      return null;
    }
    const product = productsData.find((product: Product) => product.id === id);
    return product ? product : null;
  } catch (error) {
    console.error(`Error getting product with id "${id}":`, error);
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    if (!productsData || !Array.isArray(productsData)) {
      console.error('Error: products.json structure is invalid or empty.');
      return [];
    }
    return productsData as Product[];
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}