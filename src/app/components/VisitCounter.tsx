'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/app/context/LanguageContext'

interface VisitCounterProps {
  productId: string;
}

export default function VisitCounter({ productId }: VisitCounterProps) {
  const [visitCount, setVisitCount] = useState<number>(0)
  const { language } = useLanguage()

  useEffect(() => {
    // Function to get and increment the visit count using localStorage
    const updateVisitCount = () => {
      try {
        // Get all visit data from localStorage
        const visitDataStr = localStorage.getItem('productVisits') || '{}'
        const visitData = JSON.parse(visitDataStr)
        
        // Initialize if this product hasn't been visited before
        if (!visitData[productId]) {
          visitData[productId] = {
            count: 0,
            lastVisited: new Date().toISOString()
          }
        }
        
        // Always increment the count for testing purposes
        visitData[productId].count += 1
        visitData[productId].lastVisited = new Date().toISOString()
        console.log(`Incrementing visit count for ${productId} to ${visitData[productId].count}`)
        
        // Save the updated data back to localStorage
        localStorage.setItem('productVisits', JSON.stringify(visitData))
        
        // Update the state with the current count
        setVisitCount(visitData[productId].count)
        
        // Log the current state of localStorage for debugging
        console.log('Current localStorage data:', localStorage.getItem('productVisits'))
      } catch (error) {
        console.error('Error updating visit count:', error)
      }
    }
    
    // Run the update function
    updateVisitCount()
  }, [productId])

  return (
    <div className="text-sm text-gray-500 mt-2">
      {language === 'en' 
        ? `${visitCount} ${visitCount === 1 ? 'visit' : 'visits'} to this product` 
        : `${visitCount} ${visitCount === 1 ? 'visita' : 'visitas'} a este producto`}
    </div>
  )
} 