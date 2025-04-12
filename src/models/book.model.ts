import { model, Schema } from 'mongoose';

import type { IBook } from '../types';

const BookSchema: Schema<IBook> = new Schema<IBook>({
  title: { type: String, required: true },

  author: { type: String, required: true },

  genre: { type: String, required: true },

  rating: { type: Number },

  total_copies: { type: Number, required: true, min: 0 },

  available_copies: {
    type: Number,
    required: true,
    min: 0,
  },

  description: { type: String, required: true },
  color: { type: String, required: true },
  cover: { type: String, required: true },
  video: { type: String, required: true },
  summary: { type: String, required: true },
});

BookSchema.pre('save', function (next) {
  if (this.available_copies > this.total_copies) {
    next(new Error('Available copies cannot be more than total copies'));
  } else {
    next();
  }
});

export const Book = model<IBook>('Book', BookSchema);
