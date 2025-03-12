import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Session from '@/models/Session';
import logger from '@/utils/logger';

export async function GET(request: NextRequest) {
  await dbConnect();
  logger.info('Session check request received');

  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;

    if (!sessionToken) {
      logger.warn('No session token provided');
      return NextResponse.json(
        {
          success: false,
          message: 'No active session',
          isValid: false,
        },
        { status: 401 }
      );
    }

    // Find session by token
    const session = await Session.findByToken(sessionToken);

    if (!session) {
      logger.warn('Invalid or expired session');
      const response = NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired session',
          isValid: false,
        },
        { status: 401 }
      );
      
      response.cookies.delete('sessionToken');
      return response;
    }

    // Find user associated with session
    const user = await User.findById(session.userId);

    if (!user) {
      logger.warn('User not found for session');
      const response = NextResponse.json(
        {
          success: false,
          message: 'User not found',
          isValid: false,
        },
        { status: 401 }
      );
      
      response.cookies.delete('sessionToken');
      await Session.invalidateSession(sessionToken);
      return response;
    }

    // Session is valid
    return NextResponse.json(
      {
        success: true,
        message: 'Session is valid',
        isValid: true,
        userId: user._id,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Session check failed', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid session',
        isValid: false,
      },
      { status: 401 }
    );
  }
}
