// app/api/auth/check/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  try {
    const token = cookies().get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No authentication token found",
        },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return NextResponse.json({
      success: true,
      user: verified.payload,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
          error: error.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Authentication check failed",
      },
      { status: 401 }
    );
  }
}
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
