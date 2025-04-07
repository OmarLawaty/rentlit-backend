import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { User } from '../models';
import { ApiError } from '../utils';
import { JWT_SECRET } from '../config';

interface IRequest {
  body: { name: { first: string; last: string }; email: string; password: string };
}

export const signUp = async (req: IRequest, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, name, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError('User already exists', 409);
    }
    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create([{ email, name, password: hashedPassword, isVerified: false, image: null }], {
      session,
    });

    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: '14d' });

    res.status(201).json({
      token,
      user: newUsers[0],
    });

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    next(error);
    await session.abortTransaction();
    session.endSession();
  }
};

export const signIn = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw new ApiError('User not found', 404);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new ApiError('Invalid password', 401);

    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '14d' });

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};
