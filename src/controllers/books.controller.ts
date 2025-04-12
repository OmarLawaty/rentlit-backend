import { Response, NextFunction, Request } from 'express';

import { Book } from '../models';
import { IBook } from '../types';

export const getFeaturedBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books: IBook[] = await Book.find({});

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

    res.status(200).json({
      data: featuredBook,
    });
  } catch (error) {
    next(error);
  }
};

export const getPopularBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books: IBook[] = await Book.find({});

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

    res.status(200).json({
      data: popularBooks,
    });
  } catch (error) {
    next(error);
  }
};
