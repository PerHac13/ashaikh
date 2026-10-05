import mongoose, { Document, Model } from "mongoose";

export interface IAchievement extends Document {
  _id: string;
  title: string;
  organization?: string;
  date: Date;
  description: string[];
  category?: string;
  link?: string;
  imagePath?: string;
  featured: boolean;
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: "Milestone",
      trim: true,
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
    imagePath: {
      type: String,
      trim: true,
      default: "",
    },
    featured: {
      type: Boolean,
      default: true,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ date: -1, featured: -1 });

const Achievement =
  (mongoose.models.Achievement as Model<IAchievement>) ||
  mongoose.model<IAchievement>("Achievement", achievementSchema);

export default Achievement;
