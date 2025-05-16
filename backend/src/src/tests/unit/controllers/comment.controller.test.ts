import { Response } from 'express';
import * as commentController from '../../../controllers/comment.controller';
import * as commentService from '../../../services/comment.service';
import { AuthRequest } from '../../../middlewares/auth.middleware';

// コメントサービスのモック
jest.mock('../../../services/comment.service');

describe('Comment Controller', () => {
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
      user: { id: 1, email: 'test@example.com', exp: 10 },
      params: {},
      body: {},
    };

    jest.clearAllMocks();
  });

  describe('getCommentsByLocationId', () => {
    it('should return all comments for a location', async () => {
      // モックの設定
      const mockComments = [
        {
          id: 1,
          locationId: 1,
          userId: 1,
          content: 'テストコメント',
          createdAt: new Date(),
          updatedAt: new Date(),
          userName: 'テストユーザー',
        },
      ];

      (commentService.getCommentsByLocationId as jest.Mock).mockResolvedValue(mockComments);
      mockRequest.params = { locationId: '1' };

      // コントローラー呼び出し
      await commentController.getCommentsByLocationId(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      // 検証
      expect(commentService.getCommentsByLocationId).toHaveBeenCalledWith(1);
      expect(responseJson).toHaveBeenCalledWith(mockComments);
    });

    it('should handle error when user is not authenticated', async () => {
      // モックの設定
      mockRequest.user = undefined;

      // コントローラー呼び出し
      await commentController.getCommentsByLocationId(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      // 検証
      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({ message: '認証されていません' });
    });

    it('should handle invalid location ID', async () => {
      // モックの設定
      mockRequest.params = { locationId: 'invalid' };

      // コントローラー呼び出し
      await commentController.getCommentsByLocationId(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      // 検証
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: '無効な位置情報IDです' });
    });

    it('should handle service errors', async () => {
      // モックの設定
      mockRequest.params = { locationId: '1' };
      (commentService.getCommentsByLocationId as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      // コントローラー呼び出し
      await commentController.getCommentsByLocationId(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      // 検証
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'コメントの取得に失敗しました' });
    });
  });

  describe('createComment', () => {
    it('should create a comment for a location', async () => {
      // モックの設定
      const mockComment = {
        id: 1,
        locationId: 1,
        userId: 1,
        content: 'テストコメント',
        createdAt: new Date(),
        updatedAt: new Date(),
        userName: 'テストユーザー',
      };

      (commentService.createComment as jest.Mock).mockResolvedValue(mockComment);
      mockRequest.params = { locationId: '1' };
      mockRequest.body = { content: 'テストコメント' };

      // コントローラー呼び出し
      await commentController.createComment(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(commentService.createComment).toHaveBeenCalledWith(
        1,
        { content: 'テストコメント' },
        1
      );
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(mockComment);
    });

    it('should handle location not found error', async () => {
      // モックの設定
      mockRequest.params = { locationId: '999' };
      mockRequest.body = { content: 'テストコメント' };

      (commentService.createComment as jest.Mock).mockRejectedValue(
        new Error('Location not found')
      );

      // コントローラー呼び出し
      await commentController.createComment(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: '位置情報が見つかりません' });
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      // モックの設定
      const mockComment = {
        id: 1,
        locationId: 1,
        userId: 1,
        content: '更新したコメント',
        createdAt: new Date(),
        updatedAt: new Date(),
        userName: 'テストユーザー',
      };

      (commentService.updateComment as jest.Mock).mockResolvedValue(mockComment);
      mockRequest.params = { commentId: '1' };
      mockRequest.body = { content: '更新したコメント' };

      // コントローラー呼び出し
      await commentController.updateComment(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(commentService.updateComment).toHaveBeenCalledWith(
        1,
        { content: '更新したコメント' },
        1
      );
      expect(responseJson).toHaveBeenCalledWith(mockComment);
    });

    it('should handle comment not found error', async () => {
      // モックの設定
      mockRequest.params = { commentId: '999' };
      mockRequest.body = { content: '更新したコメント' };

      (commentService.updateComment as jest.Mock).mockRejectedValue(new Error('Comment not found'));

      // コントローラー呼び出し
      await commentController.updateComment(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: 'コメントが見つかりません' });
    });

    it('should handle unauthorized error', async () => {
      // モックの設定
      mockRequest.params = { commentId: '1' };
      mockRequest.body = { content: '更新したコメント' };

      (commentService.updateComment as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      // コントローラー呼び出し
      await commentController.updateComment(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'このコメントを編集する権限がありません',
      });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      // モックの設定
      (commentService.deleteComment as jest.Mock).mockResolvedValue(undefined);
      mockRequest.params = { commentId: '1' };

      // コントローラー呼び出し
      await commentController.deleteComment(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(commentService.deleteComment).toHaveBeenCalledWith(1, 1);
      expect(responseStatus).toHaveBeenCalledWith(204);
      expect(responseSend).toHaveBeenCalled();
    });

    it('should handle comment not found error', async () => {
      // モックの設定
      mockRequest.params = { commentId: '999' };

      (commentService.deleteComment as jest.Mock).mockRejectedValue(new Error('Comment not found'));

      // コントローラー呼び出し
      await commentController.deleteComment(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: 'コメントが見つかりません' });
    });

    it('should handle unauthorized error', async () => {
      // モックの設定
      mockRequest.params = { commentId: '1' };

      (commentService.deleteComment as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      // コントローラー呼び出し
      await commentController.deleteComment(mockRequest as AuthRequest, mockResponse as Response);

      // 検証
      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'このコメントを削除する権限がありません',
      });
    });
  });
});
