import mongoose, { Document, Model } from "mongoose";

interface IResumeLink extends Document {
  name: string;
  url: string;
  isActive: boolean;
  createdAt: Date;
}

interface ResumeLinkModel extends Model<IResumeLink> {
  setActiveLink(linkId: mongoose.Types.ObjectId): Promise<IResumeLink | null>;
}

const resumeLinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

resumeLinkSchema.statics.setActiveLink = async function (
  linkId: mongoose.Types.ObjectId
): Promise<IResumeLink | null> {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await this.updateMany({ isActive: true }, { isActive: false }, { session });

    const link = await this.findByIdAndUpdate(
      linkId,
      { isActive: true },
      { new: true, session }
    );

    await session.commitTransaction();
    return link;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

resumeLinkSchema.index({ isActive: 1 });

const ResumeLink =
  (mongoose.models.ResumeLink as ResumeLinkModel) ||
  mongoose.model<IResumeLink, ResumeLinkModel>("ResumeLink", resumeLinkSchema);

export default ResumeLink;
