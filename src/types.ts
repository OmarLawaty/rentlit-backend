export interface IUser {
  id: number;
  name: {
    first: string;
    last: string;
  };
  email: string;
  image: string | null;
  password: string;
  isVerified: boolean;
}

export interface IBook {
  title: string;
  author: string;
  genre: string[];
  rating: number;
  total_copies: number;
  available_copies: number;
  description: string;
  color: string;
  cover: string;
  video: string;
  summary: string;
}
