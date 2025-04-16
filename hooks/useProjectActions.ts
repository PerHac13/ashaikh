"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { IProject } from "@/models/Project";
import {
  createProject,
  updateProject as updateProjectAction,
  deleteProject as deleteProjectAction,
  getProjects,
} from "@/actions/projectActions";

export function useProjectActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleGetProjects = async () => {
    setIsSubmitting(true);
    try {
      const result = await getProjects();
      toast({
        title: "Projects fetched",
        description: "Projects have been fetched successfully.",
        variant: "success",
      });
      return result.data;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch projects",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProject = async (data: Omit<IProject, "_id">) => {
    setIsSubmitting(true);
    try {
      const result = await createProject(data);
      toast({
        title: "Project created",
        description: "Your project has been created successfully.",
        variant: "success",
      });
      return result.data;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = async (id: string, data: Partial<IProject>) => {
    setIsSubmitting(true);
    try {
      const result = await updateProjectAction(id, data);
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully.",
        variant: "success",
      });
      return result.data;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update project",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteProjectAction(id);
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
        variant: "success",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createProject: handleCreateProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject,
    getProjects: handleGetProjects,
    isSubmitting,
    isDeleting,
  };
}
