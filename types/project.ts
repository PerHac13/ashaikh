// types/project.ts

import { Document } from "mongoose";

export interface IProject extends Document {
  _id: string;
  title: string;
  description: string[];
  madeAt?: string;
  imgUrl?: string;
  timeline: {
    start: Date;
    end?: Date;
  };
  featured: boolean;
  completed: boolean;
  teamSize: number;
  skills: string[];
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export type ProjectFormData = Omit<IProject, "_id" | "Document">;

export interface UseProjectActionsReturn {
  createProject: (data: Omit<IProject, "_id">) => Promise<IProject | null>;
  updateProject: (
    id: string,
    data: Partial<IProject>
  ) => Promise<IProject | null>;
  deleteProject: (id: string) => Promise<boolean>;
  getProjects: () => Promise<IProject[]>;
  isSubmitting: boolean;
  isDeleting: boolean;
  isLoading?: boolean;
}
