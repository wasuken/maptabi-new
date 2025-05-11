import { Response } from 'express';
import * as diaryController from '../../../controllers/diary.controller';
import * as diaryService from '../../../services/diary.service';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { mockDiaries } from '../../fixtures/diaries';
import { mockLocations } from '../../fixtures/locations';

// diaryServiceのモック
jest.mock('../../../services/diary.service');

describe('Diary Controller', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let responseSend: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnValue({});
    responseStatus = jest.fn().mockReturnThis();
    responseSend = jest.fn().mockReturnValue({});

    mockResponse = {
      json: responseJson,
      status: responseStatus,
      send: responseSend,
    };

    mockRequest = {
      user: { id: 1 },
      params: {},
      body: {},
    };

    jest.clearAllMocks();
  });

  describe('getAllDiaries', () => {
    it('should return all diaries for the authenticated user', async () => {
      // モックの設定
      (diaryService.getAllDiaries as jest.Mock).mockResolvedValue(mockDiaries);

      // コントローラー呼び出し
      await diaryController.getAllDiaries(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(diaryService.getAllDiaries).toHaveBeenCalledWith(1);
      expect(responseJson).toHaveBeenCalledWith(mockDiaries);
    });

    it('should handle error when user is not authenticated', async () => {
      // モックの設定
      mockRequest.user = undefined;

      // コントローラー呼び出し
      await diaryController.getAllDiaries(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({ message: '認証されていません' });
    });

    it('should handle service errors', async () => {
      // モックの設定
      (diaryService.getAllDiaries as jest.Mock).mockRejectedValue(new Error('Database error'));

      // コントローラー呼び出し
      await diaryController.getAllDiaries(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: '日記の取得に失敗しました' });
    });
  });

  describe('getDiaryById', () => {
    it('should return diary by id', async () => {
      // モックの設定
      mockRequest.params = { id: '1' };
      (diaryService.getDiaryById as jest.Mock).mockResolvedValue(mockDiaries[0]);

      // コントローラー呼び出し
      await diaryController.getDiaryById(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(diaryService.getDiaryById).toHaveBeenCalledWith(1, 1);
      expect(responseJson).toHaveBeenCalledWith(mockDiaries[0]);
    });

    it('should return 404 when diary is not found', async () => {
      // モックの設定
      mockRequest.params = { id: '999' };
      (diaryService.getDiaryById as jest.Mock).mockResolvedValue(null);

      // コントローラー呼び出し
      await diaryController.getDiaryById(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: '日記が見つかりません' });
    });
  });

  describe('updateDiaryLocations', () => {
    it('should update diary locations', async () => {
      // モックの設定
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        locations: [
          {
            latitude: 35.6809591,
            longitude: 139.7673068,
            name: 'Tokyo Tower',
            altitude: 10.5,
          },
        ],
      };
      (diaryService.updateDiaryLocations as jest.Mock).mockResolvedValue(mockLocations);

      // コントローラー呼び出し
      await diaryController.updateDiaryLocations(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      // 検証
      expect(diaryService.updateDiaryLocations).toHaveBeenCalledWith(
        1,
        mockRequest.body.locations,
        1
      );
      expect(responseJson).toHaveBeenCalledWith(mockLocations);
    });

    it('should return 400 when locations is not an array', async () => {
      // モックの設定
      mockRequest.params = { id: '1' };
      mockRequest.body = { locations: 'not an array' };

      // コントローラー呼び出し
      await diaryController.updateDiaryLocations(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      // 検証
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        message: '位置情報は配列形式で指定してください',
      });
    });
  });
});
