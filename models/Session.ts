import mongoose, { Document, Model } from 'mongoose';
import crypto from 'crypto';

interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
  createdAt: Date;
  isValid: boolean;
}

interface SessionModel extends Model<ISession> {
  createSession(userId: mongoose.Types.ObjectId, userAgent: string, ipAddress: string, expiresIn?: number): Promise<ISession>;
  findByToken(token: string): Promise<ISession | null>;
  invalidateSession(token: string): Promise<boolean>;
  invalidateAllUserSessions(userId: mongoose.Types.ObjectId): Promise<boolean>;
}

const sessionSchema = new mongoose.Schema<ISession>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      // Removed unique: true here to avoid duplicate indexing
    },
    userAgent: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // Removed index: true if it was here
    },
    isValid: {
      type: Boolean,
      default: true,
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


function generateRandomToken(size = 64): string {
  return crypto.randomBytes(size).toString('hex');
}


sessionSchema.statics.createSession = async function(
  userId: mongoose.Types.ObjectId,
  userAgent: string,
  ipAddress: string,
  expiresIn = 7 * 24 * 60 * 60 * 1000  // Changed to 7 days by default
): Promise<ISession> {
  const token = generateRandomToken();
  const expiresAt = new Date(Date.now() + expiresIn);

  const session = await this.create({
    userId,
    token,
    userAgent,
    ipAddress,
    expiresAt,
  });

  return session;
};

sessionSchema.statics.findByToken = async function(token: string): Promise<ISession | null> {
  if (!token) {
    console.warn("No session token provided");
    return null;
  }
  
  const session = await this.findOne({
    token,
    isValid: true,
    expiresAt: { $gt: new Date() },
  });

  return session;
};

sessionSchema.statics.invalidateSession = async function(token: string): Promise<boolean> {
  if (!token) {
    console.warn("No session token provided for invalidation");
    return false;
  }
  
  const result = await this.updateOne(
    { token },
    { isValid: false }
  );
  
  return result.modifiedCount > 0;
};

sessionSchema.statics.invalidateAllUserSessions = async function(userId: mongoose.Types.ObjectId): Promise<boolean> {
  const result = await this.updateMany(
    { userId },
    { isValid: false }
  );
  
  return result.modifiedCount > 0;
};

// Keep only these index definitions
sessionSchema.index({ token: 1 }, { unique: true });
sessionSchema.index({ userId: 1 });
sessionSchema.index({ expiresAt: 1 }, { 
  expireAfterSeconds: 0  // TTL index for automatic cleanup
});

const Session = (mongoose.models.Session as SessionModel) || 
  mongoose.model<ISession, SessionModel>('Session', sessionSchema);

export default Session;