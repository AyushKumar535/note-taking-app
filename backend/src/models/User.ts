import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  isVerified: boolean;
  verificationToken?: string;
  authProvider: 'email' | 'google';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function(this: IUser) {
      return this.authProvider === 'email';
    }
  },
  googleId: {
    type: String,
    sparse: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  authProvider: {
    type: String,
    enum: ['email', 'google'],
    required: true
  }
}, {
  timestamps: true
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;