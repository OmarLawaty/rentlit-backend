import express from 'express';

const port = 8000;

const app = express();

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
