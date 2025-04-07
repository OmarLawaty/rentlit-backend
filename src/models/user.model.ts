import { Schema, model } from 'mongoose';

import { IUser } from '../types';

const userSchema: Schema = new Schema<IUser>({
  name: {
    first: {
      type: String,
      required: [true, 'First name required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    last: {
      type: String,
      required: [true, 'Last name required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
  },

  email: {
    type: String,
    required: [true, 'user email required'],
    trim: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'email not valid'],
  },

  password: {
    type: String,
    required: [true, 'password required'],
    minlength: 6,
  },

  isVerified: {
    type: Boolean,
  },

  image: {
    type: String,
  },
});

export const User = model<IUser>('User', userSchema);
