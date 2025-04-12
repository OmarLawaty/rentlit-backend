import { Router } from 'express';
import { getUserData } from '../controllers';

export const userRouter = Router();

userRouter.get('/:id', getUserData);
