import { NextRequest, NextResponse } from 'next/server';
import { incrementVisitCount, getVisitCount } from '@/app/utils/visitCounter';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  // Await the params object before destructuring
  const { productId } = await params;
  
  // Get the current count without incrementing
  const count = getVisitCount(productId);
  
  // Return the current count
  return NextResponse.json({ count });
}

// This endpoint will increment the count
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    // Await the params object before destructuring
    const { productId } = await params;
    
    console.log('API: Incrementing visit count for product:', productId);
    
    // Increment the visit count
    const count = incrementVisitCount(productId);
    
    console.log('API: New count after increment:', count);
    
    // Return the updated count
    return NextResponse.json({ count });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to increment visit count' }, { status: 500 });
  }
} 