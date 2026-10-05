"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, X } from "lucide-react";
import { IAchievement } from "@/types/achievement";
import { useAchievementActions } from "@/hooks/useAchievementActions";

interface AchievementFormModalProps {
  achievement?: IAchievement | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AchievementFormModal({
  achievement,
  isOpen,
  onClose,
  onSuccess,
}: AchievementFormModalProps) {
  const isEditMode = !!achievement;
  const { createAchievement, updateAchievement, isSubmitting } =
    useAchievementActions();

  const [descriptionItems, setDescriptionItems] = useState<string[]>(
    achievement?.description && achievement.description.length > 0
      ? achievement.description
      : [""]
  );

  const formatDateForInput = (dateString?: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: achievement?.title || "",
      organization: achievement?.organization || "",
      category: achievement?.category || "Award",
      date: achievement?.date
        ? formatDateForInput(achievement.date)
        : formatDateForInput(new Date()),
      link: achievement?.link || "",
      imagePath: achievement?.imagePath || "",
      featured: achievement?.featured ?? true,
      score: achievement?.score ?? 0,
    },
  });

  useEffect(() => {
    if (achievement) {
      setValue("title", achievement.title || "");
      setValue("organization", achievement.organization || "");
      setValue("category", achievement.category || "Award");
      setValue("date", formatDateForInput(achievement.date));
      setValue("link", achievement.link || "");
      setValue("imagePath", achievement.imagePath || "");
      setValue("featured", achievement.featured ?? true);
      setValue("score", achievement.score ?? 0);
      setDescriptionItems(
        achievement.description && achievement.description.length > 0
          ? achievement.description
          : [""]
      );
    } else {
      reset({
        title: "",
        organization: "",
        category: "Award",
        date: formatDateForInput(new Date()),
        link: "",
        imagePath: "",
        featured: true,
        score: 0,
      });
      setDescriptionItems([""]);
    }
  }, [achievement, setValue, reset]);

  const addDescriptionItem = () => {
    setDescriptionItems([...descriptionItems, ""]);
  };

  const removeDescriptionItem = (index: number) => {
    setDescriptionItems(descriptionItems.filter((_, i) => i !== index));
  };

  const updateDescriptionItem = (index: number, value: string) => {
    const newItems = [...descriptionItems];
    newItems[index] = value;
    setDescriptionItems(newItems);
  };

  const onSubmit = async (formData: any) => {
    const cleanDescriptions = descriptionItems.filter((item) => item.trim() !== "");

    const payload: Partial<IAchievement> = {
      title: formData.title,
      organization: formData.organization,
      category: formData.category,
      date: new Date(formData.date),
      description: cleanDescriptions,
      link: formData.link,
      imagePath: formData.imagePath,
      featured: formData.featured,
      score: Number(formData.score) || 0,
    };

    let ok = false;
    if (isEditMode && achievement?._id) {
      ok = await updateAchievement(achievement._id, payload);
    } else {
      ok = await createAchievement(payload);
    }

    if (ok) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? `Edit Achievement: ${achievement.title}` : "Add New Achievement"}
          </DialogTitle>
          <DialogDescription>
            Showcase awards, hackathons, certifications, or milestone recognitions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Achievement Title *</Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="e.g. Winner - HackAI 2024"
              />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization / Issuer</Label>
              <Input
                id="organization"
                {...register("organization")}
                placeholder="e.g. Google, IIIT Bhagalpur, Codeforces"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                {...register("category")}
                className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Award">Award / Honor</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Contest">Coding Contest</option>
                <option value="Certification">Certification</option>
                <option value="Publication">Publication / Research</option>
                <option value="Milestone">Milestone</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date Achieved *</Label>
              <Input
                id="date"
                type="date"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <p className="text-red-500 text-xs">{errors.date.message as string}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link">Certificate / Credential Link</Label>
              <Input
                id="link"
                {...register("link")}
                placeholder="https://credential.net/... or GitHub / Proof"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagePath">Badge / Image URL (Optional)</Label>
              <Input
                id="imagePath"
                {...register("imagePath")}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description Points</Label>
            {descriptionItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-start mb-2">
                <Textarea
                  value={item}
                  onChange={(e) => updateDescriptionItem(index, e.target.value)}
                  placeholder={`Highlight point ${index + 1}`}
                  rows={2}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeDescriptionItem(index)}
                  disabled={descriptionItems.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDescriptionItem}
              className="mt-1"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Point
            </Button>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="featured"
              checked={watch("featured")}
              onCheckedChange={(checked) => setValue("featured", !!checked)}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Feature on Portfolio Homepage
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditMode ? (
                "Update Achievement"
              ) : (
                "Create Achievement"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
