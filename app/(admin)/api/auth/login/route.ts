import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Session from '@/models/Session';
import { validateLogin } from '@/utils/validation';
import logger from '@/utils/logger';

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
} as const;

const sessionCookieOptions = {
  ...cookieOptions,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

export async function POST(request: NextRequest) {
  await dbConnect();
  logger.info('Login request received');

  try {
    const body = await request.json();
    const validationResult = validateLogin(body);
    
    if (!validationResult.success) {
      logger.warn('Validation error', validationResult.error.errors);
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { username, password } = validationResult.data;
    const user = await User.findOne({ username });

    if (!user) {
      logger.warn('User not found', username);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 400 }
      );
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn('Invalid password', username);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 400 }
      );
    }

    // Create a new session
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ipAddress = request.ip || 'unknown';
      const userId = user._id as mongoose.Types.ObjectId;
    const session = await Session.createSession(
      userId,
      userAgent,
      ipAddress,
      24 * 60 * 60 * 1000 // 24 hours
    );

    // Create response with session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        userId: user._id,
      },
      { status: 200 }
    );

    // Set session cookie
    response.cookies.set('sessionToken', session.token, sessionCookieOptions);

    logger.info('Login successful', user._id);
    return response;
  } catch (error) {
    logger.error('Login failed', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Login failed',
      },
      { status: 500 }
    );
  }
}
