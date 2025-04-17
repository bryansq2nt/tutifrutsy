export interface Product {
  name: {
    es: string
    en: string
  }
  route_id: string
  description: {
    es: string
    en: string
  }
  origin: {
    es: string
    en: string
  }
  health_benefits: {
    es: string
    en: string
  }
  serving_suggestion: {
    es: string
    en: string
  }
  customer_quote: {
    es: string
    en: string
  }
  images?: string[] // Made optional with ?
  seasonal?: boolean
  season?: {
    es: string
    en: string
  }
  sustainable?: {
    es: string
    en: string
  }
  preparation_note?: {
    es: string
    en: string
  }
  chef_favorite?: {
    es: string
    en: string
  }
  pairs_well_with?: string[]
}

// Import the JSON data directly
import productsData from './products.json'

export async function getProduct(id: string): Promise<Product | null> {
  try {
    return productsData.products.find((product) => product.route_id === id) as Product | null
  } catch (error) {
    console.error('Error getting product:', error)
    return null
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    return productsData.products as Product[]
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}