'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { IExperience } from '@/models/Experience';
import { 
  createExperience, 
  updateExperience as updateExperienceAction, 
  deleteExperience as deleteExperienceAction ,
  getExperiences
} from '@/actions/experienceActions';

export function useExperienceActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleGetExperiences = async () => {
    setIsSubmitting(true);
    try {
      const result = await getExperiences();
      toast({
        title: 'Experiences fetched',
        description: 'Experiences have been fetched successfully.',
        variant: 'success',
      });
      return result.data;

    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch experiences',
        variant: 'destructive',
      });
      return [];
    }finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCreateExperience = async (data: Omit<IExperience, '_id'>) => {
    setIsSubmitting(true);
    try {
      const result = await createExperience(data);
      toast({
        title: 'Experience created',
        description: 'Your experience has been created successfully.',
        variant: 'success',
      });
      return result.data;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create experience',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateExperience = async (id: string, data: Partial<IExperience>) => {
    setIsSubmitting(true);
    try {
      const result = await updateExperienceAction(id, data);
      toast({
        title: 'Experience updated',
        description: 'Your experience has been updated successfully.',
        variant: 'success',
      });
      return result.data;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update experience',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteExperience = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteExperienceAction(id);
      toast({
        title: 'Experience deleted',
        description: 'Your experience has been deleted successfully.',
        variant: 'success',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete experience',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    createExperience: handleCreateExperience,
    updateExperience: handleUpdateExperience,
    deleteExperience: handleDeleteExperience,
    getExperiences: handleGetExperiences,
    isSubmitting,
    isDeleting,
  };
}