import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }
    
    // Use Unsplash API to search for images
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY'}`
        }
      }
    )
    
    if (!response.ok) {
      console.error('Unsplash API error:', await response.text())
      return NextResponse.json({ error: 'Failed to fetch images from Unsplash' }, { status: 500 })
    }
    
    const data = await response.json()
    
    // Extract image URLs
    const images = data.results.map((photo: any) => ({
      url: photo.urls.regular,
      alt: photo.alt_description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html
    }))
    
    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error searching images:', error)
    return NextResponse.json({ error: 'Failed to search images' }, { status: 500 })
  }
} 