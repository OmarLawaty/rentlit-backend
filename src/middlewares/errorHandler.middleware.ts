import { NextFunction, Response, Request } from 'express';

import { ApiError } from '../utils';

export const ApiErrorHandlerMiddleware = async (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err instanceof ApiError) {
      const error: ApiError = { ...err };

      res.status(error.statusCode).json({
        error: error.errorMessage,
      });

      return;
    }

    res.json({
      error: err.message,
    });
  } catch (error) {
    next(error);
  }
};
