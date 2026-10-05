import type { LessonItems } from "../../types";

interface ProfessorDashboardProps {
  lessons: LessonItems | null;
}

function ProfessorDashboard({ lessons }: ProfessorDashboardProps) {
  return (
    <>
      {lessons?.items.map((lesson) => (
        <article className="course-card" key={lesson.id}>
          <div className="course-image">
            Course Image
          </div>

          <div className="course-content">
            <h3>{lesson.title}</h3>

            <p>{lesson.description}</p>

            <span>{lesson.views} visualizações</span>

            <a href={`/courses/${lesson.id}`}>
              Gerenciar →
            </a>
          </div>
        </article>
      ))}
    </>
  );
}

export default ProfessorDashboard;
