import pool from '../config/database';
import { DiaryLocation, LocationInput } from '../types/location.types';
import logger from '../utils/logger';

export const addLocation = async (
  locationInput: LocationInput,
  userId: number
): Promise<DiaryLocation> => {
  const client = await pool.connect();

  try {
    // 日記の存在確認とアクセス権の確認
    const diaryExists = await client.query('SELECT * FROM diaries WHERE id = $1 AND user_id = $2', [
      locationInput.diaryId,
      userId,
    ]);

    if (diaryExists.rows.length === 0) {
      throw new Error('Diary not found or unauthorized');
    }

    // 位置情報の順序インデックスが指定されていない場合、最大値+1を設定
    let orderIndex = locationInput.orderIndex;

    if (orderIndex === undefined) {
      const maxOrderResult = await client.query(
        'SELECT MAX(order_index) as max_order FROM locations WHERE diary_id = $1',
        [locationInput.diaryId]
      );

      const maxOrder = maxOrderResult.rows[0].max_order;
      orderIndex = maxOrder ? maxOrder + 1 : 0;
    }

    // 位置情報の作成
    const result = await client.query(
      `INSERT INTO locations (
         diary_id, name, coordinates, altitude, recorded_at, order_index, created_at
       )
       VALUES (
         $1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5, $6, $7, NOW()
       )
       RETURNING *, ST_X(coordinates::geometry) as longitude, ST_Y(coordinates::geometry) as latitude`,
      [
        locationInput.diaryId,
        locationInput.name,
        locationInput.longitude,
        locationInput.latitude,
        locationInput.altitude,
        locationInput.recordedAt,
        orderIndex,
      ]
    );

    const location = result.rows[0];

    // 応答フォーマットの変換（スネークケース→キャメルケース）
    return {
      id: location.id,
      diaryId: location.diary_id,
      name: location.name,
      coordinates: location.coordinates,
      latitude: location.latitude,
      longitude: location.longitude,
      altitude: location.altitude,
      recordedAt: location.recorded_at,
      orderIndex: location.order_index,
      createdAt: location.created_at,
    };
  } catch (error) {
    logger.error('Add location error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const deleteLocation = async (locationId: number, userId: number): Promise<void> => {
  const client = await pool.connect();

  try {
    // 位置情報の存在確認と日記の所有権確認
    const locationExists = await client.query(
      `SELECT l.* FROM locations l
       JOIN diaries d ON l.diary_id = d.id
       WHERE l.id = $1 AND d.user_id = $2`,
      [locationId, userId]
    );

    if (locationExists.rows.length === 0) {
      throw new Error('Location not found or unauthorized');
    }

    // 位置情報の削除
    await client.query('DELETE FROM locations WHERE id = $1', [locationId]);
  } catch (error) {
    logger.error('Delete location error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getAllUserLocations = async (userId: number): Promise<DiaryLocation[]> => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT l.*, 
              ST_X(coordinates::geometry) as longitude, 
              ST_Y(coordinates::geometry) as latitude,
              d.title as diary_title
       FROM locations l
       JOIN diaries d ON l.diary_id = d.id
       WHERE d.user_id = $1
       ORDER BY l.diary_id, l.order_index`,
      [userId]
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
      diaryTitle: row.diary_title, // 追加情報
    }));
  } catch (error) {
    logger.error('Get all user locations error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getPublicLocationsNearby = async (
  latitude: number,
  longitude: number,
  radiusKm: number,
  maxDiaries: number = 30,
  maxLocationsPerDiary: number = 50
): Promise<DiaryLocation[]> => {
  const client = await pool.connect();

  try {
    // 指定された座標から特定の距離内の公開日記の位置情報を取得
    // 1. まず対象となる日記IDを取得 (公開フラグがtrueのもののみ)
    // 2. 各日記の位置情報について距離でフィルタリング
    // 3. 日記ごとの上限と全体の上限を適用
    const query = `
      WITH nearby_diaries AS (
        SELECT DISTINCT d.id, d.title, d.user_id, d.created_at
        FROM diaries d
        JOIN locations l ON d.id = l.diary_id
        WHERE d.is_public = TRUE
        AND ST_DWithin(
          l.coordinates::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3 * 1000
        )
        ORDER BY d.created_at DESC
        LIMIT $4
      ),
      limited_locations AS (
        SELECT l.*, d.title as diary_title, d.user_id,
               ST_X(l.coordinates::geometry) as longitude,
               ST_Y(l.coordinates::geometry) as latitude,
               row_number() OVER (PARTITION BY l.diary_id ORDER BY l.order_index) as rn
        FROM locations l
        JOIN nearby_diaries d ON l.diary_id = d.id
        WHERE ST_DWithin(
          l.coordinates::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3 * 1000
        )
      )
      SELECT * FROM limited_locations
      WHERE rn <= $5
      ORDER BY diary_id, order_index;
    `;
    const result = await client.query(query, [
      longitude,
      latitude,
      radiusKm,
      maxDiaries,
      maxLocationsPerDiary,
    ]);

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
      diaryTitle: row.diary_title,
      userId: row.user_id,
    }));
  } catch (error) {
    logger.error('Get public locations nearby error:', error);
    throw error;
  } finally {
    client.release();
  }
};
