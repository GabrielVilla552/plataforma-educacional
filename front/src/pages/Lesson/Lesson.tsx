import { Link } from "react-router-dom";
import "./Lesson.css";

const lesson = {
  id: 1,
  courseId: 1,
  title: "Algorítmos",
  description:
    "Nessa aula você aprenderá o que são algorítmos e qual a sua importância para a programação.",
  duration: "12 minutos",
};

function Lesson() {
  return (
    <main className="lesson-page">
      <header className="lesson-header">
        <Link to="/courses/1" className="back-link">
          ← Voltar ao curso
        </Link>

        <p className="lesson-label">Programação de Computadores I</p>

        <h1>{lesson.title}</h1>
      </header>

      <section className="video-container">
        <video className="lesson-video" controls>
          <source
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </section>

      <section className="lesson-content">
        <div className="lesson-info">
          <h2>Sobre esta aula</h2>

          <p>{lesson.description}</p>

          <span className="lesson-duration">
            Duração: {lesson.duration}
          </span>
        </div>

        <button className="complete-button">
          ✓ Marcar como finalizada
        </button>
      </section>

      <nav className="lesson-navigation">
        <Link to="/courses/1" className="navigation-button">
          ← Anterior
        </Link>

        <Link
          to="/courses/1/lessons/2"
          className="navigation-button next"
        >
          Próxima Aula →
        </Link>
      </nav>
    </main>
  );
}

export default Lesson;