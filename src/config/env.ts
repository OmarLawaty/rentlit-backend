import { config } from 'dotenv';

config();

export const { NODE_ENV, DB_URI } = process.env;
