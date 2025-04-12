import { Router } from 'express';
import { getUserData } from '../controllers';
import { authorize } from '../middlewares';

export const userRouter = Router();

userRouter.get('/', authorize, getUserData);
