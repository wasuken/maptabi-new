import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { JwtPayload } from '../types/user.types';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: '認証トークンがありません' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '認証トークンの形式が不正です' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: '認証に失敗しました' });
  }
};
