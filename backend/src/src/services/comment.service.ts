import pool from '../config/database';
import { Comment, CommentInput } from '../types/comment.types';
import logger from '../utils/logger';

export const getCommentsByLocationId = async (locationId: number): Promise<Comment[]> => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT c.*, u.display_name as user_name 
       FROM location_comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.location_id = $1
       ORDER BY c.created_at DESC`,
      [locationId]
    );

    // レスポンスフォーマットの変換（スネークケース→キャメルケース）
    return result.rows.map((row) => ({
      id: row.id,
      locationId: row.location_id,
      userId: row.user_id,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      userName: row.user_name,
    }));
  } catch (error) {
    logger.error('Get comments by location id error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const createComment = async (
  locationId: number,
  commentInput: CommentInput,
  userId: number
): Promise<Comment> => {
  const client = await pool.connect();

  try {
    // 位置情報の存在確認
    const locationExists = await client.query('SELECT id FROM locations WHERE id = $1', [
      locationId,
    ]);

    if (locationExists.rows.length === 0) {
      throw new Error('Location not found');
    }

    // コメントの作成
    const result = await client.query(
      `INSERT INTO location_comments (location_id, user_id, content, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [locationId, userId, commentInput.content]
    );

    const comment = result.rows[0];

    // ユーザー名を取得
    const userResult = await client.query(`SELECT display_name FROM users WHERE id = $1`, [userId]);

    // レスポンスフォーマットの変換
    return {
      id: comment.id,
      locationId: comment.location_id,
      userId: comment.user_id,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      userName: userResult.rows[0]?.display_name,
    };
  } catch (error) {
    logger.error('Create comment error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const updateComment = async (
  commentId: number,
  commentInput: CommentInput,
  userId: number
): Promise<Comment> => {
  const client = await pool.connect();

  try {
    // コメントの存在確認とアクセス権の確認
    const commentExists = await client.query('SELECT * FROM location_comments WHERE id = $1', [
      commentId,
    ]);

    if (commentExists.rows.length === 0) {
      throw new Error('Comment not found');
    }

    if (commentExists.rows[0].user_id !== userId) {
      throw new Error('Unauthorized');
    }

    // コメントの更新
    const result = await client.query(
      `UPDATE location_comments
       SET content = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [commentInput.content, commentId]
    );

    const comment = result.rows[0];

    // ユーザー名を取得
    const userResult = await client.query(`SELECT display_name FROM users WHERE id = $1`, [userId]);

    // レスポンスフォーマットの変換
    return {
      id: comment.id,
      locationId: comment.location_id,
      userId: comment.user_id,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      userName: userResult.rows[0]?.display_name,
    };
  } catch (error) {
    logger.error('Update comment error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const deleteComment = async (commentId: number, userId: number): Promise<void> => {
  const client = await pool.connect();

  try {
    // コメントの存在確認とアクセス権の確認
    const commentExists = await client.query('SELECT * FROM location_comments WHERE id = $1', [
      commentId,
    ]);

    if (commentExists.rows.length === 0) {
      throw new Error('Comment not found');
    }

    if (commentExists.rows[0].user_id !== userId) {
      throw new Error('Unauthorized');
    }

    // コメントの削除
    await client.query('DELETE FROM location_comments WHERE id = $1', [commentId]);
  } catch (error) {
    logger.error('Delete comment error:', error);
    throw error;
  } finally {
    client.release();
  }
};
