import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as userService from '../services/user.service';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import logger from '../utils/logger';

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, displayName } = req.body;

    const response = await userService.register({
      email,
      password,
      displayName,
    });

    res.status(201).json(response);
  } catch (error: any) {
    logger.error('User registration error:', error);

    if (error.message === 'User already exists') {
      return res.status(409).json({ message: 'このメールアドレスは既に使用されています' });
    }

    res.status(500).json({ message: '登録に失敗しました' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const response = await userService.login({ email, password });

    res.json(response);
  } catch (error: any) {
    logger.error('User login error:', error);

    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

    res.status(500).json({ message: 'ログインに失敗しました' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const user = await userService.getUserById(req.user.id);

    if (!user) {
      throw new AppError('ユーザーが見つかりません', 404);
    }

    // パスワードハッシュを除外
    const { passwordHash, ...userData } = user;

    res.json(userData);
  } catch (error: any) {
    logger.error('Get current user error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(500).json({ message: 'ユーザー情報の取得に失敗しました' });
  }
};
