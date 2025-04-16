import express from 'express';

import connectDB from './database/mongodb';

import './config/env';
import { ApiErrorHandlerMiddleware, mongooseErrorMiddleware, rateLimiter } from './middlewares';
import { userRouter, authRouter, booksRouter } from './routes';

const port = 8000;

const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');

  res.setHeader('Access-Control-Allow-Credentials', 'true');

  next();
});

// middlewares
app.use(rateLimiter(5, 1000, 30));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/books', booksRouter);
app.use('/api/v1/user', userRouter);

// error handling
app.use(ApiErrorHandlerMiddleware);
app.use(mongooseErrorMiddleware);

app.get('/api/v1/', (_, res) => {
  res.send('RentLit Backend Api');
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await connectDB();
});
