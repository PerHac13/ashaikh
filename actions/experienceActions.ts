"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import Experience, { IExperience } from "@/models/Experience";
import { ExperienceFilter } from "@/types/filters";
import { auth } from "@/lib/auth";
import logger from "@/utils/logger";

export async function getExperiences(filter?: ExperienceFilter) {
  await dbConnect();

  const query: any = {};

  if (filter?.featured !== undefined) {
    query.featured = filter.featured;
  }

  if (filter?.currentlyWorking !== undefined) {
    query.currentlyWorking = filter.currentlyWorking;
  }

  if (filter?.organization) {
    query.organization = { $regex: filter.organization, $options: "i" };
  }

  if (filter?.roleType) {
    query.roleType = filter.roleType;
  }

  try {
    // Sort by currentlyWorking (desc), startDate (desc), and endDate (desc)
    const experiences = await Experience.find(query)
      .sort({ currentlyWorking: -1, startDate: -1, endDate: -1 })
      .lean();

    return JSON.parse(JSON.stringify(experiences));
  } catch (error) {
    logger.error("Failed to fetch experiences:", error);
    throw new Error("Failed to fetch experiences");
  }
}

export async function getExperienceById(id: string) {
  await dbConnect();
  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) {
      logger.error("Unauthorized");
      throw new Error("Unauthorized");
    }

    const experience = await Experience.findById(id).lean();
    if (!experience) {
      throw new Error("Experience not found");
    }
    return JSON.parse(JSON.stringify(experience));
  } catch (error) {
    logger.error(`Failed to fetch experience with ID ${id}:`, error);
    throw new Error("Failed to fetch experience");
  }
}

export async function createExperience(
  experienceData: Omit<IExperience, "_id">
) {
  await dbConnect();

  try {
    const experience = new Experience(experienceData);
    await experience.save();
    revalidatePath("/experience");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(experience)) };
  } catch (error) {
    logger.error("Failed to create experience:", error);
    throw new Error("Failed to create experience");
  }
}

export async function updateExperience(
  id: string,
  experienceData: Partial<IExperience>
) {
  try {
    await dbConnect();

    const isAuthenticated = await auth();
    if (!isAuthenticated) {
      logger.error("Unauthorized");
      throw new Error("Unauthorized");
    }

    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      experienceData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedExperience) {
      throw new Error("Experience not found");
    }

    revalidatePath("/experience");
    revalidatePath("/");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedExperience)),
    };
  } catch (error) {
    logger.error(`Failed to update experience with ID ${id}:`, error);
    throw new Error("Failed to update experience");
  }
}

export async function deleteExperience(id: string) {
  await dbConnect();

  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) {
      logger.error("Unauthorized");
      throw new Error("Unauthorized");
    }
    const deletedExperience = await Experience.findByIdAndDelete(id).lean();

    if (!deletedExperience) {
      throw new Error("Experience not found");
    }

    revalidatePath("/experience");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    logger.error(`Failed to delete experience with ID ${id}:`, error);
    throw new Error("Failed to delete experience");
  }
}
