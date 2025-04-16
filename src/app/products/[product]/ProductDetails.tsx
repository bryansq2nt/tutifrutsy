'use client'

import { useLanguage } from '../../context/LanguageContext'
import ClientLanguageSwitcher from '../../components/ClientLanguageSwitcher'
import { useEffect, useState } from 'react'

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

type ProductDetailsProps = {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <ClientLanguageSwitcher />
  }

  return (
    <div>
      <ClientLanguageSwitcher />
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">
          {language === 'en' ? 'Health Benefits' : 'Beneficios para la Salud'}
        </h2>
        <p className="text-gray-600">
          {product.health_benefits[language]}
        </p>
      </div>
    </div>
  )
} 