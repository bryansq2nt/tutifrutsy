import Link from 'next/link'
import products from '../../data/products.json'
import ProductContent from './ProductContent'
import { use } from 'react'

type Product = {
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
  images: string[]
}

// Updated PageProps type to match Next.js 15 requirements
type PageProps = {
  params: Promise<{
    product: string
  }>
}

export default function ProductPage({ params }: PageProps) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params)
  const productId = unwrappedParams.product
  
  // Find the product using the unwrapped product ID
  const product = products.products.find((p: Product) => p.route_id === productId)

  if (!product) {
    // Redirect to products page if product not found
    return <div>Product not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/products" className="text-blue-400 hover:text-blue-300">
            ← Back to Products
          </Link>
        </div>
        <ProductContent product={product} />
      </div>
    </div>
  )
} 