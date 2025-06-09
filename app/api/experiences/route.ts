import { NextRequest, NextResponse } from 'next/server';
import { experiencesApi } from '@/lib/api/experiences';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      category: searchParams.get('category') || undefined,
      location: searchParams.get('location') || undefined,
      search: searchParams.get('search') || undefined,
      priceRange: searchParams.get('priceMin') && searchParams.get('priceMax') 
        ? [parseInt(searchParams.get('priceMin')!), parseInt(searchParams.get('priceMax')!)] as [number, number]
        : undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined
    };

    const experiences = await experiencesApi.getExperiences(filters);
    
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const experienceData = await request.json();
    
    // TODO: Add authentication middleware to get user ID
    // For now, we'll expect host_id to be provided in the request
    
    const experience = await experiencesApi.createExperience(experienceData);
    
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}