import pool from '../config/database';
import { Diary, DiaryInput, DiaryWithLocations } from '../types/diary.types';
import { DiaryLocation } from '../types/location.types';
import logger from '../utils/logger';

export const getAllDiaries = async (userId: number): Promise<Diary[]> => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT * FROM diaries 
      WHERE user_id = $1 
      ORDER BY created_at DESC`,
      [userId]
    );

    // 応答フォーマットの変換（スネークケース→キャメルケース）
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      isPublic: row.is_public,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (error) {
    logger.error('Get all diaries error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getDiaryById = async (
  diaryId: number,
  userId: number
): Promise<DiaryWithLocations | null> => {
  const client = await pool.connect();

  try {
    // 日記の取得
    const diaryResult = await client.query(
      `SELECT * FROM diaries 
      WHERE id = $1 AND (user_id = $2 OR is_public = TRUE)`,
      [diaryId, userId]
    );

    if (diaryResult.rows.length === 0) {
      return null;
    }

    const diary = diaryResult.rows[0];

    // 位置情報の取得
    const locationsResult = await client.query(
      `SELECT l.*, 
      ST_X(coordinates::geometry) as longitude, 
      ST_Y(coordinates::geometry) as latitude 
      FROM locations l
      WHERE diary_id = $1
      ORDER BY order_index`,
      [diaryId]
    );

    // 応答フォーマットの変換（スネークケース→キャメルケース）
    const formattedDiary: DiaryWithLocations = {
      id: diary.id,
      userId: diary.user_id,
      title: diary.title,
      content: diary.content,
      isPublic: diary.is_public,
      createdAt: diary.created_at,
      updatedAt: diary.updated_at,
      locations: locationsResult.rows.map((row) => ({
        id: row.id,
        diaryId: row.diary_id,
        name: row.name,
        coordinates: row.coordinates,
        latitude: row.latitude,
        longitude: row.longitude,
        altitude: row.altitude,
        recordedAt: row.recorded_at,
        orderIndex: row.order_index,
        createdAt: row.created_at,
      })),
    };

    return formattedDiary;
  } catch (error) {
    logger.error('Get diary by id error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const createDiary = async (diaryInput: DiaryInput, userId: number): Promise<Diary> => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `INSERT INTO diaries (user_id, title, content, is_public, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *`,
      [userId, diaryInput.title, diaryInput.content, diaryInput.isPublic || false]
    );

    const diary = result.rows[0];

    // 応答フォーマットの変換（スネークケース→キャメルケース）
    return {
      id: diary.id,
      userId: diary.user_id,
      title: diary.title,
      content: diary.content,
      isPublic: diary.is_public,
      createdAt: diary.created_at,
      updatedAt: diary.updated_at,
    };
  } catch (error) {
    logger.error('Create diary error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const updateDiary = async (
  diaryId: number,
  diaryInput: DiaryInput,
  userId: number
): Promise<Diary> => {
  const client = await pool.connect();

  try {
    // 日記の存在確認とアクセス権の確認
    const diaryExists = await client.query('SELECT * FROM diaries WHERE id = $1', [diaryId]);

    if (Object.keys(diaryExists).length === 0 || diaryExists.rows.length === 0) {
      throw new Error('Diary not found');
    }

    if (diaryExists.rows[0].user_id !== userId) {
      throw new Error('Unauthorized');
    }

    const result = await client.query(
      `UPDATE diaries 
      SET title = $1, content = $2, is_public = $3, updated_at = NOW()
      WHERE id = $4 AND user_id = $5
      RETURNING *`,
      [diaryInput.title, diaryInput.content, diaryInput.isPublic, diaryId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Diary update failed');
    }

    const diary = result.rows[0];

    // 応答フォーマットの変換（スネークケース→キャメルケース）
    return {
      id: diary.id,
      userId: diary.user_id,
      title: diary.title,
      content: diary.content,
      isPublic: diary.is_public,
      createdAt: diary.created_at,
      updatedAt: diary.updated_at,
    };
  } catch (error) {
    logger.error('Update diary error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const deleteDiary = async (diaryId: number, userId: number): Promise<void> => {
  const client = await pool.connect();

  try {
    // 日記の存在確認とアクセス権の確認
    const diaryExists = await client.query('SELECT * FROM diaries WHERE id = $1', [diaryId]);

    if (Object.keys(diaryExists).length === 0 || diaryExists.rows.length === 0) {
      throw new Error('Diary not found');
    }

    if (diaryExists.rows[0].user_id !== userId) {
      throw new Error('Unauthorized');
    }

    await client.query('BEGIN');

    // 関連する位置情報を削除
    await client.query('DELETE FROM locations WHERE diary_id = $1', [diaryId]);

    // 日記を削除
    const result = await client.query('DELETE FROM diaries WHERE id = $1 AND user_id = $2', [
      diaryId,
      userId,
    ]);

    if (result.rowCount === 0) {
      throw new Error('Diary deletion failed');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Delete diary error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getDiaryLocations = async (
  diaryId: number,
  userId: number
): Promise<DiaryLocation[]> => {
  const client = await pool.connect();

  try {
    // 日記の存在確認とアクセス権の確認
    const diaryExists = await client.query(
      'SELECT * FROM diaries WHERE id = $1 AND (user_id = $2 OR is_public = TRUE)',
      [diaryId, userId]
    );

    if (Object.keys(diaryExists).length === 0 || diaryExists.rows.length === 0) {
      throw new Error('Diary not found or unauthorized');
    }

    const result = await client.query(
      `SELECT l.*, 
      ST_X(coordinates::geometry) as longitude, 
      ST_Y(coordinates::geometry) as latitude 
      FROM locations l
      WHERE diary_id = $1
      ORDER BY order_index`,
      [diaryId]
    );

    // 応答フォーマットの変換（スネークケース→キャメルケース）
    return result.rows.map((row) => ({
      id: row.id,
      diaryId: row.diary_id,
      name: row.name,
      coordinates: row.coordinates,
      latitude: row.latitude,
      longitude: row.longitude,
      altitude: row.altitude,
      recordedAt: row.recorded_at,
      orderIndex: row.order_index,
      createdAt: row.created_at,
    }));
  } catch (error) {
    logger.error('Get diary locations error:', error);
    throw error;
  } finally {
    client.release();
  }
};

// 既存のimportに追加
import { LocationInput } from '../types/location.types';

export const updateDiaryLocations = async (
  diaryId: number,
  locations: LocationInput[],
  userId: number
): Promise<DiaryLocation[]> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 日記の存在確認とアクセス権の確認
    const diaryExists = await client.query('SELECT * FROM diaries WHERE id = $1 AND user_id = $2', [
      diaryId,
      userId,
    ]);

    if (Object.keys(diaryExists).length === 0 || diaryExists.rows.length === 0) {
      throw new Error('Diary not found or unauthorized');
    }

    // 既存の位置情報をすべて削除
    await client.query('DELETE FROM locations WHERE diary_id = $1', [diaryId]);

    // 新しい位置情報を挿入
    const insertedLocations: DiaryLocation[] = [];

    for (let i = 0; i < locations.length; i++) {
      const location = locations[i];
      const orderIndex = location.orderIndex !== undefined ? location.orderIndex : i;

      const result = await client.query(
        `INSERT INTO locations (
           diary_id, name, coordinates, altitude, recorded_at, order_index, created_at
         )
         VALUES (
           $1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5, $6, $7, NOW()
         )
         RETURNING *, ST_X(coordinates::geometry) as longitude, ST_Y(coordinates::geometry) as latitude`,
        [
          diaryId,
          location.name || null,
          location.longitude,
          location.latitude,
          location.altitude || null,
          location.recordedAt || null,
          orderIndex,
        ]
      );

      const insertedLocation = result.rows[0];

      insertedLocations.push({
        id: insertedLocation.id,
        diaryId: insertedLocation.diary_id,
        name: insertedLocation.name,
        coordinates: insertedLocation.coordinates,
        latitude: insertedLocation.latitude,
        longitude: insertedLocation.longitude,
        altitude: insertedLocation.altitude,
        recordedAt: insertedLocation.recorded_at,
        orderIndex: insertedLocation.order_index,
        createdAt: insertedLocation.created_at,
      });
    }

    await client.query('COMMIT');

    return insertedLocations;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Update diary locations error:', error);
    throw error;
  } finally {
    client.release();
  }
};
