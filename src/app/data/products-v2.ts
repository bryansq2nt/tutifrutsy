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
  images: string[]
  seasonal?: boolean
  sustainable?: {
    es: string
    en: string
  }
  pairs_well_with?: string[]
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const products = await getAllProducts()
    return products.find(product => product.route_id === id) || null
  } catch (error) {
    console.error('Error getting product:', error)
    return null
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    // Use absolute URL with origin
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
} 