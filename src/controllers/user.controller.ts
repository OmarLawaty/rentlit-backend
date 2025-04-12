import { Response, NextFunction, Request } from 'express';
import mongoose from 'mongoose';

import { ApiError } from '../utils';
import { User } from '../models';

interface IRequest extends Request {
  query: {
    structure: 'minimal' | 'full';
  };

  params: {
    id: string;
  };
}

export const getUserData = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError('Invalid user ID format', 400);
    }

    const user = await User.findById(req.params.id, '-password');

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    if (req.query.structure == 'minimal') {
      res.status(200).json({
        data: {
          name: user.name,
        },
      });

      return;
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
