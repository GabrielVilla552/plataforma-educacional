import { newId, hashPassword } from './utils.js';

const professorId = newId();
const disciplineId = newId();
const categoryId = newId();
const topicId = newId();
const lessonId = newId();

// db mockado por enquanto
export const db = {
  users: [{
    id: professorId,
    name: 'Professor Demo',
    email: 'professor@demo.com',
    passwordHash: hashPassword('12345678'),
    role: 'PROFESSOR',
    area: 'Matemática',
    institution: 'Instituição Demo',
    createdAt: new Date().toISOString()
  }],
  disciplines: [{ id: disciplineId, name: 'Matemática' }],
  categories: [{ id: categoryId, disciplineId, name: 'Álgebra' }],
  topics: [{ id: topicId, categoryId, name: 'Equações' }],
  lessons: [{
    id: lessonId,
    professorId,
    topicId,
    title: 'Introdução às equações do primeiro grau',
    description: 'Aula demonstrativa do MVP.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'PUBLISHED',
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }],
  materials: [{
    id: newId(), lessonId, title: 'Lista de exercícios',
    type: 'PDF', url: 'https://example.org/lista.pdf'
  }],
  sessions: new Map()
};
