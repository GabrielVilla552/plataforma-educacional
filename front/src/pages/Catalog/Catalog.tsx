import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/auth";
import "./Catalog.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

type Discipline = { id: string; name: string };
type Lesson = {
  id: string;
  title: string;
  description: string;
  views: number;
  topic?: { name: string };
  category?: { name: string };
  discipline?: { id: string; name: string };
};

function Catalog() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const lastResponseSignature = useRef("");
  const [isProfessor, setIsProfessor] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    return Boolean(localStorage.getItem("authToken") && storedUser && JSON.parse(storedUser).role === "PROFESSOR");
  });

  const loadCatalog = async (search = "") => {
    setError((currentError) => currentError === "" ? currentError : "");

    try {
      const [catalogResponse, lessonsResponse] = await Promise.all([
        fetch(`${API_URL}/catalog`),
        fetch(`${API_URL}/lessons${search ? `?q=${encodeURIComponent(search)}` : ""}`),
      ]);
      const catalogData = await catalogResponse.json();
      const lessonsData = await lessonsResponse.json();

      if (!catalogResponse.ok || !lessonsResponse.ok) {
        throw new Error("Não foi possível carregar o catálogo.");
      }

      const responseSignature = JSON.stringify({
        disciplines: catalogData.disciplines,
        lessons: lessonsData.items,
      });

      if (responseSignature !== lastResponseSignature.current) {
        lastResponseSignature.current = responseSignature;
        setDisciplines(catalogData.disciplines);
        setLessons(lessonsData.items);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar o catálogo.");
    } finally {
      setIsLoading((currentLoading) => currentLoading ? false : currentLoading);
    }
  };

  useEffect(() => {
    const searchDelay = window.setTimeout(() => {
      void loadCatalog(query.trim());
    }, 250);

    return () => window.clearTimeout(searchDelay);
  }, [query]);

  const visibleLessons = selectedDiscipline
    ? lessons.filter((lesson) => lesson.discipline?.id === selectedDiscipline)
    : lessons;

  return (
    <main className="catalog-page">
      <header className="catalog-header">
        <Link to="/" className="brand">CCDD <span>Ensino</span></Link>
        <nav>
          {isProfessor ? (
            <div className="professor-actions">
              <Link to="/dashboard" className="header-button">Painel do professor</Link>
              <button
                type="button"
                className="logout-button"
                onClick={() => void handleLogout(navigate, "/", () => setIsProfessor(false))}
              >
                Sair
              </button>
            </div>
          ) : (
            <details className="login-menu">
              <summary>Entrar <span aria-hidden="true">⌄</span></summary>
              <div className="login-menu-options">
                <Link to="/login">Professor</Link>
                <button type="button" disabled>
                  Aluno <span>Em breve</span>
                </button>
              </div>
            </details>
          )}
        </nav>
      </header>

      <section className="catalog-hero">
        <div>
          <p className="eyebrow">Aprendizado aberto</p>
          <h1>Encontre sua próxima aula.</h1>
          <p className="hero-copy">Videoaulas e materiais educacionais gratuitos, organizados para você estudar no seu ritmo.</p>
        </div>
        <div className="search-form">
          <label htmlFor="catalog-search">Buscar no catálogo</label>
          <div className="search-control">
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Título, disciplina ou tema"
            />
          </div>
          <span className="search-hint">Os resultados são atualizados enquanto você digita.</span>
        </div>
      </section>

      <section className="discipline-section" aria-labelledby="disciplines-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Explore por área</p>
            <h2 id="disciplines-title">Disciplinas</h2>
          </div>
          <span>{visibleLessons.length} {visibleLessons.length === 1 ? "aula" : "aulas"} disponíveis</span>
        </div>
        <div className="discipline-list">
          {disciplines.map((discipline) => (
            <button
              type="button"
              className={selectedDiscipline === discipline.id ? "active" : ""}
              key={discipline.id}
              onClick={() => setSelectedDiscipline((current) => current === discipline.id ? "" : discipline.id)}
            >
              {discipline.name}
            </button>
          ))}
        </div>
      </section>

      <section className="lesson-section" aria-labelledby="lessons-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Conteúdo público</p>
            <h2 id="lessons-title">Videoaulas</h2>
          </div>
        </div>

        {error && <p role="alert" className="catalog-message">{error}</p>}
        {isLoading && <p className="catalog-message">Carregando aulas...</p>}
        {!isLoading && !error && visibleLessons.length === 0 && <p className="catalog-message">Nenhuma aula encontrada para essa busca.</p>}

        <div className="lesson-grid">
          {visibleLessons.map((lesson) => (
            <article className="catalog-card" key={lesson.id}>
              <div className="card-accent"><span>{lesson.discipline?.name || "Educação"}</span></div>
              <div className="card-body">
                <div className="card-meta">{lesson.category?.name || "Conteúdo aberto"} · {lesson.topic?.name || "Videoaula"}</div>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                <div className="card-footer">
                  <span>{lesson.views} visualizações</span>
                  <Link to={`/courses/${lesson.id}/lessons/${lesson.id}`}>Assistir aula →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Catalog;
