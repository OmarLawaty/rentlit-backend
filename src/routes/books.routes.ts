import { Router } from 'express';
import { getPopularBooks, getFeaturedBook } from '../controllers';

export const booksRouter = Router();

booksRouter.get('/featured', getFeaturedBook);

booksRouter.get('/popular', getPopularBooks);
