import { Response, NextFunction, Request } from 'express';

import { Book } from '../../models';
import { IBook } from '../../types';
import { ApiError } from '../../utils';

interface IRequest extends Request {
  params: {
    id: string;
  };
}

export const getBookById = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) throw new ApiError('Book Id not provided', 400);

    const book = await Book.findById<IBook>(req.params.id);

    if (!book) throw new ApiError('Book not found', 404);

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};
