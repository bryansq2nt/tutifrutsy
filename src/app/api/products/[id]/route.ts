import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src/app/data/products-v2.json'), 'utf-8')
    ).products

    const product = productsData.find((p: any) => p.route_id === params.id)
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error loading product:', error)
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 })
  }
} 