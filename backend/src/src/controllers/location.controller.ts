import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as locationService from '../services/location.service';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import logger from '../utils/logger';

export const addLocation = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const diaryId = parseInt(req.params.diaryId);

    if (isNaN(diaryId)) {
      throw new AppError('無効な日記IDです', 400);
    }

    const { name, latitude, longitude, altitude, recordedAt, orderIndex } = req.body;

    const newLocation = await locationService.addLocation(
      {
        diaryId,
        name,
        latitude,
        longitude,
        altitude,
        recordedAt,
        orderIndex,
      },
      req.user.id
    );

    res.status(201).json(newLocation);
  } catch (error: Error) {
    logger.error('Add location error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    if (error.message === 'Diary not found') {
      return res.status(404).json({ message: '日記が見つかりません' });
    }

    if (error.message === 'Unauthorized') {
      return res.status(403).json({ message: 'この日記に位置情報を追加する権限がありません' });
    }

    res.status(500).json({ message: '位置情報の追加に失敗しました' });
  }
};

export const deleteLocation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const locationId = parseInt(req.params.id);

    if (isNaN(locationId)) {
      throw new AppError('無効な位置情報IDです', 400);
    }

    await locationService.deleteLocation(locationId, req.user.id);

    res.status(204).send();
  } catch (error: Error) {
    logger.error('Delete location error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    if (error.message === 'Location not found') {
      return res.status(404).json({ message: '位置情報が見つかりません' });
    }

    if (error.message === 'Unauthorized') {
      return res.status(403).json({ message: 'この位置情報を削除する権限がありません' });
    }

    res.status(500).json({ message: '位置情報の削除に失敗しました' });
  }
};

export const getAllUserLocations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const locations = await locationService.getAllUserLocations(req.user.id);

    res.json(locations);
  } catch (error: Error) {
    logger.error('Get all user locations error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(500).json({ message: '位置情報の取得に失敗しました' });
  }
};

export const getPublicLocationsNearby = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // パラメータの取得と検証
    const latitude = parseFloat(req.query.latitude as string);
    const longitude = parseFloat(req.query.longitude as string);
    const radiusKm = parseFloat(req.query.radiusKm as string) || 5; // デフォルト5km
    const maxDiaries = parseInt(req.query.maxDiaries as string) || 30; // デフォルト30件
    const maxLocationsPerDiary = parseInt(req.query.maxLocationsPerDiary as string) || 50; // デフォルト50件

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        message: '緯度・経度は必須で、有効な数値である必要があります',
      });
    }

    // 位置情報の取得
    const locations = await locationService.getPublicLocationsNearby(
      latitude,
      longitude,
      radiusKm,
      maxDiaries,
      maxLocationsPerDiary
    );

    res.json(locations);
  } catch (error: Error) {
    logger.error('Get public locations nearby error:', error);
    res.status(500).json({ message: '位置情報の取得に失敗しました' });
  }
};
