import { Response, NextFunction, Request } from 'express';

import { Book } from '../../models';
import { IBook } from '../../types';
import { ApiError } from '../../utils';

interface IRequest extends Request {
  params: {
    id: string;
  };

  query: {
    limit?: string;
  };
}

export const getSimilarBooks = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) throw new ApiError('Book Id not provided', 400);

    const limit = Number(req.query.limit ?? 999);

    const book = await Book.findById<IBook>(req.params.id);

    if (!book) throw new ApiError('Book not found', 404);

    const books = await Book.find<IBook>({ genres: { $in: book.genres }, _id: { $ne: book._id } });

    if (!books) throw new ApiError('No Similar books found', 404);

    res.status(200).json(books.slice(0, limit));
  } catch (error) {
    next(error);
  }
};
