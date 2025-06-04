import React, { useState, useEffect } from 'react';
import { Comment, CommentInput } from '../../types';
import * as commentService from '../../services/comment';
import CommentItem from './CommentItem';
import { Send } from 'lucide-react';

interface CommentListProps {
  locationId: number;
}

const CommentList: React.FC<CommentListProps> = ({ locationId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [locationId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getCommentsByLocationId(locationId);
      setComments(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError('コメントの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const commentInput: CommentInput = { content: newComment.trim() };
      const createdComment = await commentService.createComment(locationId, commentInput);
      setComments([createdComment, ...comments]);
      setNewComment('');
      setError(null);
    } catch (err) {
      console.error('Failed to create comment:', err);
      setError('コメントの投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (commentId: number, content: string) => {
    try {
      setLoading(true);
      const commentInput: CommentInput = { content };
      const updatedComment = await commentService.updateComment(commentId, commentInput);

      setComments(comments.map((comment) => (comment.id === commentId ? updatedComment : comment)));
      setError(null);
    } catch (err) {
      console.error('Failed to update comment:', err);
      setError('コメントの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      setLoading(true);
      await commentService.deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      setError(null);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setError('コメントの削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-base font-medium text-gray-900 mb-3">コメント</h3>

      {/* 新規コメント入力フォーム */}
      <div className="mb-4">
        <div className="flex">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="この場所について140文字以内でコメント..."
            maxLength={140}
            className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            disabled={loading}
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-3 rounded-r hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={loading || !newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">{newComment.length}/140</span>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && <div className="bg-red-50 text-red-700 p-2 rounded-md text-sm mb-3">{error}</div>}

      {/* コメント一覧 */}
      {loading && comments.length === 0 ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
          <p className="text-sm text-gray-500 mt-2">コメントを読み込み中...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-4">
          まだコメントはありません。最初のコメントを投稿してみましょう！
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
