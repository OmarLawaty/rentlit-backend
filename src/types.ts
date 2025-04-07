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
