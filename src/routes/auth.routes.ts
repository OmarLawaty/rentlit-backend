import { Router } from 'express';
import { adminSignIn, checkToken, signIn, signUp } from '../controllers';

export const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.post('/log-in', signIn);

authRouter.post('/admin/log-in', adminSignIn);

authRouter.get('/check-token', checkToken);
