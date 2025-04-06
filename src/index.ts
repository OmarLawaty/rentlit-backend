import express from 'express';

import connectDB from './database/mongodb';

import './config/env';

const port = 8000;

const app = express();

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await connectDB();
});
