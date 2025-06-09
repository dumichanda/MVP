import { NextRequest, NextResponse } from 'next/server';
import { experiencesApi } from '@/lib/api/experiences';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const experience = await experiencesApi.getExperience(params.id);
    
    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}