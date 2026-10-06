import type { LessonItems } from "../../types";

interface StudentDashboardProps {
  lessons: LessonItems | null;
}

function StudentDashboard({ lessons }: StudentDashboardProps) {
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

            <div className="progress">

            </div>

            <a href={`/courses/${lesson.id}`}>
              Continuar →
            </a>
          </div>
        </article>
      ))}
    </>
  );
}

export default StudentDashboard;
