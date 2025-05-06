import { Router } from 'express';
import diaryRoutes from './diary.routes';
import userRoutes from './user.routes';
import locationRoutes from './location.routes';

const router = Router();

router.use('/diaries', diaryRoutes);
router.use('/users', userRoutes);
router.use('/locations', locationRoutes);

export default router;
