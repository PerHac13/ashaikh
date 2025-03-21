"use client";

import { useState } from "react";
import { IExperience } from "@/models/Experience";
import { useExperienceActions } from "@/hooks/useExperienceActions";
import ExperienceForm from "./ExperienceForm";
import ExperienceDetails from "./ExperienceDetails";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ExperienceDetailModalProps = {
  experience: IExperience;
  onClose: () => void;
};

export default function ExperienceDetailModal({ experience, onClose }: ExperienceDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteExperience, isDeleting } = useExperienceActions();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      await deleteExperience(experience._id);
      onClose();
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Experience" : "Experience Details"}</DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <ExperienceForm 
            initialData={experience} 
            open={true} 
            onOpenChange={(open) => {
              if (!open) setIsEditing(false);
            }}
            onSuccess={handleEditSuccess} 
          />
        ) : (
          <ExperienceDetails 
            experience={experience} 
            onEdit={() => setIsEditing(true)} 
            onDelete={handleDelete} 
            isDeleting={isDeleting} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
}