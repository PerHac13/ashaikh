"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getBlogs as getBlogsAction,
  getBlogBySlug as getBlogBySlugAction,
  createBlog as createBlogAction,
  updateBlog as updateBlogAction,
  deleteBlog as deleteBlogAction,
} from "@/actions/blogActions";
import { IBlog } from "@/types/blog";

export function useBlogActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const getBlogs = async (filter?: {
    featured?: boolean;
    seriesName?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await getBlogsAction(filter);
      if (!res.success) {
        toast({
          title: "Error",
          description: res.error || "Failed to fetch blogs",
          variant: "destructive",
        });
        return [];
      }
      return res.data || [];
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to fetch blogs",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getBlogBySlug = async (slug: string) => {
    setIsLoading(true);
    try {
      const res = await getBlogBySlugAction(slug);
      if (!res.success) {
        return null;
      }
      return res.data;
    } catch {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createBlog = async (data: Partial<IBlog>) => {
    setIsSubmitting(true);
    try {
      const res = await createBlogAction(data);
      if (!res.success) {
        toast({
          title: "Error",
          description: res.error || "Failed to create blog",
          variant: "destructive",
        });
        return false;
      }
      toast({
        title: "Blog created",
        description: "Blog has been published successfully.",
        variant: "success",
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to create blog",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateBlog = async (id: string, data: Partial<IBlog>) => {
    setIsSubmitting(true);
    try {
      const res = await updateBlogAction(id, data);
      if (!res.success) {
        toast({
          title: "Error",
          description: res.error || "Failed to update blog",
          variant: "destructive",
        });
        return false;
      }
      toast({
        title: "Blog updated",
        description: "Blog details updated successfully.",
        variant: "success",
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to update blog",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBlog = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await deleteBlogAction(id);
      if (!res.success) {
        toast({
          title: "Error",
          description: res.error || "Failed to delete blog",
          variant: "destructive",
        });
        return false;
      }
      toast({
        title: "Blog deleted",
        description: "Blog has been deleted successfully.",
        variant: "success",
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to delete blog",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    getBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    isLoading,
    isSubmitting,
    isDeleting,
  };
}
