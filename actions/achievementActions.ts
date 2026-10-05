"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import Achievement from "@/models/Achievement";
import { IAchievement } from "@/types/achievement";
import { auth } from "@/lib/auth";
import logger from "@/utils/logger";
import { achievementSchema, updateAchievementSchema } from "@/utils/validation";

export async function getAchievements(filter?: { featured?: boolean }) {
  await dbConnect();

  try {
    const query = filter?.featured !== undefined ? { featured: filter.featured } : {};
    const achievements = await Achievement.find(query)
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(achievements)) };
  } catch (error) {
    logger.error("Failed to fetch achievements:", error);
    return { success: false, data: [], error: "Failed to fetch achievements" };
  }
}

export async function getAchievementById(id: string) {
  await dbConnect();

  try {
    const achievement = await Achievement.findById(id).lean();
    if (!achievement) return { success: false, error: "Achievement not found" };

    return { success: true, data: JSON.parse(JSON.stringify(achievement)) };
  } catch (error) {
    logger.error(`Failed to fetch achievement ${id}:`, error);
    return { success: false, error: "Failed to fetch achievement" };
  }
}

export async function createAchievement(data: Partial<IAchievement>) {
  await dbConnect();

  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    const validated = achievementSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid achievement data" };
    }

    const achievement = await Achievement.create(validated.data);

    revalidatePath("/");
    revalidatePath("/admin/achievement");
    return { success: true, data: JSON.parse(JSON.stringify(achievement)) };
  } catch (error: any) {
    logger.error("Failed to create achievement:", error);
    return { success: false, error: error.message || "Failed to create achievement" };
  }
}

export async function updateAchievement(id: string, data: Partial<IAchievement>) {
  await dbConnect();

  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    const validated = updateAchievementSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid achievement data" };
    }

    const updated = await Achievement.findByIdAndUpdate(id, validated.data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return { success: false, error: "Achievement not found" };
    }

    revalidatePath("/");
    revalidatePath("/admin/achievement");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    logger.error(`Failed to update achievement ${id}:`, error);
    return { success: false, error: error.message || "Failed to update achievement" };
  }
}

export async function deleteAchievement(id: string) {
  await dbConnect();

  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    const deleted = await Achievement.findByIdAndDelete(id).lean();
    if (!deleted) {
      return { success: false, error: "Achievement not found" };
    }

    revalidatePath("/");
    revalidatePath("/admin/achievement");
    return { success: true };
  } catch (error: any) {
    logger.error(`Failed to delete achievement ${id}:`, error);
    return { success: false, error: error.message || "Failed to delete achievement" };
  }
}
