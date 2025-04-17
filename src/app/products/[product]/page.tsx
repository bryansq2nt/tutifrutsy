import { notFound } from 'next/navigation'
import ProductContent from './ProductContent'
import { Product } from '@/app/data/products'
import fs from 'fs'
import path from 'path'

export async function generateStaticParams() {
  const productsData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src/app/data/products.json'), 'utf-8')
  ).products

  return productsData.map((product: Product) => ({
    product: product.route_id,
  }))
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const productsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src/app/data/products.json'), 'utf-8')
    ).products

    const product = productsData.find((p: Product) => p.route_id === id)
    
    if (!product) {
      return null
    }
    
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

interface PageProps {
  params: Promise<{ product: string }>
}

export default async function ProductPage(props: PageProps) {
  const { product: productId } = await props.params
  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductContent product={product} />
      </div>
    </div>
  )
}