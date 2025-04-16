'use client'

import Image from 'next/image'
import { useLanguage } from '../../context/LanguageContext'
import ClientLanguageSwitcher from '../../components/ClientLanguageSwitcher'
import { useEffect, useState } from 'react'

// Properly typed interface for Product
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
  images: string[]
}

interface ProductContentProps {
  product: Product
}

export default function ProductContent({ product }: ProductContentProps) {
  const { language } = useLanguage()
  const [activeImage, setActiveImage] = useState(0)
  
  // Improved loading state handling
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Only set loading to false when component mounts
    setIsLoading(false)
  }, [])

  // Better loading state
  if (isLoading) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <div className="animate-pulse text-blue-500">Loading...</div>
        <ClientLanguageSwitcher />
      </div>
    )
  }

  // Localized text for headings
  const translations = {
    origin: language === 'en' ? 'Origin' : 'Origen',
    description: language === 'en' ? 'Description' : 'Descripción',
    healthBenefits: language === 'en' ? 'Health Benefits' : 'Beneficios para la Salud'
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header with improved spacing and responsive design */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {product.name[language]}
        </h1>
        <ClientLanguageSwitcher />
      </div>

      {/* Improved image gallery with better responsiveness */}
      <div className="mb-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-4">
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <Image
              src={`/${product.images[activeImage]}`}
              alt={product.name[language]}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          </div>
        </div>
        
        {/* Improved thumbnail navigation */}
        {product.images.length > 1 && (
          <div className="flex justify-center gap-2 overflow-x-auto py-2 px-1">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`focus:outline-none transition duration-200 rounded-md overflow-hidden border-2 ${
                  activeImage === index ? 'border-blue-500 ring-2 ring-blue-300 ring-opacity-50' : 'border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <div className="w-16 h-16 relative">
                  <Image
                    src={`/${image}`}
                    alt={`${product.name[language]} - ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product information with improved layout and responsiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Origin and description */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-400">
            {translations.origin}
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            {product.origin[language]}
          </p>
          
          <h2 className="text-xl font-semibold mb-4 text-indigo-400">
            {translations.description}
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {product.description[language]}
          </p>
        </div>

        {/* Health benefits */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-400">
            {translations.healthBenefits}
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {product.health_benefits[language]}
          </p>
        </div>
      </div>
    </div>
  )
}