'use client'

import Image from 'next/image'
import { useLanguage } from '../../context/LanguageContext'
import ClientLanguageSwitcher from '../../components/ClientLanguageSwitcher'
import { useEffect, useState } from 'react'
import Link from 'next/link'

// Enhanced Product interface to match products-v2.json
interface Product {
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
  season?: {
    es: string
    en: string
  }
  pairs_with?: string[]
  preparation_note?: {
    es: string
    en: string
  }
  sustainable?: {
    es: string
    en: string
  }
  chef_favorite?: {
    es: string
    en: string
  }
}

interface ProductContentV2Props {
  product: Product
}

export default function ProductContentV2({ product }: ProductContentV2Props) {
  const { language } = useLanguage()
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  useEffect(() => {
    setIsLoading(false)
  }, [])

  // Default image path
  const defaultImage = '/images/default-image.png'

  // Function to get image path with fallback
  const getImagePath = (imagePath: string | undefined) => {
    if (!imagePath) return defaultImage
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  }

  // Get the current image to display
  const getCurrentImage = () => {
    if (!product.images || product.images.length === 0) return defaultImage
    return getImagePath(product.images[activeImage])
  }

  // Translations
  const translations = {
    description: language === 'en' ? 'Description' : 'Descripción',
    healthBenefits: language === 'en' ? 'Health Benefits' : 'Beneficios para la Salud',
    servingSuggestions: language === 'en' ? 'Serving Suggestions' : 'Sugerencias de Servicio',
    customerQuotes: language === 'en' ? 'What Customers Say' : 'Lo Que Dicen Nuestros Clientes',
    pairsWith: language === 'en' ? 'Pairs Well With' : 'Combina Bien Con',
    backToProducts: language === 'en' ? 'Back to Products' : 'Volver a Productos',
    seasonal: language === 'en' ? 'Seasonal Product' : 'Producto de Temporada',
    sustainable: language === 'en' ? 'Sustainable' : 'Sostenible',
    chefFavorite: language === 'en' ? 'Chef\'s Favorite' : 'Favorito del Chef'
  }

  if (isLoading) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <div className="animate-pulse text-orange-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header with back button and language switcher */}
      <div className="flex justify-between items-center mb-8">
        <Link 
          href="/products" 
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
        >
          <span className="mr-2">←</span>
          {translations.backToProducts}
        </Link>
        <ClientLanguageSwitcher />
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] mb-12 rounded-2xl overflow-hidden">
        <Image
          src='/images/default-image.png'
          alt={product.name[language]}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {product.name[language]}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            {product.description[language]}
          </p>
        </div>
      </div>

      {/* Product Header */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-4 mb-6">
          {product.seasonal && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {translations.seasonal}
            </span>
          )}
          {product.sustainable && (
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {translations.sustainable}
            </span>
          )}
          {product.chef_favorite && (
            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {translations.chefFavorite}
            </span>
          )}
        </div>
        <p className="text-gray-700 text-lg">
          {product.origin[language]}
        </p>
      </div>

      {/* Tabbed Content - Moved up */}
      <div className="mb-12">
        <div className="flex border-b border-gray-200 mb-8">
          {['description', 'healthBenefits', 'servingSuggestions', 'customerQuotes'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {translations[tab as keyof typeof translations]}
            </button>
          ))}
        </div>

        <div className="prose max-w-none">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p className="text-gray-700">{product.description[language]}</p>
              {product.preparation_note && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-orange-800">{product.preparation_note[language]}</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'healthBenefits' && (
            <p className="text-gray-700">{product.health_benefits[language]}</p>
          )}
          {activeTab === 'servingSuggestions' && (
            <p className="text-gray-700">{product.serving_suggestion[language]}</p>
          )}
          {activeTab === 'customerQuotes' && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 italic">"{product.customer_quote[language]}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Pairs Well With Section */}
      {product.pairs_with && product.pairs_with.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
            {translations.pairsWith}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.pairs_with.map((pair) => (
              <div key={pair} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src='/images/default-image.png'
                    alt={pair}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {pair.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Gallery - Moved to bottom */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
          {language === 'en' ? 'Product Gallery' : 'Galería de Productos'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <Image
              src='/images/default-image.png'
              alt={product.name[language]}
              fill
              className="object-cover cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    activeImage === index ? 'ring-2 ring-orange-500' : ''
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src='/images/default-image.png'
                    alt={`${product.name[language]} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))
            ) : (
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src='/images/default-image.png'
                  alt={product.name[language]}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full aspect-square">
            <Image
              src='/images/default-image.png'
              alt={product.name[language]}
              fill
              className="object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-orange-500"
              onClick={() => setIsModalOpen(false)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 