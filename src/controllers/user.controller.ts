import { Response, NextFunction, Request } from 'express';

import { ApiError } from '../utils';
import { IUser } from '../types';

interface IRequest extends Request {
  query: {
    structure: 'minimal' | 'full';
  };

  user?: IUser;
}

export const getUserData = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError('User is not defined', 404);
    }

    if (req.query.structure == 'minimal') {
      res.status(200).json({
        data: {
          name: req.user.name,
        },
      });
      return;
    }

    res.status(200).json({
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
