import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { getLogin } from "../../utils/auth";
import type { LessonItems } from "../../types";
import "./Dashboard.css";
import ProfessorDashboard from "../../components/Dashboard/ProfessorDashboard";
import StudentDashboard from "../../components/Dashboard/StudentDashboard";

function Dashboard() {
  const [lessons, setLessons] = useState<LessonItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = getLogin();
  const isProfessor = login?.user.role === "PROFESSOR";

  useEffect(() => {
    let cancelled = false;

    // Professor vê todas as suas aulas (inclusive rascunhos); aluno vê só as publicadas
    apiFetch<LessonItems>(isProfessor ? "/lessons/mine" : "/lessons/")
      .then((data) => {
        if (!cancelled) setLessons(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Erro ao carregar as lições");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isProfessor]);

  if (!login) return <Navigate to="/login" replace />;
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Bem vindo(a), <i>{login.user.name}</i></h1>
        </div>

        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/profile">Perfil</a>
        </nav>
      </header>

      <section className="courses">
        <div className="courses-header">
          <h2>{isProfessor ? "Minhas Aulas" : "Meus Cursos"}</h2>

          {isProfessor && (
            <Link to="/lessons/new" className="new-lesson-button">
              + Nova videoaula
            </Link>
          )}
        </div>

        <div className="course-grid">
          {isProfessor ? (
            <ProfessorDashboard lessons={lessons} />
          ) : (
            <StudentDashboard lessons={lessons} />
          )}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
