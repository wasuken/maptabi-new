import { Response } from 'express';
import { validationResult } from 'express-validator';
import * as commentService from '../services/comment.service';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import logger from '../utils/logger';

export const getCommentsByLocationId = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const locationId = parseInt(req.params.locationId);

    if (isNaN(locationId)) {
      throw new AppError('無効な位置情報IDです', 400);
    }

    const comments = await commentService.getCommentsByLocationId(locationId);

    res.json(comments);
  } catch (error: unknown) {
    logger.error('Get comments by location id error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(500).json({ message: 'コメントの取得に失敗しました' });
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const locationId = parseInt(req.params.locationId);

    if (isNaN(locationId)) {
      throw new AppError('無効な位置情報IDです', 400);
    }

    const { content } = req.body;

    const newComment = await commentService.createComment(locationId, { content }, req.user.id);

    res.status(201).json(newComment);
  } catch (error: unknown) {
    logger.error('Create comment error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    if (error instanceof Error) {
      if (error.message === 'Location not found') {
        return res.status(404).json({ message: '位置情報が見つかりません' });
      }
    }

    res.status(500).json({ message: 'コメントの作成に失敗しました' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const commentId = parseInt(req.params.commentId);

    if (isNaN(commentId)) {
      throw new AppError('無効なコメントIDです', 400);
    }

    const { content } = req.body;

    const updatedComment = await commentService.updateComment(commentId, { content }, req.user.id);

    res.json(updatedComment);
  } catch (error: unknown) {
    logger.error('Update comment error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    if (error instanceof Error) {
      if (error.message === 'Comment not found') {
        return res.status(404).json({ message: 'コメントが見つかりません' });
      }

      if (error.message === 'Unauthorized') {
        return res.status(403).json({ message: 'このコメントを編集する権限がありません' });
      }
    }

    res.status(500).json({ message: 'コメントの更新に失敗しました' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const commentId = parseInt(req.params.commentId);

    if (isNaN(commentId)) {
      throw new AppError('無効なコメントIDです', 400);
    }

    await commentService.deleteComment(commentId, req.user.id);

    res.status(204).send();
  } catch (error: unknown) {
    logger.error('Delete comment error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    if (error instanceof Error) {
      if (error.message === 'Comment not found') {
        return res.status(404).json({ message: 'コメントが見つかりません' });
      }

      if (error.message === 'Unauthorized') {
        return res.status(403).json({ message: 'このコメントを削除する権限がありません' });
      }
    }

    res.status(500).json({ message: 'コメントの削除に失敗しました' });
  }
};
