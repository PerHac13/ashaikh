"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import Project, { IProject } from "@/models/Project";
import { auth } from "@/lib/auth";
import logger from "@/utils/logger";

export async function getProjects() {
  await dbConnect();

  try {
    const projects = await Project.find()
      .sort({ featured: -1, createdAt: -1 })
      .lean();
    return { success: true, data: JSON.parse(JSON.stringify(projects)) };
  } catch (error) {
    logger.error("Failed to fetch projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function getProjectById(id: string) {
  await dbConnect();

  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    const project = await Project.findById(id).lean();
    if (!project) throw new Error("Project not found");

    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    logger.error(`Failed to fetch project with ID ${id}:`, error);
    throw new Error("Failed to fetch project");
  }
}

export async function createProject(projectData: Omit<IProject, "_id">) {
  await dbConnect();

  try {
    const project = new Project(projectData);
    await project.save();
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error) {
    logger.error("Failed to create project:", error);
    throw new Error("Failed to create project");
  }
}

export async function updateProject(
  id: string,
  projectData: Partial<IProject>
) {
  await dbConnect();

  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    const updatedProject = await Project.findByIdAndUpdate(id, projectData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedProject) throw new Error("Project not found");

    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(updatedProject)) };
  } catch (error) {
    logger.error(`Failed to update project with ID ${id}:`, error);
    throw new Error("Failed to update project");
  }
}

export async function deleteProject(id: string) {
  await dbConnect();

  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    const deletedProject = await Project.findByIdAndDelete(id).lean();
    if (!deletedProject) throw new Error("Project not found");

    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    logger.error(`Failed to delete project with ID ${id}:`, error);
    throw new Error("Failed to delete project");
  }
}
