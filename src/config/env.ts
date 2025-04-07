import { config } from 'dotenv';

config();

export const { NODE_ENV, DB_URI, JWT_SECRET } = process.env;
