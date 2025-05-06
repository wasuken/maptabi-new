import api from './api';
import { Diary, DiaryInput, DiaryWithLocations } from '../types/diary';
import { LocationInput } from '../types/location';

export const getAllDiaries = async (): Promise<Diary[]> => {
  const response = await api.get<Diary[]>('/diaries');
  return response.data;
};

export const getDiaryById = async (id: number): Promise<DiaryWithLocations> => {
  const response = await api.get<DiaryWithLocations>(`/diaries/${id}`);
  return response.data;
};

export const createDiary = async (diary: DiaryInput): Promise<Diary> => {
  const response = await api.post<Diary>('/diaries', diary);
  return response.data;
};

export const updateDiary = async (id: number, diary: DiaryInput): Promise<Diary> => {
  const response = await api.put<Diary>(`/diaries/${id}`, diary);
  return response.data;
};

export const deleteDiary = async (id: number): Promise<void> => {
  await api.delete(`/diaries/${id}`);
};

export const addLocation = async (diaryId: number, location: LocationInput): Promise<void> => {
  await api.post(`/diaries/${diaryId}/locations`, location);
};

export const getDiaryLocations = async (diaryId: number) => {
  const response = await api.get(`/diaries/${diaryId}/locations`);
  return response.data;
};
