'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/app/context/LanguageContext'

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false) // Start unmuted by default
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { language } = useLanguage()

  // Initialize audio on component mount
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/music/background-music.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.5 // Set volume to 50%
    audioRef.current.muted = false // Ensure it's not muted
    
    // Try to autoplay immediately
    const attemptAutoplay = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play()
          setIsPlaying(true)
          console.log('Autoplay successful')
        }
      } catch (error) {
        console.log('Autoplay failed, waiting for user interaction:', error)
        // If autoplay fails, set up interaction listeners
        setupInteractionListeners()
      }
    }
    
    // Function to set up interaction listeners
    const setupInteractionListeners = () => {
      const handleInteraction = () => {
        if (audioRef.current && !isPlaying) {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true)
              // Remove event listeners after successful play
              document.removeEventListener('click', handleInteraction)
              document.removeEventListener('keydown', handleInteraction)
              document.removeEventListener('touchstart', handleInteraction)
            })
            .catch(error => {
              console.error('Play on interaction failed:', error)
            })
        }
      }
      
      // Add event listeners for user interaction
      document.addEventListener('click', handleInteraction)
      document.addEventListener('keydown', handleInteraction)
      document.addEventListener('touchstart', handleInteraction)
      
      // Return cleanup function
      return () => {
        document.removeEventListener('click', handleInteraction)
        document.removeEventListener('keydown', handleInteraction)
        document.removeEventListener('touchstart', handleInteraction)
      }
    }
    
    // Try to autoplay
    attemptAutoplay()
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch(error => {
          console.error('Play failed:', error)
        })
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
      <button
        onClick={togglePlay}
        className="text-orange-600 hover:text-orange-700 transition-colors"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
      
      <button
        onClick={toggleMute}
        className="text-orange-600 hover:text-orange-700 transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
      
      <span className="text-sm text-gray-700">
        {language === 'en' ? 'Background Music' : 'Música de Fondo'}
      </span>
    </div>
  )
} 