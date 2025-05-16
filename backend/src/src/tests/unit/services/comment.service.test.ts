import pool from '../../../config/database';
import * as commentService from '../../../services/comment.service';

// データベースのモック
jest.mock('../../../config/database', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };

  return {
    connect: jest.fn().mockResolvedValue(mockClient),
    query: jest.fn(),
  };
});

describe('Comment Service', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);
  });

  describe('getCommentsByLocationId', () => {
    it('should return all comments for a location', async () => {
      // モックの設定
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            location_id: 1,
            user_id: 1,
            content: 'テストコメント',
            created_at: new Date(),
            updated_at: new Date(),
            user_name: 'テストユーザー',
          },
        ],
      });

      // サービス呼び出し
      const result = await commentService.getCommentsByLocationId(1);

      // 検証
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT c.*, u.display_name as user_name'),
        [1]
      );
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(1);
      expect(result[0].locationId).toBe(1);
      expect(result[0].content).toBe('テストコメント');
      expect(result[0].userName).toBe('テストユーザー');
    });
  });

  describe('createComment', () => {
    it('should create a comment for a location', async () => {
      // モックの設定
      // 位置情報の確認
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1 }],
      });

      // コメント作成
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            location_id: 1,
            user_id: 1,
            content: 'テストコメント',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      });

      // ユーザー名取得
      mockClient.query.mockResolvedValueOnce({
        rows: [{ display_name: 'テストユーザー' }],
      });

      const commentInput = { content: 'テストコメント' };

      // サービス呼び出し
      const result = await commentService.createComment(1, commentInput, 1);

      // 検証
      expect(mockClient.query).toHaveBeenNthCalledWith(
        1,
        'SELECT id FROM locations WHERE id = $1',
        [1]
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('INSERT INTO location_comments'),
        [1, 1, 'テストコメント']
      );
      expect(result.content).toBe('テストコメント');
      expect(result.userName).toBe('テストユーザー');
    });

    it('should throw error if location not found', async () => {
      // モックの設定
      mockClient.query.mockResolvedValueOnce({
        rows: [],
      });

      const commentInput = { content: 'テストコメント' };

      // サービス呼び出し & エラー検証
      await expect(commentService.createComment(999, commentInput, 1)).rejects.toThrow(
        'Location not found'
      );
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      // モックの設定
      // コメント確認
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, user_id: 1, content: '元のコメント' }],
      });

      // コメント更新
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            location_id: 1,
            user_id: 1,
            content: '更新したコメント',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      });

      // ユーザー名取得
      mockClient.query.mockResolvedValueOnce({
        rows: [{ display_name: 'テストユーザー' }],
      });

      const commentInput = { content: '更新したコメント' };

      // サービス呼び出し
      const result = await commentService.updateComment(1, commentInput, 1);

      // 検証
      expect(mockClient.query).toHaveBeenNthCalledWith(
        1,
        'SELECT * FROM location_comments WHERE id = $1',
        [1]
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('UPDATE location_comments'),
        ['更新したコメント', 1]
      );
      expect(result.content).toBe('更新したコメント');
    });

    it('should throw error if comment not found', async () => {
      // モックの設定
      mockClient.query.mockResolvedValueOnce({
        rows: [],
      });

      const commentInput = { content: '更新したコメント' };

      // サービス呼び出し & エラー検証
      await expect(commentService.updateComment(999, commentInput, 1)).rejects.toThrow(
        'Comment not found'
      );
    });

    it('should throw error if user is not authorized', async () => {
      // モックの設定
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, user_id: 2, content: '他人のコメント' }],
      });

      const commentInput = { content: '更新したコメント' };

      // サービス呼び出し & エラー検証
      await expect(commentService.updateComment(1, commentInput, 1)).rejects.toThrow(
        'Unauthorized'
      );
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      // モックの設定
      // コメント確認
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, user_id: 1 }],
      });

      // コメント削除
      mockClient.query.mockResolvedValueOnce({
        rowCount: 1,
      });

      // サービス呼び出し
      await commentService.deleteComment(1, 1);

      // 検証
      expect(mockClient.query).toHaveBeenNthCalledWith(
        1,
        'SELECT * FROM location_comments WHERE id = $1',
        [1]
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(
        2,
        'DELETE FROM location_comments WHERE id = $1',
        [1]
      );
    });

    it('should throw error if comment not found', async () => {
      // モックの設定
      mockClient.query.mockResolvedValueOnce({
        rows: [],
      });

      // サービス呼び出し & エラー検証
      await expect(commentService.deleteComment(999, 1)).rejects.toThrow('Comment not found');
    });

    it('should throw error if user is not authorized', async () => {
      // モックの設定
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 1, user_id: 2 }],
      });

      // サービス呼び出し & エラー検証
      await expect(commentService.deleteComment(1, 1)).rejects.toThrow('Unauthorized');
    });
  });
});
