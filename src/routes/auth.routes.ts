import { Router } from 'express';
import { signIn, signUp } from '../controllers';

export const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.post('/log-in', signIn);
