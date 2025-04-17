import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const productsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src/app/data/products-v2.json'), 'utf-8')
    ).products

    return NextResponse.json(productsData)
  } catch (error) {
    console.error('Error loading products:', error)
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
} 