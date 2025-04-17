'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/app/context/LanguageContext'
import type { Product } from '@/app/data/database'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language } = useLanguage()

  return (
    <Link href={`/items/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 w-full">
          <Image
            src={`/images/${product.id}.jpg`}
            alt={product.name[language]}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {product.name[language]}
          </h3>
          <p className="text-gray-600 line-clamp-2">
            {product.description[language]}
          </p>
        </div>
      </div>
    </Link>
  )
} 