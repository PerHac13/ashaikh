import { z } from "zod";

// Types for validation results
type ValidationResult<T> = z.SafeParseReturnType<unknown, T>;

// Identity validation
const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export type LoginData = z.infer<typeof loginSchema>;

export const validateLogin = (data: unknown): ValidationResult<LoginData> => {
  return loginSchema.safeParse(data);
};

// Experience validation
const roleTypeEnum = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
  "Temporary",
  "Remote",
  "Onsite",
  "Hybrid",
] as const;

export type RoleType = (typeof roleTypeEnum)[number];

const experienceBaseSchema = z.object({
  startDate: z.coerce.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid date",
  }),
  currentlyWorking: z.boolean({
    required_error: "Currently working status is required",
    invalid_type_error: "Currently working must be a boolean",
  }),
  featured: z.boolean({
    required_error: "Featured status is required",
    invalid_type_error: "Featured must be a boolean",
  }),
  organization: z
    .string({
      required_error: "Organization is required",
    })
    .min(2, "Organization must be at least 2 characters")
    .max(100, "Organization cannot exceed 100 characters")
    .trim(),
  currentPosition: z
    .string({
      required_error: "Current position is required",
    })
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position cannot exceed 100 characters")
    .trim(),
  previousPositions: z.array(z.string()).default([]),
  roleType: z.enum(roleTypeEnum, {
    required_error: "Role type is required",
    invalid_type_error: "Invalid role type",
  }),
  description: z
    .array(
      z.string({
        required_error: "Description is required",
      })
    )
    .min(1, "At least one description point is required"),
  skills: z
    .array(
      z.string({
        required_error: "Skills are required",
      })
    )
    .min(1, "At least one skill is required"),
});

// Create a base schema for experience with the end date field
const experienceWithEndDateSchema = experienceBaseSchema.extend({
  endDate: z.coerce
    .date()
    .optional()
    .nullable()
    .default(null)
    .refine((date) => {
      if (date && date <= new Date()) return true;
      return date === null;
    }, "End date must be in the past or current date"),
});

// Apply refinements for the create schema
const createExperienceSchema = experienceWithEndDateSchema.refine(
  (data) => {
    if (!data.currentlyWorking && !data.endDate) return false;
    if (data.endDate && data.endDate < data.startDate) return false;
    return true;
  },
  {
    message:
      "End date must be after start date or currently working must be true",
    path: ["endDate"],
  }
);

// Create a partial schema for updates
const updateExperienceSchema = experienceWithEndDateSchema.partial();

const deleteExperienceSchema = z.object({
  id: z
    .string({
      required_error: "Experience ID is required",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid experience ID format"),
});

export type CreateExperienceData = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceData = z.infer<typeof updateExperienceSchema>;
export type DeleteExperienceData = z.infer<typeof deleteExperienceSchema>;

export const validateCreateExperience = (
  data: unknown
): ValidationResult<CreateExperienceData> =>
  createExperienceSchema.safeParse(data);

export const validateUpdateExperience = (
  data: unknown
): ValidationResult<UpdateExperienceData> =>
  updateExperienceSchema.safeParse(data);

export const validateDeleteExperience = (
  data: unknown
): ValidationResult<DeleteExperienceData> =>
  deleteExperienceSchema.safeParse(data);

// Project validation
const projectBaseSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),

  tag: z.array(z.string()).optional().default([]),

  madeAt: z.string().optional().default(""),

  imagePath: z
    .string()
    .url("Invalid image URL")
    .optional()
    .default(
      "https://res.cloudinary.com/dmknbak4t/image/upload/v1739515347/pexels-luis-gomes-166706-546819_vr4jlv.jpg"
    ),

  link: z
    .array(z.string().url("Invalid URL format"))
    .min(1, "At least one link is required"),

  featured: z.boolean({
    required_error: "Featured status is required",
    invalid_type_error: "Featured must be a boolean",
  }),

  startDate: z.coerce.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid date",
  }),

  currentlyWorking: z.boolean().optional().default(false),

  description: z
    .array(z.string())
    .min(1, "At least one description point is required"),

  skill: z.array(z.string()).min(1, "At least one skill is required"),

  score: z
    .number()
    .int("Score must be an integer")
    .min(0, "Score cannot be negative")
    .optional()
    .default(0),
});

// Create a base schema for projects with the end date field
const projectWithEndDateSchema = projectBaseSchema.extend({
  endDate: z.coerce
    .date()
    .optional()
    .nullable()
    .refine((date) => {
      if (date && date <= new Date()) return true;
      return date === null;
    }, "End date must be in the past or current date"),
});

// Apply refinements for the create schema
const createProjectSchema = projectWithEndDateSchema.refine(
  (data) => {
    if (!data.currentlyWorking && !data.endDate) return false;
    if (data.endDate && data.endDate < data.startDate) return false;
    return true;
  },
  {
    message:
      "End date must be after start date or currently working must be true",
    path: ["endDate"],
  }
);

// Create a partial schema for updates
const updateProjectSchema = projectWithEndDateSchema.partial();

const deleteProjectSchema = z.object({
  id: z
    .string({
      required_error: "Project ID is required",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID format"),
});

export type CreateProjectData = z.infer<typeof createProjectSchema>;
export type UpdateProjectData = z.infer<typeof updateProjectSchema>;
export type DeleteProjectData = z.infer<typeof deleteProjectSchema>;

export const validateCreateProject = (
  data: unknown
): ValidationResult<CreateProjectData> => createProjectSchema.safeParse(data);

export const validateUpdateProject = (
  data: unknown
): ValidationResult<UpdateProjectData> => updateProjectSchema.safeParse(data);

export const validateDeleteProject = (
  data: unknown
): ValidationResult<DeleteProjectData> => deleteProjectSchema.safeParse(data);

export const resumeLinkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Valid URL is required"),
  slug: z.string().optional().default(""),
});

// Achievement validation
export const achievementSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(2, "Title must be at least 2 characters"),
  organization: z.string().optional().default(""),
  date: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Date must be a valid date",
  }),
  description: z.array(z.string()).default([]),
  category: z.string().optional().default("Milestone"),
  link: z.string().optional().default(""),
  imagePath: z.string().optional().default(""),
  featured: z.boolean().optional().default(true),
  score: z.number().optional().default(0),
});

export const updateAchievementSchema = achievementSchema.partial();

export type AchievementData = z.infer<typeof achievementSchema>;
export type UpdateAchievementData = z.infer<typeof updateAchievementSchema>;

// Blog validation
export const blogSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(2, "Title must be at least 2 characters"),
  slug: z
    .string({ required_error: "Slug is required" })
    .min(1, "Slug is required"),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description is required"),
  redirectUrl: z
    .string({ required_error: "Redirect URL is required" })
    .url("Valid URL is required"),
  platform: z.string().optional().default("Medium"),
  publishedAt: z.coerce.date({
    required_error: "Publish date is required",
    invalid_type_error: "Publish date must be a valid date",
  }),
  tags: z.array(z.string()).default([]),
  isSeries: z.boolean().optional().default(false),
  seriesName: z.string().optional().default(""),
  seriesPart: z.number().optional().default(1),
  relatedLinks: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
      })
    )
    .default([]),
  featured: z.boolean().optional().default(true),
  readTime: z.string().optional().default("5 min read"),
});

export const updateBlogSchema = blogSchema.partial();

export type BlogData = z.infer<typeof blogSchema>;
export type UpdateBlogData = z.infer<typeof updateBlogSchema>;

