import { Router } from 'express';
import { checkToken, signIn, signUp } from '../controllers';

export const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.post('/log-in', signIn);

authRouter.get('/check-token', checkToken);
