import { newId, hashPassword } from './utils.js';

const professorId = newId();
const disciplineId = newId();
const categoryId = newId();
const topicId = newId();
const physicsDisciplineId = newId();
const biologyDisciplineId = newId();
const physicsCategoryId = newId();
const biologyCategoryId = newId();
const mechanicsTopicId = newId();
const opticsTopicId = newId();
const cellsTopicId = newId();
const ecologyTopicId = newId();
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
  disciplines: [
    { id: disciplineId, name: 'Matemática' },
    { id: physicsDisciplineId, name: 'Física' },
    { id: biologyDisciplineId, name: 'Biologia' }
  ],
  categories: [
    { id: categoryId, disciplineId, name: 'Álgebra' },
    { id: physicsCategoryId, disciplineId: physicsDisciplineId, name: 'Mecânica' },
    { id: biologyCategoryId, disciplineId: biologyDisciplineId, name: 'Biologia Celular' }
  ],
  topics: [
    { id: topicId, categoryId, name: 'Equações' },
    { id: mechanicsTopicId, categoryId: physicsCategoryId, name: 'Movimento' },
    { id: opticsTopicId, categoryId: physicsCategoryId, name: 'Óptica' },
    { id: cellsTopicId, categoryId: biologyCategoryId, name: 'Células' },
    { id: ecologyTopicId, categoryId: biologyCategoryId, name: 'Ecologia' }
  ],
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
  }, {
    id: newId(), professorId, topicId,
    title: 'Sistemas de equações lineares',
    description: 'Aprenda a resolver sistemas de equações usando diferentes métodos.',
    videoUrl: 'https://www.youtube.com/watch?v=IHZwWFHWa-w', status: 'PUBLISHED', views: 24,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }, {
    id: newId(), professorId, topicId: mechanicsTopicId,
    title: 'Introdução ao movimento',
    description: 'Conceitos fundamentais de posição, velocidade e aceleração.',
    videoUrl: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE', status: 'PUBLISHED', views: 18,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }, {
    id: newId(), professorId, topicId: opticsTopicId,
    title: 'Princípios da óptica',
    description: 'Uma visão geral sobre luz, reflexão e formação de imagens.',
    videoUrl: 'https://www.youtube.com/watch?v=7H8-9hH9h9E', status: 'PUBLISHED', views: 31,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }, {
    id: newId(), professorId, topicId: cellsTopicId,
    title: 'A célula e suas estruturas',
    description: 'Conheça as principais estruturas celulares e suas funções.',
    videoUrl: 'https://www.youtube.com/watch?v=URUJD5NEXC8', status: 'PUBLISHED', views: 12,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }, {
    id: newId(), professorId, topicId: ecologyTopicId,
    title: 'Cadeias e relações ecológicas',
    description: 'Entenda como os seres vivos se relacionam nos ecossistemas.',
    videoUrl: 'https://www.youtube.com/watch?v=GxE4-Z5QY3M', status: 'PUBLISHED', views: 9,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }],
  materials: [{
    id: newId(), lessonId, title: 'Lista de exercícios',
    type: 'PDF', url: 'https://example.org/lista.pdf'
  }],
  sessions: new Map()
};
