"use server";

import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import ResumeLink from "@/models/Resume";
import Achievement from "@/models/Achievement";
import Blog from "@/models/Blog";
import logger from "@/utils/logger";

export interface AnalyticsSummary {
  projects: {
    total: number;
    featured: number;
    completed: number;
  };
  experiences: {
    total: number;
    current: number;
  };
  resumes: {
    total: number;
    activeName: string;
    activeSlug: string;
  };
  achievements: {
    total: number;
    featured: number;
    categories: Record<string, number>;
  };
  blogs: {
    total: number;
    seriesCount: number;
    featured: number;
    platforms: Record<string, number>;
  };
  lastUpdated: string;
}

export async function getAdminAnalyticsSummary() {
  await dbConnect();

  try {
    const [
      totalProjects,
      featuredProjects,
      completedProjects,
      totalExperiences,
      currentExperiences,
      allResumes,
      activeResume,
      allAchievements,
      allBlogs,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Project.countDocuments({ completed: true }),
      Experience.countDocuments(),
      Experience.countDocuments({ currentlyWorking: true }),
      ResumeLink.countDocuments(),
      ResumeLink.findOne({ isActive: true }).lean(),
      Achievement.find().lean(),
      Blog.find().lean(),
    ]);

    const achievementCategories: Record<string, number> = {};
    allAchievements.forEach((ach) => {
      const cat = ach.category || "Other";
      achievementCategories[cat] = (achievementCategories[cat] || 0) + 1;
    });

    const blogPlatforms: Record<string, number> = {};
    const seriesSet = new Set<string>();
    allBlogs.forEach((b) => {
      const plat = b.platform || "Other";
      blogPlatforms[plat] = (blogPlatforms[plat] || 0) + 1;
      if (b.isSeries && b.seriesName) {
        seriesSet.add(b.seriesName);
      }
    });

    const summary: AnalyticsSummary = {
      projects: {
        total: totalProjects,
        featured: featuredProjects,
        completed: completedProjects,
      },
      experiences: {
        total: totalExperiences,
        current: currentExperiences,
      },
      resumes: {
        total: allResumes,
        activeName: activeResume ? activeResume.name : "None",
        activeSlug: activeResume ? activeResume.slug || activeResume._id.toString() : "",
      },
      achievements: {
        total: allAchievements.length,
        featured: allAchievements.filter((a) => a.featured).length,
        categories: achievementCategories,
      },
      blogs: {
        total: allBlogs.length,
        seriesCount: seriesSet.size,
        featured: allBlogs.filter((b) => b.featured).length,
        platforms: blogPlatforms,
      },
      lastUpdated: new Date().toISOString(),
    };

    return { success: true, data: summary };
  } catch (error: any) {
    logger.error("Failed to calculate analytics summary:", error);
    return { success: false, error: "Failed to load analytics summary" };
  }
}
