import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../utils';

export const mongooseErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    //Mongoose bad objectID
    if (err.name === 'CastError') throw new ApiError('Resource not found', 404);

    //Mongoose duplicate key
    if (err.code === 11000) throw new ApiError('Duplicate field value entered', 400);

    //Mongoose validation Error
    if (err.name === 'ValidationError') {
      throw new ApiError(
        Object.values(err.errors)
          .map((val: any) => val.message)
          .join(' '),
        400
      );
    }

    throw new ApiError(err.message, err.statusCode || 500);
  } catch (error) {
    next(error);
  }
};
