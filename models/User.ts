import mongoose, { Document, Model } from 'mongoose';
import argon2 from 'argon2';

interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

interface UserModel extends Model<IUser> {
  
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
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

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  try {
    return await argon2.verify(this.password, password);
  } catch (error) {
    throw error;
  }
};

userSchema.index({ username: 'text' });

const User = (mongoose.models.User as UserModel) || 
  mongoose.model<IUser, UserModel>('User', userSchema);

export default User;