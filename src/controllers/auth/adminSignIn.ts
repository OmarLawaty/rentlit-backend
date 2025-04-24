import { Response, NextFunction, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../../models';
import { ApiError } from '../../utils';
import { JWT_SECRET } from '../../config';
import { IUser } from '../../types';

interface IRequest extends Request {
  body: { name: { first: string; last: string }; email: string; password: string };
}

export const adminSignIn = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne<IUser>({ email });

    if (!user) throw new ApiError('User not found', 404);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new ApiError('Invalid password', 401);

    if (!user.isAdmin) throw new ApiError('User is not an Admin', 401);

    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};
