'use client'

import Link from 'next/link'
import ClientLanguageSwitcher from './components/ClientLanguageSwitcher'
import { useLanguage } from './context/LanguageContext'

export default function Home() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white">
      {/* Header with language switcher */}
      <header className="p-4 flex justify-end">
        <ClientLanguageSwitcher />
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-3xl">
          <div className="mb-8">
            <img 
              src="/images/Logo.png" 
              alt="Tutifrutsy Logo" 
              className="h-48 md:h-64 w-auto mx-auto"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-transparent bg-clip-text">
            {language === 'en' ? 'Welcome to Tutifrutsy' : 'Bienvenido a Tutifrutsy'}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-800">
            {language === 'en' 
              ? 'Discover the authentic taste of El Salvador! Our prepared fruits are an explosion of freshness and tradition that will transport you directly to the markets of Sonsonate and Ahuachapan.'
              : '¡Descubre el auténtico sabor de El Salvador! Nuestras frutas preparadas son una explosión de frescura y tradición que te transportará directamente a los mercados de Sonsonate y Ahuachapan.'}
          </p>
          
          <Link 
            href="/products" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-full text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {language === 'en' ? 'Our Products' : 'Nuestros Productos'}
          </Link>
        </div>
      </main>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-transparent bg-clip-text">
            {language === 'en' ? 'Our Story' : 'Nuestra Historia'}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-lg text-gray-800">
                {language === 'en' 
                  ? "Since 2015, Tutifrutsy has been a labor of love for our family. What began as a small family venture has grown into a beloved tradition, bringing the authentic flavors of El Salvador to tables across the nation."
                  : "Desde 2015, Tutifrutsy ha sido un trabajo de amor para nuestra familia. Lo que comenzó como una pequeña empresa familiar se ha convertido en una tradición querida, llevando los sabores auténticos de El Salvador a mesas en todo el país."}
              </p>
              <p className="text-lg text-gray-800">
                {language === 'en'
                  ? "Every fruit we prepare carries with it the warmth of family gatherings, the wisdom of generations, and the passion for preserving our cultural heritage. We take pride in selecting the finest, freshest ingredients, just as our ancestors did in the vibrant markets of Sonsonate and Ahuachapan."
                  : "Cada fruta que preparamos lleva consigo el calor de las reuniones familiares, la sabiduría de generaciones y la pasión por preservar nuestra herencia cultural. Nos enorgullece seleccionar los ingredientes más finos y frescos, tal como lo hacían nuestros antepasados en los vibrantes mercados de Sonsonate y Ahuachapan."}
              </p>
              <p className="text-lg text-gray-800">
                {language === 'en'
                  ? "Today, we continue to serve our community with the same dedication and love that inspired us to start this journey. Every bite is a taste of tradition, every serving a celebration of family values."
                  : "Hoy, seguimos sirviendo a nuestra comunidad con la misma dedicación y amor que nos inspiró a comenzar este viaje. Cada bocado es un sabor de tradición, cada porción una celebración de los valores familiares."}
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg shadow-xl border-2 border-orange-200">
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
                {language === 'en' ? 'Why Choose Us?' : '¿Por Qué Elegirnos?'}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span className="text-gray-800">
                    {language === 'en' ? 'Family-owned since 2015' : 'Empresa familiar desde 2015'}
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span className="text-gray-800">
                    {language === 'en' ? 'Authentic Salvadoran recipes' : 'Recetas auténticas salvadoreñas'}
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span className="text-gray-800">
                    {language === 'en' ? 'Fresh, quality ingredients' : 'Ingredientes frescos y de calidad'}
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span className="text-gray-800">
                    {language === 'en' ? 'Made with love and tradition' : 'Hecho con amor y tradición'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-600 text-sm bg-white border-t border-orange-100">
        <p>© {new Date().getFullYear()} Tutifrutsy - {language === 'en' ? 'All rights reserved' : 'Todos los derechos reservados'} || Powered by Mutech Business</p>
      </footer>
    </div>
  )
}
