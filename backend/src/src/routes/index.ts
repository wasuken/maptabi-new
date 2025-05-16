import { Router } from 'express';
import diaryRoutes from './diary.routes';
import userRoutes from './user.routes';
import locationRoutes from './location.routes';
import commentRoutes from './comment.routes';

const router = Router();

router.use('/diaries', diaryRoutes);
router.use('/users', userRoutes);
router.use('/locations', locationRoutes);
router.use('/', commentRoutes);

export default router;
