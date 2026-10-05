"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { IBlog } from "@/types/blog";
import { auth } from "@/lib/auth";
import logger from "@/utils/logger";
import { blogSchema, updateBlogSchema } from "@/utils/validation";

export async function getBlogs(filter?: {
  featured?: boolean;
  seriesName?: string;
}) {
  await dbConnect();

  try {
    const query: any = {};
    if (filter?.featured !== undefined) query.featured = filter.featured;
    if (filter?.seriesName) query.seriesName = filter.seriesName;

    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1, seriesPart: 1, createdAt: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(blogs)) };
  } catch (error) {
    logger.error("Failed to fetch blogs:", error);
    return { success: false, data: [], error: "Failed to fetch blogs" };
  }
}

export async function getBlogBySlug(slug: string) {
  await dbConnect();

  try {
    const cleanSlug = slug.trim().toLowerCase();
    const blog = await Blog.findOne({ slug: cleanSlug }).lean();
    if (!blog) return { success: false, error: "Blog not found" };

    return { success: true, data: JSON.parse(JSON.stringify(blog)) };
  } catch (error) {
    logger.error(`Failed to fetch blog with slug ${slug}:`, error);
    return { success: false, error: "Failed to fetch blog" };
  }
}

export async function getBlogSeriesList() {
  await dbConnect();

  try {
    const series = await Blog.distinct("seriesName", {
      isSeries: true,
      seriesName: { $ne: "" },
    });
    return { success: true, data: series };
  } catch (error) {
    logger.error("Failed to fetch blog series list:", error);
    return { success: false, data: [], error: "Failed to fetch series list" };
  }
}

export async function createBlog(data: Partial<IBlog>) {
  await dbConnect();

  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    let slug = data.slug?.trim().toLowerCase();
    if (!slug && data.title) {
      slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const payload = { ...data, slug };
    const validated = blogSchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Invalid blog data",
      };
    }

    const existing = await Blog.findOne({ slug: validated.data.slug });
    if (existing) {
      return {
        success: false,
        error: `A blog with slug '${validated.data.slug}' already exists. Please choose another slug.`,
      };
    }

    const blog = await Blog.create(validated.data);

    revalidatePath("/");
    revalidatePath("/admin/blog");
    return { success: true, data: JSON.parse(JSON.stringify(blog)) };
  } catch (error: any) {
    logger.error("Failed to create blog:", error);
    return { success: false, error: error.message || "Failed to create blog" };
  }
}

export async function updateBlog(id: string, data: Partial<IBlog>) {
  await dbConnect();

  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    let slug = data.slug?.trim().toLowerCase();
    if (!slug && data.title) {
      slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const payload = { ...data, ...(slug ? { slug } : {}) };
    const validated = updateBlogSchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Invalid blog data",
      };
    }

    if (validated.data.slug) {
      const existing = await Blog.findOne({
        slug: validated.data.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return {
          success: false,
          error: `A blog with slug '${validated.data.slug}' already exists.`,
        };
      }
    }

    const updated = await Blog.findByIdAndUpdate(id, validated.data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return { success: false, error: "Blog not found" };
    }

    revalidatePath("/");
    revalidatePath("/admin/blog");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    logger.error(`Failed to update blog ${id}:`, error);
    return { success: false, error: error.message || "Failed to update blog" };
  }
}

export async function deleteBlog(id: string) {
  await dbConnect();

  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) throw new Error("Unauthorized");

    const deleted = await Blog.findByIdAndDelete(id).lean();
    if (!deleted) {
      return { success: false, error: "Blog not found" };
    }

    revalidatePath("/");
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error: any) {
    logger.error(`Failed to delete blog ${id}:`, error);
    return { success: false, error: error.message || "Failed to delete blog" };
  }
}
