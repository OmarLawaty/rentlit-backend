import { Response, NextFunction, Request } from 'express';

import { Book } from '../../models';
import { IBook } from '../../types';

export const getFeaturedBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find<IBook>({});

    const featuredBook = books
      .sort((a, b) => b.total_copies - b.available_copies - (a.total_copies - a.available_copies))
      .filter((ele) => ele.rating >= 4)[0];

    if (!featuredBook) {
      res.status(404).json({
        data: null,
        message: 'No featured books available: All book ratings are below 4 stars',
      });

      return;
    }

    res.status(200).json(featuredBook);
  } catch (error) {
    next(error);
  }
};
