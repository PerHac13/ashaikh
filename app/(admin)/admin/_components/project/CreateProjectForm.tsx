"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, X } from "lucide-react";
import { useProjectActions } from "@/hooks/useProjectActions";
import { IProject } from "@/types/project";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateProjectFormProps {
  onSuccess: () => void;
  projectToEdit?: IProject | null;
  initialUrl?: string | null;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  onSuccess,
  projectToEdit = null,
  initialUrl,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionItems, setDescriptionItems] = useState<string[]>(
    projectToEdit?.description || [""]
  );
  const [skills, setSkills] = useState<string[]>(projectToEdit?.skills || []);
  const [tags, setTags] = useState<string[]>(projectToEdit?.tags || []);
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");
  const { createProject, updateProject } = useProjectActions();

  const isEditMode = !!projectToEdit;

  // Format date string to yyyy-MM-dd for date input
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: projectToEdit?.title || "",
      madeAt: projectToEdit?.madeAt || "",
      imgUrl: initialUrl || projectToEdit?.imgUrl || "",
      teamSize: projectToEdit?.teamSize || 1,
      featured: projectToEdit?.featured || false,
      completed: projectToEdit?.completed || false,
      githubUrl: projectToEdit?.githubUrl || "",
      liveUrl: projectToEdit?.liveUrl || "",
      timelineStart: projectToEdit?.timeline?.start
        ? formatDateForInput(projectToEdit.timeline.start.toString())
        : formatDateForInput(new Date().toString()),
      timelineEnd: projectToEdit?.timeline?.end
        ? formatDateForInput(projectToEdit.timeline.end.toString())
        : "",
    },
  });

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

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    // Filter out empty description items
    const filteredDescription = descriptionItems.filter(
      (item) => item.trim() !== ""
    );

    const formattedData = {
      ...data,
      description: filteredDescription,
      skills,
      tags,
      timeline: {
        start: data.timelineStart ? new Date(data.timelineStart) : new Date(),
        end: data.timelineEnd ? new Date(data.timelineEnd) : undefined,
      },
    };

    // Remove the individual timeline fields
    delete formattedData.timelineStart;
    delete formattedData.timelineEnd;

    try {
      if (isEditMode && projectToEdit?._id) {
        await updateProject(projectToEdit._id, formattedData);
      } else {
        await createProject(formattedData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter project title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Made At</Label>
            <Input
              id="madeAt"
              {...register("madeAt")}
              placeholder="Organisation/Company Name"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Project Description</Label>
          {descriptionItems.map((item, index) => (
            <div key={index} className="flex gap-2 items-start mb-2">
              <Textarea
                value={item}
                onChange={(e) => updateDescriptionItem(index, e.target.value)}
                placeholder={`Description point ${index + 1}`}
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
            <Plus className="h-4 w-4 mr-2" />
            Add Description Item
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timelineStart">Start Date</Label>
            <Input
              id="timelineStart"
              type="date"
              {...register("timelineStart", {
                required: "Start date is required",
              })}
            />
            {errors.timelineStart && (
              <p className="text-red-500 text-sm">
                {errors.timelineStart.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timelineEnd">End Date (Optional)</Label>
            <Input id="timelineEnd" type="date" {...register("timelineEnd")} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="teamSize">Team Size</Label>
            <Input
              id="teamSize"
              type="number"
              min="1"
              {...register("teamSize", {
                required: "Team size is required",
                min: { value: 1, message: "Team size must be at least 1" },
              })}
            />
            {errors.teamSize && (
              <p className="text-red-500 text-sm">{errors.teamSize.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="imgUrl">Image Url</Label>
            <Input id="imgURL" {...register("imgUrl")} />
            {errors.imgUrl && (
              <p className="text-red-500 text-sm">{errors.imgUrl.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Skills</Label>

            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-grow"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" onClick={addSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center bg-muted rounded-full px-3 py-1"
                >
                  <span className="text-sm mr-1">{skill}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => removeSkill(skill)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-grow"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center bg-muted rounded-full px-3 py-1"
                >
                  <span className="text-sm mr-1">{tag}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
            <Input
              id="githubUrl"
              {...register("githubUrl")}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="liveUrl">Live URL (Optional)</Label>
            <Input
              id="liveUrl"
              {...register("liveUrl")}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={watch("featured")}
              onCheckedChange={(checked) =>
                setValue("featured", checked as boolean)
              }
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured Project
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              checked={watch("completed")}
              onCheckedChange={(checked) =>
                setValue("completed", checked as boolean)
              }
            />
            <Label htmlFor="completed" className="cursor-pointer">
              Completed
            </Label>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditMode ? "Updating..." : "Creating..."}
          </>
        ) : (
          <>{isEditMode ? "Update Project" : "Create Project"}</>
        )}
      </Button>
    </form>
  );
};

export default CreateProjectForm;
