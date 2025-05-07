import pool from '../../../config/database';
import * as diaryService from '../../../services/diary.service';
import { mockDiaries } from '../../fixtures/diaries';
import { mockLocations } from '../../fixtures/locations';

// データベースのモック
jest.mock('../../../config/database', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
    end: jest.fn(),
  };

  return {
    connect: jest.fn().mockResolvedValue(mockClient),
    query: jest.fn(),
    end: jest.fn(),
  };
});

describe('Diary Service', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);
  });

  describe('getAllDiaries', () => {
    it('should return all diaries for a user', async () => {
      // モックの設定
      mockClient.query.mockResolvedValueOnce({
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

      // サービス呼び出し
      const result = await diaryService.getAllDiaries(1);

      // 検証
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM diaries'),
        [1]
      );
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(1);
      expect(result[0].userId).toBe(1);
    });
  });

  // describe('updateDiaryLocations', () => {
  //   it('should update locations for a diary', async () => {
  //     // モックの設定
  //     // 日記の存在確認
  //     mockClient.query.mockResolvedValueOnce({
  //       rows: [mockDiaries[0]],
  //     });

  //     // 位置情報の削除
  //     mockClient.query.mockResolvedValueOnce({});

  //     // 位置情報の挿入
  //     mockClient.query.mockResolvedValueOnce({
  //       rows: [
  //         {
  //           id: 1,
  //           diary_id: 1,
  //           name: 'Test Location',
  //           coordinates: 'POINT(139.7673068 35.6809591)',
  //           longitude: 139.7673068,
  //           latitude: 35.6809591,
  //           altitude: 10.5,
  //           recorded_at: new Date(),
  //           order_index: 0,
  //           created_at: new Date(),
  //         },
  //       ],
  //     });

  //     // トランザクションのコミット
  //     mockClient.query.mockResolvedValueOnce({});

  //     const locationInputs = [
  //       {
  //         diaryId: 1,
  //         name: 'Test Location',
  //         latitude: 35.6809591,
  //         longitude: 139.7673068,
  //         altitude: 10.5,
  //       },
  //     ];

  //     // サービス呼び出し
  //     const result = await diaryService.updateDiaryLocations(1, locationInputs, 1);

  //     // 検証
  //     // BEGIN呼び出し
  //     expect(mockClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');

  //     // 日記の存在確認
  //     expect(mockClient.query).toHaveBeenNthCalledWith(
  //       2,
  //       expect.stringContaining('SELECT * FROM diaries'),
  //       [1, 1]
  //     );

  //     // 位置情報の削除
  //     expect(mockClient.query).toHaveBeenNthCalledWith(
  //       3,
  //       expect.stringContaining('DELETE FROM locations'),
  //       [1]
  //     );

  //     // 位置情報の挿入
  //     expect(mockClient.query).toHaveBeenNthCalledWith(
  //       4,
  //       expect.stringContaining('INSERT INTO locations'),
  //       expect.arrayContaining([1, 'Test Location', 139.7673068, 35.6809591, 10.5, null, 0])
  //     );

  //     // COMMITの確認
  //     expect(mockClient.query).toHaveBeenLastCalledWith('COMMIT');

  //     // 結果の確認
  //     expect(result.length).toBe(1);
  //     expect(result[0].diaryId).toBe(1);
  //   });

  //   it('should throw error if diary not found', async () => {
  //     // モックの設定
  //     mockClient.query.mockResolvedValueOnce({
  //       rows: [],
  //     });

  //     const locationInputs = [
  //       {
  //         diaryId: 999,
  //         latitude: 35.6809591,
  //         longitude: 139.7673068,
  //       },
  //     ];

  //     // サービス呼び出し & エラー検証
  //     await expect(diaryService.updateDiaryLocations(999, locationInputs, 1)).rejects.toThrow(
  //       'Diary not found or unauthorized'
  //     );

  //     // ROLLBACKの確認
  //     expect(mockClient.query).toHaveBeenLastCalledWith('ROLLBACK');
  //   });
  // });
});
