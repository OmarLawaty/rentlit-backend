import { Response, NextFunction, Request } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';

import { User } from '../../models';
import { ApiError } from '../../utils';
import { JWT_SECRET } from '../../config';

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
      throw new ApiError('Bearer token not found', 401);

    const token = req.headers.authorization.split(' ')[1];

    const verifiedToken = jwt.verify(token, JWT_SECRET as string) as JwtPayload & { userId: string };

    const user = await User.findById(verifiedToken.userId);

    if (!user) {
      res.status(404).json(false);
      return;
    }

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
