import api from './api';
import { LocationInput, Diary, DiaryInput, DiaryWithLocations } from '../types';

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

export const addLocations = async (diaryId: number, locations: LocationInput[]): Promise<void> => {
  await api.post(`/diaries/${diaryId}/locations`, { locations: locations });
};

export const updateLocations = async (
  diaryId: number,
  locations: LocationInput[]
): Promise<void> => {
  await api.post(`/diaries/${diaryId}/locations`, { locations: locations });
};

export const getDiaryLocations = async (diaryId: number) => {
  const response = await api.get(`/diaries/${diaryId}/locations`);
  return response.data;
};

export const getNearbyPublicLocations = async (
  latitude: number,
  longitude: number,
  radiusKm = 5,
  maxDiaries = 30,
  maxLocationsPerDiary = 50
) => {
  const response = await api.get(`/locations/public/nearby`, {
    params: { latitude, longitude, radiusKm, maxDiaries, maxLocationsPerDiary },
  });
  return response.data;
};
