import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';

import { JWT_SECRET } from '../config';
import { User } from '../models';

import type { IUser } from '../types';
import { ApiError } from '../utils';

interface IRequest extends Request {
  headers: Request['headers'] & {
    authorization?: string;
  };
  user?: IUser;
}

export const authorize = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
      res.status(401).json({ message: 'Bearer token not found' });
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload & { userId: string };

    const user = await User.findById(decoded.userId, '-password');

    if (!user) {
      throw new ApiError('Unauthorized', 401);
    }

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ message: `Unauthorized request: ${error.message}` });
      return;
    }
    next(error);
  }
};
