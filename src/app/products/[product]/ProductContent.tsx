'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/app/context/LanguageContext'
import { Product } from '@/app/data/products'

interface ProductContentProps {
  product: Product
}

export default function ProductContent({ product }: ProductContentProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const defaultImage = '/images/default-image.png'

 

  


  return (
    <div className="space-y-8">
      {/* Header with Back Button and Language Switch */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {language === 'en' ? 'Back to Products' : 'Volver a Productos'}
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={defaultImage}
              alt={product.name[language]}
              fill
              className="object-cover"
              priority
            />
          </div>
          
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name[language]}</h1>
          <p className="text-gray-600">{product.description[language]}</p>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Origin</h2>
              <p className="text-gray-600">{product.origin[language]}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">Health Benefits</h2>
              <p className="text-gray-600">{product.health_benefits[language]}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">Serving Suggestion</h2>
              <p className="text-gray-600">{product.serving_suggestion[language]}</p>
            </div>

            {product.preparation_note && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Preparation Note</h2>
                <p className="text-gray-600">{product.preparation_note[language]}</p>
              </div>
            )}

            {product.season && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Season</h2>
                <p className="text-gray-600">{product.season[language]}</p>
              </div>
            )}

            {product.chef_favorite && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Chef&apos;s Favorite</h2>
                <p className="text-gray-600">{product.chef_favorite[language]}</p>
              </div>
            )}

            {product.sustainable && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Sustainability</h2>
                <p className="text-gray-600">{product.sustainable[language]}</p>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-gray-900">Customer Quote</h2>
              <p className="text-gray-600 italic">{product.customer_quote[language]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 