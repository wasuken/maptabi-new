import { Router } from 'express';
import { body } from 'express-validator';
import * as locationController from '../controllers/location.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// すべてのルートで認証が必要
router.use(authMiddleware);

// 位置情報の追加
router.post(
  '/diaries/:diaryId',
  [
    body('latitude').isFloat().withMessage('緯度は数値で入力してください'),
    body('longitude').isFloat().withMessage('経度は数値で入力してください')
  ],
  locationController.addLocation
);

// 位置情報の削除
router.delete('/:id', locationController.deleteLocation);

// ユーザーのすべての位置情報を取得
router.get('/', locationController.getAllUserLocations);

export default router;
