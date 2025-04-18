import { Router } from 'express';
import { getPopularBooks, getFeaturedBook, getBookById, getSimilarBooks, getAllBooks } from '../controllers';

export const booksRouter = Router();

booksRouter.get('/featured', getFeaturedBook);

booksRouter.get('/popular', getPopularBooks);

booksRouter.get('/:id', getBookById);

booksRouter.get('/:id/similar', getSimilarBooks);

booksRouter.get('/', getAllBooks);
