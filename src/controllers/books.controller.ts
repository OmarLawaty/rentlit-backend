import { Response, NextFunction, Request } from 'express';
import { FilterQuery } from 'mongoose';

import { Book } from '../models';
import { IBook } from '../types';
import { ApiError } from '../utils';

interface IRequest extends Request {
  params: {
    id: string;
  };

  query: {
    search: string;
    per_page: string;
    limit?: string;
    page: string;
  };
}

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

export const getAllBooks = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    // query params
    const searchTerm = req.query.search;
    const itemsPerPage = Number(req.query.per_page ?? '12');
    let currentPage = Number(req.query.page ?? '1');

    let searchOptions: FilterQuery<IBook> = {};

    if (searchTerm) {
      searchOptions = {
        $or: [{ title: { $regex: searchTerm, $options: 'i' } }, { genres: { $regex: searchTerm, $options: 'i' } }],
      };
    }

    const books = await Book.find<IBook>(searchOptions);

    if (!books) throw new ApiError('Something went wrong', 400);

    const pagesCount = Math.ceil(books.length / itemsPerPage);

    if (currentPage > pagesCount) currentPage = pagesCount;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;

    const paginatedBooks = books.slice(startIndex, endIndex);

    res.status(200).json({
      books: paginatedBooks,
      meta: {
        currentPage,
        pagesCount,
        total: books.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
