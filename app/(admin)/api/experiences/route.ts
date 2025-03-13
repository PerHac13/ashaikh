import { validateCreateExperience } from './../../../../utils/validation';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Experience from '@/models/Experience';
import logger from '@/utils/logger';

// Set proper cache control
export const dynamic = 'force-dynamic';

// GET /api/experiences
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');
    const currentlyWorking = searchParams.get('currentlyWorking');
    const organization = searchParams.get('organization');
    const roleType = searchParams.get('roleType');
    
    // Build query
    const query: any = {};
    
    if (featured !== null) {
      query.featured = featured === 'true';
    }
    
    if (currentlyWorking !== null) {
      query.currentlyWorking = currentlyWorking === 'true';
    }
    
    if (organization) {
      query.organization = { $regex: organization, $options: 'i' };
    }
    
    if (roleType) {
      query.roleType = roleType;
    }
    
    const experiences = await Experience.find(query)
      .sort({ currentlyWorking: -1, startDate: -1, endDate: -1 });
    
    return NextResponse.json({ success: true, data: experiences });
  } catch (error) {
    console.error('Failed to fetch experiences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

// POST /api/experiences
export async function POST(request: NextRequest) {
  await dbConnect();
  logger.info('Create experience request received');
  try {
    
    const body = await request.json();
    const validateCreateExperienceResult = validateCreateExperience(body);
    if(!validateCreateExperienceResult.success) {
      logger.warn('Validation error', validateCreateExperienceResult.error.errors);
      return NextResponse.json(
        {
          success: false,
          message: validateCreateExperienceResult.error.errors[0].message,
        },
        { status: 400 }
      );
    };
    
    const experience = new Experience(
      validateCreateExperienceResult.data
    );
    await experience.save();
    
    return NextResponse.json(
      { success: true, data: experience },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}