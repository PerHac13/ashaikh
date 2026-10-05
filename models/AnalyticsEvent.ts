import mongoose, { Document, Model } from "mongoose";

export interface IAnalyticsEvent extends Document {
  path: string;
  eventType: "page_view" | "resume_view" | "project_click" | "blog_click" | "custom";
  identifier?: string;
  metadata?: Record<string, any>;
  referrer?: string;
  deviceType?: string;
  createdAt: Date;
}

const analyticsEventSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: ["page_view", "resume_view", "project_click", "blog_click", "custom"],
      default: "page_view",
      index: true,
    },
    identifier: {
      type: String,
      trim: true,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    referrer: {
      type: String,
      trim: true,
      default: "",
    },
    deviceType: {
      type: String,
      default: "Desktop",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

analyticsEventSchema.index({ createdAt: -1 });
analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ path: 1, createdAt: -1 });

const AnalyticsEvent =
  (mongoose.models.AnalyticsEvent as Model<IAnalyticsEvent>) ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", analyticsEventSchema);

export default AnalyticsEvent;
