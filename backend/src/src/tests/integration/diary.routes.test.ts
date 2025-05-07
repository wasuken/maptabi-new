import request from 'supertest';
import app from '../../app';
import pool from '../../config/database';
import * as authUtils from '../../utils/auth';

jest.mock('../../config/database');
jest.mock('../../utils/auth');

describe('Diary Routes', () => {
  const mockToken = 'valid-token';

  beforeEach(() => {
    jest.clearAllMocks();

    // トークン検証のモック
    (authUtils.verifyToken as jest.Mock).mockReturnValue({ id: 1, email: 'test@example.com' });
  });

  describe('GET /api/diaries', () => {
    it('should return all diaries for authenticated user', async () => {
      // データベースクエリのモック
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            user_id: 1,
            title: 'Test Diary',
            content: 'Content',
            is_public: false,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      });

      // APIリクエスト
      const response = await request(app)
        .get('/api/diaries')
        .set('Authorization', `Bearer ${mockToken}`);

      // 検証
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(1);
      expect(response.body[0].title).toBe('Test Diary');
    });

    it('should return 401 when not authenticated', async () => {
      // APIリクエスト（認証トークンなし）
      const response = await request(app).get('/api/diaries');

      // 検証
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/diaries/:id/locations', () => {
    it('should update diary locations', async () => {
      // モックの設定
      // 日記の存在確認
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: 1, user_id: 1 }],
      });

      // 古い位置情報の削除
      (pool.query as jest.Mock).mockResolvedValueOnce({});

      // 新しい位置情報の追加
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            diary_id: 1,
            name: 'Tokyo Tower',
            coordinates: 'POINT(139.7673068 35.6809591)',
            latitude: 35.6809591,
            longitude: 139.7673068,
            altitude: 10.5,
            recorded_at: null,
            order_index: 0,
            created_at: new Date(),
          },
        ],
      });

      // APIリクエスト
      const response = await request(app)
        .post('/api/diaries/1/locations')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          locations: [
            {
              latitude: 35.6809591,
              longitude: 139.7673068,
              name: 'Tokyo Tower',
              altitude: 10.5,
            },
          ],
        });

      // 検証
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Tokyo Tower');
      expect(response.body[0].latitude).toBe(35.6809591);
      expect(response.body[0].longitude).toBe(139.7673068);
    });

    it('should return 400 for invalid location data', async () => {
      // APIリクエスト（無効なデータ）
      const response = await request(app)
        .post('/api/diaries/1/locations')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          locations: [
            {
              // 緯度・経度が欠けている
              name: 'Invalid Location',
            },
          ],
        });

      // 検証
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });
});
