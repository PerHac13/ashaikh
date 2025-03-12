import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Session from '@/models/Session';
import logger from '@/utils/logger';

export async function POST(request: NextRequest) {
  await dbConnect();
  logger.info('Logout request received');

  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;
    
    if (sessionToken) {
      // Invalidate the session
      await Session.invalidateSession(sessionToken);
    }

    // Create response and clear session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    );

    // Clear session cookie
    response.cookies.delete('sessionToken');

    logger.info('Logout successful');
    return response;
  } catch (error) {
    logger.error('Logout failed', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Logout failed',
      },
      { status: 500 }
    );
  }
}