import { Response, NextFunction, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

import { User } from '../models';
import { ApiError } from '../utils';
import { JWT_SECRET } from '../config';
import { IUser } from '../types';

interface IRequest extends Request {
  body: { name: { first: string; last: string }; email: string; password: string };
}

export const signUp = async (req: IRequest, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, name, password } = req.body;

    const existingUser = await User.findOne<IUser>({ email });

    if (existingUser) {
      throw new ApiError('User already exists', 409);
    }
    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create<Partial<IUser>>([{ email, name, password: hashedPassword }], { session });

    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: '30d' });

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

    const user = await User.findOne<IUser>({ email });

    if (!user) throw new ApiError('User not found', 404);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new ApiError('Invalid password', 401);

    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const checkToken = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
      throw new ApiError('Bearer token not found', 401);

    const token = req.headers.authorization.split(' ')[1];

    const verifiedToken = jwt.verify(token, JWT_SECRET as string) as JwtPayload & { userId: string };

    if (verifiedToken) {
      res.status(200).json(true);
      return;
    }
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(401).json(false);
      return;
    }
    next(error);
  }
};
