import { Router } from 'express';
import { body } from 'express-validator';
import * as commentController from '../controllers/comment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// すべてのルートで認証が必要
router.use(authMiddleware);

// 特定の位置情報に対するコメント一覧を取得
router.get('/locations/:locationId/comments', commentController.getCommentsByLocationId);

// コメントの追加
router.post(
  '/locations/:locationId/comments',
  [body('content').notEmpty().withMessage('コメント内容は必須です')],
  commentController.createComment
);

// コメントの更新
router.put(
  '/comments/:commentId',
  [body('content').notEmpty().withMessage('コメント内容は必須です')],
  commentController.updateComment
);

// コメントの削除
router.delete('/comments/:commentId', commentController.deleteComment);

export default router;
