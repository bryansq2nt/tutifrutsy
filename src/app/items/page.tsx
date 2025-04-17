'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/app/context/LanguageContext'
import { getAllProducts } from '@/app/data/database'
import ProductCard from '@/app/components/ProductCard'
import type { Product } from '@/app/data/database'
import Image from 'next/image'
import SearchBar from '@/app/components/SearchBar'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts()
        // Randomize the order of products
        const randomizedProducts = [...allProducts].sort(() => Math.random() - 0.5)
        setProducts(randomizedProducts)
        setFilteredProducts(randomizedProducts)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products)
      return
    }

    const searchLower = searchTerm.toLowerCase()
    const filtered = products.filter(product => 
      product.name[language].toLowerCase().includes(searchLower) ||
      product.description[language].toLowerCase().includes(searchLower)
    )
    setFilteredProducts(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Tutifrutsy Logo"
            width={192}
            height={48}
            priority
          />
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-transparent bg-clip-text">
          {language === 'en' ? 'Our Products' : 'Nuestros Productos'}
        </h1>

        <SearchBar onSearch={handleSearch} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
} 