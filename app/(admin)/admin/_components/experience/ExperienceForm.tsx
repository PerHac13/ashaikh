"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { IExperience, RoleType } from '@/models/Experience';
import { useExperienceActions } from '@/hooks/useExperienceActions';
import { Button } from '@/components/ui/button';
import TagInput from '@/components/ui/tag-input';
import { Loader2 as Spinner } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

type ExperienceFormProps = {
  initialData?: IExperience;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

// Define a more explicit type for the form data to avoid deep instantiation
interface FormData {
  organization: string;
  currentPosition: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  featured: boolean;
  roleType: RoleType;
  previousPositions: string[];
  description: string[];
  skills: string[];
}

export default function ExperienceForm({ 
  initialData, 
  open,
  onOpenChange,
  onSuccess
}: ExperienceFormProps) {
  const [descriptionItems, setDescriptionItems] = useState<string[]>(['']);
  const [newDescriptionItem, setNewDescriptionItem] = useState('');
  
  const { createExperience, updateExperience, isSubmitting } = useExperienceActions();
  
  // Initialize form with default values
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      organization: '',
      currentPosition: '',
      startDate: '',
      currentlyWorking: true,
      featured: false,
      roleType: RoleType.FullTime, // Fixed enum value
      previousPositions: [],
      description: [''],
      skills: [],
    }
  });
  
  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      // Set form values from initialData
      setValue('organization', initialData.organization);
      setValue('currentPosition', initialData.currentPosition);
      setValue('currentlyWorking', initialData.currentlyWorking);
      setValue('featured', initialData.featured);
      setValue('roleType', initialData.roleType as RoleType);
      setValue('previousPositions', initialData.previousPositions);
      setValue('description', initialData.description);
      setValue('skills', initialData.skills);
      
      if (initialData.startDate) {
        const startDate = new Date(initialData.startDate);
        setValue('startDate', startDate.toISOString().split('T')[0]);
      }

      if (initialData.endDate) {
          const endDate = new Date(initialData.endDate);
          setValue('endDate', endDate.toISOString().split('T')[0]);
      }
      setDescriptionItems(initialData.description.length > 0 ? initialData.description : ['']);
    }
  }, [initialData, setValue]);
  
  const currentlyWorking = watch('currentlyWorking');
  
  const addDescriptionItem = () => {
    if (newDescriptionItem.trim()) {
      setDescriptionItems([...descriptionItems, newDescriptionItem]);
      setValue('description', [...descriptionItems, newDescriptionItem]);
      setNewDescriptionItem('');
    }
  };
  
  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDescriptionItem();
    }
  };
  
  const removeDescriptionItem = (index: number) => {
    const updatedItems = descriptionItems.filter((_, i) => i !== index);
    setDescriptionItems(updatedItems);
    setValue('description', updatedItems);
  };
  
  const onSubmit = async (data: FormData) => {
    try {
      // Prepare data for submission
      const submissionData = {
        organization: data.organization,
        currentPosition: data.currentPosition,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        currentlyWorking: data.currentlyWorking,
        featured: data.featured,
        roleType: data.roleType,
        previousPositions: data.previousPositions,
        description: descriptionItems.filter(item => item.trim() !== ''),
        skills: data.skills,
      };
      
      if (initialData && initialData._id) {
        await updateExperience(initialData._id, submissionData as any);
      } else {
        await createExperience(submissionData as any);
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Experience' : 'Add New Experience'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Organization</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                {...register('organization', { required: 'Organization is required' })}
              />
              {errors.organization && (
                <p className="text-red-500 text-xs">{errors.organization.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Current Position</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                {...register('currentPosition', { required: 'Current position is required' })}
              />
              {errors.currentPosition && (
                <p className="text-red-500 text-xs">{errors.currentPosition.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                {...register('startDate', { required: 'Start date is required' })}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs">{errors.startDate.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">End Date</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="currentlyWorking"
                    {...register('currentlyWorking')}
                  />
                  <label htmlFor="currentlyWorking" className="text-sm">Currently working here</label>
                </div>
              </div>
              <input
                type="date"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600"
                disabled={currentlyWorking}
                {...register('endDate', { 
                  required: !currentlyWorking ? 'End date is required' : false 
                })}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs">{errors.endDate.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Role Type</label>
            <select
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              {...register('roleType', { required: 'Role type is required' })}
            >
              {Object.values(RoleType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.roleType && (
              <p className="text-red-500 text-xs">{errors.roleType.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Previous Positions</label>
              <span className="text-xs text-gray-500">(Optional)</span>
            </div>
            <Controller
              name="previousPositions"
              control={control}
              render={({ field }) => (
                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add position and press Enter"
                  label="Previous positions"
                />
              )}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Description</label>
              <span className="text-xs text-gray-500">(Type and press Enter to add)</span>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Type description and press Enter"
                value={newDescriptionItem}
                onChange={(e) => setNewDescriptionItem(e.target.value)}
                onKeyDown={handleDescriptionKeyDown}
              />
              <Button
                type="button"
                onClick={addDescriptionItem}
                disabled={!newDescriptionItem.trim()}
                size="sm"
              >
                Add
              </Button>
            </div>
            
            <div className="mt-2 space-y-2">
              {descriptionItems.map((item, index) => (
                item.trim() !== '' && (
                  <div key={index} className="flex gap-2 items-center p-2 rounded">
                    <span className="flex-1">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeDescriptionItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                )
              ))}
            </div>
            
            {errors.description && (
              <p className="text-red-500 text-xs">At least one description item is required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Skills</label>
            <Controller
              name="skills"
              control={control}
              rules={{ required: 'At least one skill is required' }}
              render={({ field }) => (
                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add skill and press Enter"
                  label="Skills"
                />
              )}
            />
            {errors.skills && (
              <p className="text-red-500 text-xs">{errors.skills.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                {...register('featured')}
              />
              <label htmlFor="featured" className="text-sm">Mark as featured experience</label>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" /> : initialData ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}