import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/auth";
import { getLessonStatusLabel } from "../../utils/lessonStatus";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

type User = { name: string; role: string };
type Lesson = { id: string; title: string; description: string; status: string; views: number };
type Topic = { id: string; name: string };

function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) as User : null;
  });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    const parsedUser = storedUser ? JSON.parse(storedUser) as User : null;

    if (!token || !parsedUser || parsedUser.role !== "PROFESSOR") {
      navigate("/login", { replace: true });
      return;
    }

    Promise.all([
      fetch(`${API_URL}/lessons/mine`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/catalog`),
    ])
      .then(async ([lessonsResponse, catalogResponse]) => {
        const lessonsData = await lessonsResponse.json();
        const catalogData = await catalogResponse.json();
        if (!lessonsResponse.ok) throw new Error(lessonsData.message || "Não foi possível carregar suas aulas.");
        if (!catalogResponse.ok) throw new Error(catalogData.message || "Não foi possível carregar os tópicos.");
        setLessons(lessonsData.items);
        setTopics(catalogData.topics);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof Error) setError(requestError.message);
      });
  }, [navigate]);

  const handleCreateLesson = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setIsSaving(true);
    const formData = new FormData(event.currentTarget);
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${API_URL}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          videoUrl: formData.get("videoUrl"),
          topicId: formData.get("topicId"),
          status: formData.get("status"),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Não foi possível adicionar a aula.");
      setLessons((currentLessons) => [data, ...currentLessons]);
      setIsFormOpen(false);
      event.currentTarget.reset();
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : "Não foi possível adicionar a aula.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-brand">CCDD <span>Ensino</span></Link>
        <div className="dashboard-intro">
          <p className="dashboard-eyebrow">Painel do professor</p>
          <h1>Olá, <i>{user?.name}</i></h1>
          <p>Gerencie suas videoaulas e materiais.</p>
        </div>

        <nav>
          <Link to="/">Catálogo</Link>
          <button type="button" onClick={() => void handleLogout(navigate, "/")}>Sair</button>
        </nav>
      </header>

      <section className="courses">
        <div className="section-title-row">
          <h2>Minhas videoaulas</h2>
          <button type="button" className="add-lesson-button" onClick={() => setIsFormOpen((isOpen) => !isOpen)}>
            {isFormOpen ? "Fechar" : "+ Nova aula"}
          </button>
        </div>
        {error && <p role="alert">{error}</p>}

        {isFormOpen && (
          <form className="lesson-form" onSubmit={handleCreateLesson}>
            <div className="lesson-form-heading">
              <div>
                <p className="dashboard-eyebrow">Publicar conteúdo</p>
                <h3>Adicionar nova aula</h3>
              </div>
              <span>Campos com * são obrigatórios</span>
            </div>
            <div className="lesson-form-grid">
              <div className="lesson-form-field lesson-form-wide">
                <label htmlFor="title">Título *</label>
                <input id="title" name="title" required placeholder="Ex.: Introdução à álgebra" />
              </div>
              <div className="lesson-form-field">
                <label htmlFor="topicId">Tópico *</label>
                <select id="topicId" name="topicId" required defaultValue="">
                  <option value="" disabled>Selecione um tópico</option>
                  {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                </select>
              </div>
              <div className="lesson-form-field">
                <label htmlFor="status">Visibilidade</label>
                <select id="status" name="status" defaultValue="PUBLISHED">
                  <option value="PUBLISHED">Publicada</option>
                  <option value="DRAFT">Rascunho</option>
                </select>
              </div>
              <div className="lesson-form-field lesson-form-wide">
                <label htmlFor="description">Descrição *</label>
                <textarea id="description" name="description" required placeholder="Descreva o que o aluno vai aprender." />
              </div>
              <div className="lesson-form-field lesson-form-wide">
                <label htmlFor="videoUrl">Link do vídeo *</label>
                <input id="videoUrl" name="videoUrl" type="url" required placeholder="https://www.youtube.com/watch?v=..." />
              </div>
            </div>
            {formError && <p role="alert" className="form-error">{formError}</p>}
            <button type="submit" className="save-lesson-button" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Adicionar aula"}
            </button>
          </form>
        )}

        <div className="course-grid">
          {lessons.map((lesson) => (
            <article className="course-card" key={lesson.id}>
              <div className="course-image">
                {getLessonStatusLabel(lesson.status)}
              </div>

              <div className="course-content">
                <h3>{lesson.title}</h3>

                <p>{lesson.description}</p>

                <span>{lesson.views} visualizações</span>

                <Link to={`/courses/${lesson.id}/lessons/${lesson.id}`} className="lesson-button">
                  Ver aula
                </Link>
              </div>
            </article>
          ))}
        </div>
        {!error && lessons.length === 0 && <p>Você ainda não cadastrou nenhuma videoaula.</p>}
      </section>
    </main>
  );
}

export default Dashboard;