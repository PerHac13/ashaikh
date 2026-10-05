"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getAchievements as getAchievementsAction,
  createAchievement as createAchievementAction,
  updateAchievement as updateAchievementAction,
  deleteAchievement as deleteAchievementAction,
} from "@/actions/achievementActions";
import { IAchievement } from "@/types/achievement";

export function useAchievementActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const getAchievements = async (filter?: { featured?: boolean }) => {
    setIsLoading(true);
    try {
      const res = await getAchievementsAction(filter);
      if (!res.success) {
        toast({
          title: "Error",
          description: res.error || "Failed to fetch achievements",
          variant: "destructive",
        });
        return [];
      }
      return res.data || [];
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to fetch achievements",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createAchievement = async (data: Partial<IAchievement>) => {
    setIsSubmitting(true);
    try {
      const res = await createAchievementAction(data);
      if (!res.success) {
        toast({
          title: "Error",
          description: res.error || "Failed to create achievement",
          variant: "destructive",
        });
        return false;
      }
      toast({
        title: "Achievement created",
        description: "Achievement has been created successfully.",
        variant: "success",
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to create achievement",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAchievement = async (id: string, data: Partial<IAchievement>) => {
    setIsSubmitting(true);
    try {
      const res = await updateAchievementAction(id, data);
      if (!res.success) {
        toast({
          title: "Error",
          description: res.error || "Failed to update achievement",
          variant: "destructive",
        });
        return false;
      }
      toast({
        title: "Achievement updated",
        description: "Achievement has been updated successfully.",
        variant: "success",
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to update achievement",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAchievement = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await deleteAchievementAction(id);
      if (!res.success) {
        toast({
          title: "Error",
          description: res.error || "Failed to delete achievement",
          variant: "destructive",
        });
        return false;
      }
      toast({
        title: "Achievement deleted",
        description: "Achievement has been deleted successfully.",
        variant: "success",
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to delete achievement",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    getAchievements,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    isLoading,
    isSubmitting,
    isDeleting,
  };
}
