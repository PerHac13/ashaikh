import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRateLimit = rateLimit.get(ip);

  if (userRateLimit && now > userRateLimit.resetTime) {
    rateLimit.delete(ip);
  }

  if (!userRateLimit) {
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (userRateLimit.count >= RATE_LIMIT) {
    return false;
  }

  userRateLimit.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    if (!body.username || !body.password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPasswordHash) {
      console.error("Admin credentials not properly configured");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    if (body.username !== adminUsername) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      body.password,
      adminPasswordHash
    );
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: body.username },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "2h" }
    );

    // Create the response
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    // Set the cookie
    cookies().set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
