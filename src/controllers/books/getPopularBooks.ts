import { Response, NextFunction, Request } from 'express';

import { Book } from '../../models';
import { IBook } from '../../types';

export const getPopularBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find<IBook>({});

    const popularBooks = books
      .sort((a, b) => b.total_copies - b.available_copies - (a.total_copies - a.available_copies))
      .slice(0, 6);

    if (!popularBooks) {
      res.status(404).json({
        data: null,
        message: 'No books found in the db',
      });
      return;
    }

    res.status(200).json(popularBooks);
  } catch (error) {
    next(error);
  }
};
