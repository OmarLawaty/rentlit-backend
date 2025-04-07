import express from 'express';

import connectDB from './database/mongodb';

import './config/env';
import { ApiErrorHandlerMiddleware, mongooseErrorMiddleware } from './middlewares';
import { authRouter } from './routes/auth.routes';
import rateLimiter from './middlewares/rateLimiter.middleware';

const port = 8000;

const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  res.setHeader('Access-Control-Allow-Credentials', 'true');

  next();
});

// middlewares
app.use(rateLimiter(5, 1000, 10));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app routes
app.use('/api/v1/auth', authRouter);

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
