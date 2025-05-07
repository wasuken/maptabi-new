import { DiaryLocation } from './location.types';

export interface Diary {
  id: number;
  userId: number;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiaryInput {
  title: string;
  content: string;
  isPublic?: boolean;
}

export interface DiaryWithLocations extends Diary {
  locations: DiaryLocation[];
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  userId: number;
  createdAt: Date;
}

export interface DiaryWithTags extends Diary {
  tags: Tag[];
}

export interface DiaryWithAll extends Diary {
  locations: Location[];
  tags: Tag[];
}
