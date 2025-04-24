import { Response, NextFunction, Request } from 'express';
import { FilterQuery } from 'mongoose';

import { Book } from '../../models';
import { IBook } from '../../types';
import { ApiError } from '../../utils';

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
      results: paginatedBooks,
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
