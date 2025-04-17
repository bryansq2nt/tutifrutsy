import { notFound } from 'next/navigation'
import ProductContentV2 from './ProductContentV2'
import { Product } from '@/app/data/products-v2'

interface PageProps {
  params: {
    product: string
  }
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    // Use absolute URL with origin
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductPage({ params }: PageProps) {
  // In Next.js App Router, params is already resolved
  const productId = params.product
  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductContentV2 product={product} />
      </div>
    </div>
  )
} 