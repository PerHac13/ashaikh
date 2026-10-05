import mongoose, { Document, Model } from "mongoose";

export interface IRelatedLink {
  title: string;
  url: string;
}

export interface IBlog extends Document {
  _id: string;
  title: string;
  slug: string;
  description: string;
  redirectUrl: string;
  platform?: string;
  publishedAt: Date;
  tags: string[];
  isSeries: boolean;
  seriesName?: string;
  seriesPart?: number;
  relatedLinks: IRelatedLink[];
  featured: boolean;
  readTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

const relatedLinkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    redirectUrl: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      default: "Medium",
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    tags: {
      type: [String],
      default: [],
    },
    isSeries: {
      type: Boolean,
      default: false,
    },
    seriesName: {
      type: String,
      trim: true,
      default: "",
    },
    seriesPart: {
      type: Number,
      default: 1,
    },
    relatedLinks: {
      type: [relatedLinkSchema],
      default: [],
    },
    featured: {
      type: Boolean,
      default: true,
    },
    readTime: {
      type: String,
      default: "5 min read",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ slug: 1 });
blogSchema.index({ publishedAt: -1, featured: -1 });
blogSchema.index({ isSeries: 1, seriesName: 1 });

const Blog =
  (mongoose.models.Blog as Model<IBlog>) ||
  mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
