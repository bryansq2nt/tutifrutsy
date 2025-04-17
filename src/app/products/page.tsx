'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts, Product } from '../data/products'
import ClientLanguageSwitcher from '../components/ClientLanguageSwitcher'
import { useLanguage } from '../context/LanguageContext'
import { useEffect, useState } from 'react'

export default function ProductsPage() {
  const { language } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts()
        setProducts(data)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-orange-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text hover:from-orange-600 hover:to-red-600"
          >
            Tutifrutsy
          </Link>
          <ClientLanguageSwitcher />
        </div>
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="mb-8">
              <Image 
                src="/images/Logo.png" 
                alt="Tutifrutsy Logo" 
                width={256}
                height={256}
                className="h-48 md:h-64 w-auto mx-auto"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-transparent bg-clip-text">
              {language === 'en' ? 'Our Products' : 'Nuestros Productos'}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link 
                href={`/products/${product.route_id}`} 
                key={product.route_id}
                className="block group"
              >
                <div className="bg-white border-2 border-orange-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:border-orange-400">
                  <div className="relative w-full h-56">
                    <Image
                      src="/images/default-image.png"
                      alt={product.name[language]}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 bg-gradient-to-b from-white to-orange-50">
                    <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">{product.name[language]}</h2>
                    <p className="text-gray-800 line-clamp-2">
                      {product.description[language]}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
} 