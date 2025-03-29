"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import ResumeLink from "@/models/Resume";
import logger from "@/utils/logger";
import { resumeLinkSchema } from "@/utils/validation";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function getResumeLinks() {
  try {
    await dbConnect();

    const links = await ResumeLink.find().sort({ createdAt: -1 });

    return { links: JSON.parse(JSON.stringify(links)) };
  } catch (error) {
    logger.error("Failed to fetch resume links:", error);
    return { error: "Failed to fetch resume links" };
  }
}

export async function getActiveResumeLink() {
  try {
    await dbConnect();

    const link = await ResumeLink.findOne({ isActive: true });

    return { link: link ? JSON.parse(JSON.stringify(link)) : null };
  } catch (error) {
    logger.error("Failed to fetch active resume link:", error);
    return { error: "Failed to fetch active resume link" };
  }
}

export async function createResumeLink(linkData: FormData) {
  try {
    await dbConnect();
    const isAuthenticated = await auth();
    if (!isAuthenticated) {
      logger.error("Unauthorized");
      throw new Error("Unauthorized");
    }

    const name = linkData.get("name")?.toString();
    const url = linkData.get("url")?.toString();

    const result = await resumeLinkSchema.safeParse({ name, url });
    if (!result.success) {
      logger.error("Invalid resume link data:", result.error);
      return { error: "Invalid resume link data" };
    }

    const newLink = await ResumeLink.create({
      name: result.data.name,
      url: result.data.url,
      isActive: false,
    });
    revalidatePath("/resume");
    return { link: JSON.parse(JSON.stringify(newLink)) };
  } catch (error) {
    logger.error("Failed to create resume link:", error);
    return { error: "Failed to create resume link" };
  }
}

export async function updateResumeLink(id: string, linkData: FormData) {
  try {
    await dbConnect();
    const isAuthenticated = await auth();
    if (!isAuthenticated) {
      logger.error("Unauthorized");
      throw new Error("Unauthorized");
    }

    const name = linkData.get("name")?.toString();
    const url = linkData.get("url")?.toString();

    const result = await resumeLinkSchema.safeParse({ name, url });
    if (!result.success) {
      logger.error("Invalid resume link data:", result.error);
      return { error: "Invalid resume link data" };
    }

    const updatedLink = await ResumeLink.findByIdAndUpdate(
      id,
      {
        name: result.data.name,
        url: result.data.url,
      },
      { new: true }
    );
    if (!updatedLink) {
      return { error: "Resume link not found" };
    }
    revalidatePath("/resume");
    return { link: JSON.parse(JSON.stringify(updatedLink)) };
  } catch (error) {
    logger.error("Failed to update resume link:", error);
    return { error: "Failed to update resume link" };
  }
}

export async function deleteResumeLink(id: string) {
  await dbConnect();
  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) {
      logger.error("Unauthorized");
      throw new Error("Unauthorized");
    }
    const deletedLink = await ResumeLink.findByIdAndDelete(id);
    if (!deletedLink) {
      return { error: "Resume link not found" };
    }
    revalidatePath("/resume");
    return { success: true };
  } catch (error) {
    logger.error("Failed to delete resume link:", error);
    return { error: "Failed to delete resume link" };
  }
}

export async function setActiveResumeLink(id: string) {
  try {
    await dbConnect();
    const isAuthenticated = await auth();
    if (!isAuthenticated) {
      logger.error("Unauthorized");
      throw new Error("Unauthorized");
    }
    const activatedLink = await ResumeLink.setActiveLink(
      new mongoose.Types.ObjectId(id)
    );
    if (!activatedLink) {
      return { error: "Resume link not found" };
    }

    revalidatePath("/resume");
    return { link: JSON.parse(JSON.stringify(activatedLink)) };
  } catch (error) {
    logger.error("Failed to set active resume link:", error);
    return { error: "Failed to set active resume link" };
  }
}
