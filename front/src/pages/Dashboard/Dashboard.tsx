import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import type { LessonItems, LoginResponse } from "../../types";
import "./Dashboard.css";
import ProfessorDashboard from "../../components/Dashboard/ProfessorDashboard";
import StudentDashboard from "../../components/Dashboard/StudentDashboard";

function getLogin(): LoginResponse | null {
  try {
    return JSON.parse(localStorage.getItem("loginResponse") ?? "null");
  } catch {
    return null;
  }
}

function Dashboard() {
  const [lessons, setLessons] = useState<LessonItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = getLogin();

  useEffect(() => {
    let cancelled = false;

    apiFetch<LessonItems>("/lessons/")
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
  }, []);

  if (!login) return <Navigate to="/login" replace />;
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  const isProfessor = login.user.role === "PROFESSOR";

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
        <h2>{isProfessor ? "Minhas Aulas" : "Meus Cursos"}</h2>

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
