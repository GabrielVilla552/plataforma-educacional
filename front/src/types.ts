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

export interface LessonItem {
  id: string;
  professorId: string;
  topicId: string;
  title: string;
  description: string;
  videoUrl: string;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface LessonItems {
  items: LessonItem[];
  total: number;
}
