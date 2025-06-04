import React, { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Comment } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Edit, Trash2, X, Check } from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
  onUpdate: (id: number, content: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === comment.userId;
  const formattedDate = format(new Date(comment.createdAt), 'yyyy/MM/dd HH:mm', { locale: ja });

  const handleEdit = () => {
    setEditContent(comment.content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editContent.trim() && editContent !== comment.content) {
      await onUpdate(comment.id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsDeleting(false);
  };

  const handleDeleteConfirm = async () => {
    await onDelete(comment.id);
    setIsDeleting(false);
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 mb-2">
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium text-sm text-gray-800">{comment.userName || 'ユーザー'}</div>
        <div className="text-xs text-gray-500">{formattedDate}</div>
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={140}
            className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <span className="text-xs text-gray-500 self-center mr-2">{editContent.length}/140</span>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-500 hover:text-gray-700 rounded"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={handleSave}
              className="p-1 text-green-500 hover:text-green-700 rounded"
              disabled={!editContent.trim() || editContent === comment.content}
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : isDeleting ? (
        <div className="mt-2">
          <p className="text-sm text-red-600">このコメントを削除しますか？</p>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={handleCancel}
              className="px-2 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
            >
              キャンセル
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-2 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded"
            >
              削除する
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>

          {isOwner && (
            <div className="flex justify-end space-x-1 mt-1">
              <button
                onClick={handleEdit}
                className="p-1 text-gray-500 hover:text-blue-600 rounded"
                title="編集"
              >
                <Edit className="h-3 w-3" />
              </button>
              <button
                onClick={() => setIsDeleting(true)}
                className="p-1 text-gray-500 hover:text-red-600 rounded"
                title="削除"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentItem;
