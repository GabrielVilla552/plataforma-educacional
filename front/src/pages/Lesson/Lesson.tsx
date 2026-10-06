import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getLessonStatusLabel } from "../../utils/lessonStatus";
import "./Lesson.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

type Material = { id: string; title: string; type: string; url: string };
type LessonData = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  views: number;
  materials: Material[];
  topic?: { name: string };
  discipline?: { name: string };
  professor?: { id: string; name: string };
};

function getVideoEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const videoId = parsedUrl.searchParams.get("v") || parsedUrl.pathname.split("/").pop();
    if (parsedUrl.hostname.includes("youtube.com") && videoId) return `https://www.youtube.com/embed/${videoId}`;
    if (parsedUrl.hostname === "youtu.be" && videoId) return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return url;
  }
  return url;
}

function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [error, setError] = useState("");
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);

  const storedUser = localStorage.getItem("authUser");
  const currentUser = storedUser ? JSON.parse(storedUser) as { id: string; role: string } : null;
  const isProfessorOwner = Boolean(
    currentUser?.role === "PROFESSOR" && lesson?.professor?.id === currentUser.id,
  );

  useEffect(() => {
    if (!lessonId) return;

    const token = localStorage.getItem("authToken");
    const getLesson = async () => {
      const privateResponse = token
        ? await fetch(`${API_URL}/lessons/mine/${lessonId}`, { headers: { Authorization: `Bearer ${token}` } })
        : null;
      const response = privateResponse?.ok ? privateResponse : await fetch(`${API_URL}/lessons/${lessonId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Não foi possível carregar esta aula.");
      setLesson(data);
    };

    getLesson()
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar esta aula.");
      });
  }, [lessonId]);

  const handleVisibilityChange = async () => {
    if (!lesson || !isProfessorOwner) return;

    const token = localStorage.getItem("authToken");
    setIsUpdatingVisibility(true);
    setError("");

    try {
      const nextStatus = lesson.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      const response = await fetch(`${API_URL}/lessons/${lesson.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Não foi possível alterar a visibilidade.");
      setLesson(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível alterar a visibilidade.");
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  if (error) {
    return (
      <main className="lesson-page">
        <p role="alert">{error}</p>
        <button type="button" onClick={() => navigate(isProfessorOwner ? "/dashboard" : "/")}>Voltar</button>
      </main>
    );
  }

  if (!lesson) return <main className="lesson-page"><p>Carregando aula...</p></main>;

  return (
    <main className="lesson-page">
      <header className="lesson-header">
        <Link to={isProfessorOwner ? "/dashboard" : "/"} className="back-link">
          ← {isProfessorOwner ? "Voltar ao painel" : "Voltar ao início"}
        </Link>

        <p className="lesson-label">{lesson.discipline?.name || lesson.topic?.name || "Videoaula"}</p>

        <h1>{lesson.title}</h1>
      </header>

      <section className="video-container">
        {lesson.videoUrl.includes("youtube.com") || lesson.videoUrl.includes("youtu.be") ? (
          <iframe
            className="lesson-video"
            src={getVideoEmbedUrl(lesson.videoUrl)}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video className="lesson-video" controls>
            <source src={lesson.videoUrl} />
            Seu navegador não suporta a reprodução deste vídeo.
          </video>
        )}
      </section>

      <section className="lesson-content">
        <div className="lesson-info">
          <h2>Sobre esta aula</h2>

          <p>{lesson.description}</p>

          <span className="lesson-duration">
            {lesson.views} visualizações
          </span>
        </div>

        <div className="lesson-actions">
          <span className={`lesson-status ${lesson.status.toLowerCase()}`}>
            {getLessonStatusLabel(lesson.status)}
          </span>
          {isProfessorOwner && (
            <button type="button" className="visibility-button" onClick={handleVisibilityChange} disabled={isUpdatingVisibility}>
              {isUpdatingVisibility
                ? "Salvando..."
                : lesson.status === "PUBLISHED" ? "Privar aula" : "Publicar aula"}
            </button>
          )}
        </div>
      </section>

      {lesson.materials.length > 0 && (
        <section className="lesson-materials">
          <h2>Materiais complementares</h2>
          <div className="materials-list">
            {lesson.materials.map((material) => (
              <a key={material.id} href={material.url} target="_blank" rel="noreferrer" className="material-link">
                <span>{material.type}</span>
                {material.title}
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Lesson;