import { Link } from "react-router-dom";
import type { LessonItems, LessonStatus } from "../../types";

const STATUS_LABELS: Record<LessonStatus, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicada",
  ARCHIVED: "Arquivada",
};

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

            <span>
              {STATUS_LABELS[lesson.status]} · {lesson.views} visualizações
            </span>

            <Link to={`/lessons/${lesson.id}/manage`}>
              Gerenciar →
            </Link>
          </div>
        </article>
      ))}
    </>
  );
}

export default ProfessorDashboard;
