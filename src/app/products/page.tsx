'use client'

import Link from 'next/link'
import Image from 'next/image'
import products from '../data/products.json'
import ClientLanguageSwitcher from '../components/ClientLanguageSwitcher'
import { useLanguage } from '../context/LanguageContext'

export default function ProductsPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link 
            href="/" 
            className="text-2xl font-bold text-blue-600 hover:text-blue-800"
          >
            Tutifrutsy
          </Link>
          <ClientLanguageSwitcher />
        </div>
        
        <h1 className="text-4xl font-bold mb-8">
          {language === 'en' ? 'Our Products' : 'Nuestros Productos'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.products.map((product) => (
            <Link 
              href={`/products/${product.route_id}`} 
              key={product.route_id}
              className="block group"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative w-full h-48">
                  <Image
                    src={`/${product.images[0]}`}
                    alt={product.name[language]}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.name[language]}</h2>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                    {product.description[language]}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {language === 'en' ? 'Origin: ' : 'Origen: '}{product.origin[language]}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 