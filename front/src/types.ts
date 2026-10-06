export interface User {
  area: string;
  createdAt: string;
  email: string;
  id: string;
  institution: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  expiresAt: string;
  token: string;
  tokenType: string;
  user: User;
}

export type LessonStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Discipline {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  disciplineId: string;
  name: string;
}

export interface Topic {
  id: string;
  categoryId: string;
  name: string;
}

export interface Catalog {
  disciplines: Discipline[];
  categories: Category[];
  topics: Topic[];
}

export interface Material {
  id: string;
  lessonId: string;
  title: string;
  type: string;
  url: string;
}

export interface LessonItem {
  id: string;
  professorId: string;
  topicId: string;
  title: string;
  description: string;
  videoUrl: string;
  status: LessonStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
  topic?: Topic;
  category?: Category;
  discipline?: Discipline;
  materials?: Material[];
}

export interface LessonInput {
  title: string;
  description: string;
  videoUrl: string;
  topicId: string;
  status: LessonStatus;
}

export interface LessonItems {
  items: LessonItem[];
  total: number;
}
