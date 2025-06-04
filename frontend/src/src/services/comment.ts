import api from './api';
import { Comment, CommentInput } from '../types';

export const getCommentsByLocationId = async (locationId: number): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`/locations/${locationId}/comments`);
  return response.data;
};

export const createComment = async (
  locationId: number,
  comment: CommentInput
): Promise<Comment> => {
  const response = await api.post<Comment>(`/locations/${locationId}/comments`, comment);
  return response.data;
};

export const updateComment = async (commentId: number, comment: CommentInput): Promise<Comment> => {
  const response = await api.put<Comment>(`/comments/${commentId}`, comment);
  return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};
