import { Router } from 'express';
import { body, query } from 'express-validator';
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
    body('longitude').isFloat().withMessage('経度は数値で入力してください'),
  ],
  locationController.addLocation
);

// 位置情報の削除
router.delete('/:id', locationController.deleteLocation);

// ユーザーのすべての位置情報を取得
router.get('/', locationController.getAllUserLocations);

router.get(
  '/public/nearby',
  [
    query('latitude').isFloat().withMessage('緯度は数値で入力してください'),
    query('longitude').isFloat().withMessage('経度は数値で入力してください'),
    query('radiusKm')
      .optional()
      .isFloat({ min: 0.1, max: 100 })
      .withMessage('範囲は0.1km〜100kmの間である必要があります'),
    query('maxDiaries')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('日記の最大表示数は1〜100の間である必要があります'),
    query('maxLocationsPerDiary')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('日記ごとの位置情報の最大表示数は1〜100の間である必要があります'),
  ],
  locationController.getPublicLocationsNearby
);

export default router;
