'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/app/context/LanguageContext'
import { Product } from '@/app/data/products'
import { useState } from 'react'

interface ProductContentProps {
  product: Product
}

export default function ProductView({ product }: ProductContentProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const defaultImage = '/images/default-image.png'
  const [activeTab, setActiveTab] = useState('description')

  // Translations for section titles
  const sectionTitles = {
    description: {
      en: 'Description',
      es: 'Descripción'
    },
    origin: {
      en: 'Origin',
      es: 'Origen'
    },
    healthBenefits: {
      en: 'Health Benefits',
      es: 'Beneficios para la Salud'
    },
    servingSuggestion: {
      en: 'Best way to eat',
      es: 'Mejor manera de comer'
    },
    preparationNote: {
      en: 'Preparation Note',
      es: 'Nota de Preparación'
    },
    season: {
      en: 'Season',
      es: 'Temporada'
    },
    chefFavorite: {
      en: "Chef's Favorite",
      es: 'Favorito del Chef'
    },
    sustainability: {
      en: 'Sustainability',
      es: 'Sostenibilidad'
    },
    customerQuote: {
      en: 'Customer Review',
      es: 'Reseña del Cliente'
    }
  }

  // Define available tabs based on product properties
  const availableTabs = [
    { id: 'description', label: sectionTitles.description[language] },
    { id: 'origin', label: sectionTitles.origin[language] },
    { id: 'healthBenefits', label: sectionTitles.healthBenefits[language] },
    { id: 'servingSuggestion', label: sectionTitles.servingSuggestion[language] },
    ...(product.preparation_note ? [{ id: 'preparationNote', label: sectionTitles.preparationNote[language] }] : []),
    ...(product.season ? [{ id: 'season', label: sectionTitles.season[language] }] : []),
    ...(product.chef_favorite ? [{ id: 'chefFavorite', label: sectionTitles.chefFavorite[language] }] : []),
    ...(product.sustainable ? [{ id: 'sustainability', label: sectionTitles.sustainability[language] }] : []),
    { id: 'customerQuote', label: sectionTitles.customerQuote[language] }
  ]

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return <p className="text-gray-600">{product.description[language]}</p>
      case 'origin':
        return <p className="text-gray-600">{product.origin[language]}</p>
      case 'healthBenefits':
        return <p className="text-gray-600">{product.health_benefits[language]}</p>
      case 'servingSuggestion':
        return <p className="text-gray-600">{product.serving_suggestion[language]}</p>
      case 'preparationNote':
        return product.preparation_note ? <p className="text-gray-600">{product.preparation_note[language]}</p> : null
      case 'season':
        return product.season ? <p className="text-gray-600">{product.season[language]}</p> : null
      case 'chefFavorite':
        return product.chef_favorite ? <p className="text-gray-600">{product.chef_favorite[language]}</p> : null
      case 'sustainability':
        return product.sustainable ? <p className="text-gray-600">{product.sustainable[language]}</p> : null
      case 'customerQuote':
        return <p className="text-gray-600 italic">{product.customer_quote[language]}</p>
      default:
        return <p className="text-gray-600">{product.description[language]}</p>
    }
  }

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
          
          {/* Tabbed Interface */}
          <div className="mt-6">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 overflow-x-auto pb-2" aria-label="Tabs">
                {availableTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {sectionTitles[activeTab as keyof typeof sectionTitles][language]}
              </h2>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 