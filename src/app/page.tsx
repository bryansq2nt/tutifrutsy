'use client'

import Link from 'next/link'
import ClientLanguageSwitcher from './components/ClientLanguageSwitcher'
import { useLanguage } from './context/LanguageContext'

export default function Home() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with language switcher */}
      <header className="p-4 flex justify-end">
        <ClientLanguageSwitcher />
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">
            {language === 'en' ? 'Welcome to Tutifrutsy' : 'Bienvenido a Tutifrutsy'}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300">
            {language === 'en' 
              ? 'Discover the authentic taste of El Salvador! Our prepared fruits are an explosion of freshness and tradition that will transport you directly to the markets of San Salvador.'
              : '¡Descubre el auténtico sabor de El Salvador! Nuestras frutas preparadas son una explosión de frescura y tradición que te transportará directamente a los mercados de San Salvador.'}
          </p>
          
          <Link 
            href="/products" 
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            {language === 'en' ? 'Our Products' : 'Nuestros Productos'}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Tutifrutsy - {language === 'en' ? 'All rights reserved' : 'Todos los derechos reservados'}</p>
      </footer>
    </div>
  )
}
