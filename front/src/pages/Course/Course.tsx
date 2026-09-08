import { Link } from "react-router-dom";
import "./Course.css";

const course = {
  id: 1,
  title: "Programação de Computadores I",
  description:
    "Aprenda todos os conceitos fundamentais sobre programação e crie uma base sólida.",
  progress: 70,
};

const lessons = [
  {
    id: 1,
    title: "Algorítmos",
    completed: true,
  },
  {
    id: 2,
    title: "Constantes e Variáveis",
    completed: true,
  },
  {
    id: 3,
    title: "Estruturas de seleção",
    completed: true,
  },
  {
    id: 4,
    title: "Estruturas de Repetição",
    completed: false,
  },
  {
    id: 5,
    title: "Vetores",
    completed: false,
  },
  {
    id: 6,
    title: "Matrizes",
    completed: false,
  },
];

function Course() {
  return (
    <main className="course-page">
      <header className="course-header">
        <Link to="/dashboard" className="back-link">
          ← Voltar
        </Link>

        <h1>{course.title}</h1>

        <p>{course.description}</p>
      </header>

      <section className="course-progress">
        <div className="progress-header">
          <h2>Seu Progresso</h2>
          <span>{course.progress}% completo</span>
        </div>

        <div className="progress">
          <div
            className="progress-bar"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </section>

      <section className="lessons">
        <h2>Aulas</h2>

        <div className="lesson-list">
          {lessons.map((lesson) => (
            <article className="lesson-card" key={lesson.id}>
              <div className="lesson-number">
                {lesson.completed ? "✓" : lesson.id}
              </div>

              <div className="lesson-info">
                <h3>{lesson.title}</h3>

                <span>
                  {lesson.completed ? "Completo" : "Pendente"}
                </span>
              </div>

              <Link
                to={`/courses/${course.id}/lessons/${lesson.id}`}
                className="lesson-button"
              >
                {lesson.completed ? "Revisar" : "Iniciar"}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Course;