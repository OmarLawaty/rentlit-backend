export interface IUser {
  _id: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  image: string | null;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  borrowedBooks: number;
}

export interface IBook {
  _id: string;
  title: string;
  author: string;
  genres: string[];
  rating: number;
  total_copies: number;
  available_copies: number;
  description: string;
  color: string;
  cover: string;
  video: string;
  summary: string;
}
