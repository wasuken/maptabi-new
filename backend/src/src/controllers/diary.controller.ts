import { Response } from 'express';
import { validationResult } from 'express-validator';
import * as diaryService from '../services/diary.service';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import logger from '../utils/logger';

export const getAllDiaries = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const diaries = await diaryService.getAllDiaries(req.user.id);

    res.json(diaries);
  } catch (error: unknown) {
    logger.error('Get all diaries error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(500).json({ message: '日記の取得に失敗しました' });
  }
};

export const getDiaryById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const diaryId = parseInt(req.params.id);

    if (isNaN(diaryId)) {
      throw new AppError('無効な日記IDです', 400);
    }

    const diary = await diaryService.getDiaryById(diaryId, req.user.id);

    if (!diary) {
      throw new AppError('日記が見つかりません', 404);
    }

    res.json(diary);
  } catch (error: unknown) {
    logger.error('Get diary by id error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(500).json({ message: '日記の取得に失敗しました' });
  }
};

export const createDiary = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const { title, content, isPublic } = req.body;

    const newDiary = await diaryService.createDiary(
      {
        title,
        content,
        isPublic: isPublic || false,
      },
      req.user.id
    );

    res.status(201).json(newDiary);
  } catch (error: unknown) {
    logger.error('Create diary error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(500).json({ message: '日記の作成に失敗しました' });
  }
};

export const updateDiary = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const diaryId = parseInt(req.params.id);

    if (isNaN(diaryId)) {
      throw new AppError('無効な日記IDです', 400);
    }

    const { title, content, isPublic } = req.body;

    const updatedDiary = await diaryService.updateDiary(
      diaryId,
      {
        title,
        content,
        isPublic,
      },
      req.user.id
    );

    res.json(updatedDiary);
  } catch (error: unknown) {
    logger.error('Update diary error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error instanceof Error) {
      if (error.message === 'Diary not found') {
        return res.status(404).json({ message: '日記が見つかりません' });
      }

      if (error.message === 'Unauthorized') {
        return res.status(403).json({ message: 'この日記を編集する権限がありません' });
      }
    }

    res.status(500).json({ message: '日記の更新に失敗しました' });
  }
};

export const deleteDiary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const diaryId = parseInt(req.params.id);

    if (isNaN(diaryId)) {
      throw new AppError('無効な日記IDです', 400);
    }

    await diaryService.deleteDiary(diaryId, req.user.id);

    res.status(204).send();
  } catch (error: unknown) {
    logger.error('Delete diary error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error instanceof Error) {
      if (error.message === 'Diary not found') {
        return res.status(404).json({ message: '日記が見つかりません' });
      }

      if (error.message === 'Unauthorized') {
        return res.status(403).json({ message: 'この日記を削除する権限がありません' });
      }
    }

    res.status(500).json({ message: '日記の削除に失敗しました' });
  }
};

export const getDiaryLocations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const diaryId = parseInt(req.params.id);

    if (isNaN(diaryId)) {
      throw new AppError('無効な日記IDです', 400);
    }

    const locations = await diaryService.getDiaryLocations(diaryId, req.user.id);

    res.json(locations);
  } catch (error: unknown) {
    logger.error('Get diary locations error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(500).json({ message: '位置情報の取得に失敗しました' });
  }
};

export const updateDiaryLocations = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user || !req.user.id) {
      throw new AppError('認証されていません', 401);
    }

    const diaryId = parseInt(req.params.id);

    if (isNaN(diaryId)) {
      throw new AppError('無効な日記IDです', 400);
    }

    const { locations } = req.body;

    if (!Array.isArray(locations)) {
      throw new AppError('位置情報は配列形式で指定してください', 400);
    }

    const updatedLocations = await diaryService.updateDiaryLocations(
      diaryId,
      locations,
      req.user.id
    );

    res.json(updatedLocations);
  } catch (error: unknown) {
    logger.error('Update diary locations error:', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error instanceof AppError) {
      if (error.message === 'Diary not found') {
        return res.status(404).json({ message: '日記が見つかりません' });
      }

      if (error.message === 'Unauthorized') {
        return res.status(403).json({ message: 'この日記の位置情報を更新する権限がありません' });
      }
    }

    res.status(500).json({ message: '位置情報の更新に失敗しました' });
  }
};
