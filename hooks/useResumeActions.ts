"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getResumeLinks,
  getActiveResumeLink,
  createResumeLink,
  updateResumeLink as updateResumeLinkAction,
  deleteResumeLink as deleteResumeLinkAction,
  setActiveResumeLink as setActiveResumeLinkAction,
} from "@/actions/resumeActions";

export interface ResumeLink {
  _id: string;
  name: string;
  url: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useResumeLinkActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleGetResumeLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const { links, error } = await getResumeLinks();

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        return [];
      }

      return links;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch resume links",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleGetActiveResumeLink = useCallback(async () => {
    setIsLoading(true);
    try {
      const { link, error } = await getActiveResumeLink();

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        return null;
      }

      return link;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch active resume link",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleCreateResumeLink = useCallback(
    async (formData: FormData) => {
      setIsSubmitting(true);
      try {
        const { link, error } = await createResumeLink(formData);

        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
          return null;
        }

        toast({
          title: "Resume link created",
          description: "Your resume link has been created successfully.",
          variant: "success",
        });

        return link;
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to create resume link",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast]
  );

  const handleUpdateResumeLink = useCallback(
    async (id: string, formData: FormData) => {
      setIsSubmitting(true);
      try {
        const { link, error } = await updateResumeLinkAction(id, formData);

        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
          return null;
        }

        toast({
          title: "Resume link updated",
          description: "Your resume link has been updated successfully.",
          variant: "success",
        });

        return link;
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to update resume link",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast]
  );

  const handleDeleteResumeLink = useCallback(
    async (id: string) => {
      setIsDeleting(true);
      try {
        const { success, error } = await deleteResumeLinkAction(id);

        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
          return false;
        }

        toast({
          title: "Resume link deleted",
          description: "Your resume link has been deleted successfully.",
          variant: "success",
        });

        return success;
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to delete resume link",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [toast]
  );

  const handleSetActiveResumeLink = useCallback(
    async (id: string) => {
      setIsSubmitting(true);
      try {
        const { link, error } = await setActiveResumeLinkAction(id);

        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
          return null;
        }

        toast({
          title: "Active resume link set",
          description: "Your active resume link has been updated successfully.",
          variant: "success",
        });

        return link;
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to set active resume link",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast]
  );

  return {
    getResumeLinks: handleGetResumeLinks,
    getActiveResumeLink: handleGetActiveResumeLink,
    createResumeLink: handleCreateResumeLink,
    updateResumeLink: handleUpdateResumeLink,
    deleteResumeLink: handleDeleteResumeLink,
    setActiveResumeLink: handleSetActiveResumeLink,
    isLoading,
    isSubmitting,
    isDeleting,
  };
}
