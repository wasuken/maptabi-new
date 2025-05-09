import { Router } from 'express';
import { body } from 'express-validator';
import * as diaryController from '../controllers/diary.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// すべてのルートで認証が必要
router.use(authMiddleware);

// 日記一覧の取得
router.get('/', diaryController.getAllDiaries);

// 日記の取得
router.get('/:id', diaryController.getDiaryById);

// 日記の作成
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('タイトルは必須です'),
    body('content').notEmpty().withMessage('本文は必須です'),
  ],
  diaryController.createDiary
);

// 日記の更新
router.put(
  '/:id',
  [
    body('title').notEmpty().withMessage('タイトルは必須です'),
    body('content').notEmpty().withMessage('本文は必須です'),
  ],
  diaryController.updateDiary
);

// 日記の削除
router.delete('/:id', diaryController.deleteDiary);

// 特定の日記の位置情報を取得
router.get('/:id/locations', diaryController.getDiaryLocations);

// 日記の位置情報を更新
router.post(
  '/:id/locations',
  [
    body('locations').isArray().withMessage('位置情報は配列形式で指定してください'),
    body('locations.*.latitude').isFloat().withMessage('緯度は数値で入力してください'),
    body('locations.*.longitude').isFloat().withMessage('経度は数値で入力してください'),
  ],
  diaryController.updateDiaryLocations
);

export default router;
