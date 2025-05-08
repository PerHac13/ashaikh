import mongoose, { Document, Model } from "mongoose";

export interface IProject extends Document {
  _id: string;
  title: string;
  madeAt?: string;
  imgUrl?: string;
  description: string[];
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

interface ProjectModel extends Model<IProject> {}

const projectSchema = new mongoose.Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: [String],
      default: [],
      required: true,
    },
    madeAt: {
      type: String,
    },
    imgUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dmknbak4t/image/upload/v1739515347/pexels-luis-gomes-166706-546819_vr4jlv.jpg",
    },
    timeline: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
      },
    },
    featured: {
      type: Boolean,
      required: true,
      default: false,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    teamSize: {
      type: Number,
      required: true,
      min: 1,
    },
    skills: {
      type: [String],
      default: [],
      required: true,
    },
    tags: {
      type: [String],
      default: [],
      required: true,
    },
    githubUrl: {
      type: String,
    },
    liveUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for sorting featured and recent projects
projectSchema.index({ featured: -1, "timeline.start": -1 });

const Project =
  (mongoose.models?.Project as ProjectModel) ||
  mongoose.model<IProject, ProjectModel>("Project", projectSchema);

export default Project;
