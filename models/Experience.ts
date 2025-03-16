import mongoose, { Document, Model } from "mongoose";

export interface IExperience extends Document {
  _id: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorking: boolean;
  featured: boolean;
  organization: string;
  currentPosition: string;
  previousPositions: string[];
  roleType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance" | "Temporary" | "Remote" | "Onsite" | "Hybrid";
  description: string[];
  skills: string[];
}

interface ExperienceModel extends Model<IExperience> {}

export enum RoleType {
  FullTime = "Full-time",
  PartTime = "Part-time",
  Contract = "Contract",
  Internship = "Internship",
  Freelance = "Freelance",
  Temporary = "Temporary",
  Remote = "Remote",
  Onsite = "Onsite",
  Hybrid = "Hybrid",
}

const experienceSchema = new mongoose.Schema<IExperience>(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    currentlyWorking: {
      type: Boolean,
      required: true,
      default: true,
    },
    featured: {
      type: Boolean,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    currentPosition: {
      type: String,
      required: true,
    },
    previousPositions: {
      type: [String],
      default: [],
    },
    roleType: {
      type: String,
      enum: Object.values(RoleType),
      required: true,
      validate: {
        validator: (value: string) => Object.values(RoleType).includes(value as RoleType),
        message: "Invalid role type",
      },
    },
    description: {
      type: [String],
      required: true,
      default: [],
    },
    skills: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

experienceSchema.index({ currentlyWorking: -1, startDate: -1, endDate: -1 });

experienceSchema.pre("save", function (next) {
  if (this.currentlyWorking && this.endDate) {
    return next(new Error("End date must be null if currently working is true"));
  }
  next();
});

const Experience = (mongoose.models?.Experience as ExperienceModel) || 
  mongoose.model<IExperience, ExperienceModel>("Experience", experienceSchema);

export default Experience;
