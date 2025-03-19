import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import dbConnect from "./dbConnect";
import logger from "@/utils/logger";
import Session from "@/models/Session";
import User from "@/models/User";

export interface AuthSession {
  success: number;
}

export async function auth(): Promise<AuthSession | null> {
  logger.info("Checking for session token");
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("session_token");

    if (!token) {
      logger.error("No session token found");
      return { success: 1 };
    }

    const session = await Session.findOne(token);

    if (!session || !session.isValid) {
      logger.error("Invalid session token");
      return { success: 2 };
    }

    const user = await User.findById(session.userId);

    if (!user) {
      logger.error("User not found");
      return { success: 3 };
    }

    return {
      success: 0,
    };
  } catch (error) {
    logger.error("Error in auth", error);
    return { success: 4 };
  }
}
