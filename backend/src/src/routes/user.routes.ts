import { Router } from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// ユーザー登録
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
    body('password').isLength({ min: 6 }).withMessage('パスワードは6文字以上である必要があります'),
    body('displayName').notEmpty().withMessage('表示名は必須です'),
  ],
  userController.register
);

// ログイン
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
    body('password').notEmpty().withMessage('パスワードは必須です'),
  ],
  userController.login
);

// 現在のユーザー情報を取得
router.get('/me', authMiddleware, userController.getCurrentUser);

export default router;
