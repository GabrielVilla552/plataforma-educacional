import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { getLogin } from "../../utils/auth";
import type {
  Catalog,
  LessonInput,
  LessonItem,
  LessonItems,
  LessonStatus,
  Material,
} from "../../types";
import "./ManageLesson.css";

const STATUS_LABELS: Record<LessonStatus, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicada",
  ARCHIVED: "Arquivada",
};

const EMPTY_FORM: LessonInput = {
  title: "",
  description: "",
  videoUrl: "",
  topicId: "",
  status: "DRAFT",
};

// Converte links do YouTube para o formato embed; outros links são tratados como arquivo de vídeo
function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    // URL inválida, sem preview
  }
  return null;
}

function isValidUrl(url: string) {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

function toForm(lesson: LessonItem): LessonInput {
  return {
    title: lesson.title,
    description: lesson.description,
    videoUrl: lesson.videoUrl,
    topicId: lesson.topicId,
    status: lesson.status,
  };
}

function ManageLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const login = getLogin();
  const isNew = !lessonId;

  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [lesson, setLesson] = useState<LessonItem | null>(null);
  const [form, setForm] = useState<LessonInput>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialForm, setMaterialForm] = useState({ title: "", type: "PDF", url: "" });
  const [materialError, setMaterialError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const requests: [Promise<Catalog>, Promise<LessonItems | null>] = [
      apiFetch<Catalog>("/catalog/"),
      isNew ? Promise.resolve(null) : apiFetch<LessonItems>("/lessons/mine"),
    ];

    Promise.all(requests)
      .then(([catalogData, mine]) => {
        if (cancelled) return;
        setCatalog(catalogData);

        if (isNew) {
          setForm({ ...EMPTY_FORM, topicId: catalogData.topics[0]?.id ?? "" });
          return;
        }

        const found = mine?.items.find((item) => item.id === lessonId);
        if (!found) {
          setError("Videoaula não encontrada ou você não é o autor dela.");
          return;
        }
        setLesson(found);
        setForm(toForm(found));
        setMaterials(found.materials ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Erro ao carregar a videoaula");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isNew, lessonId]);

  if (!login) return <Navigate to="/login" replace />;
  if (login.user.role !== "PROFESSOR") return <Navigate to="/dashboard" replace />;
  if (loading) return <p>Carregando...</p>;

  const updateField = <K extends keyof LessonInput>(key: K, value: LessonInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFeedback(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFeedback(null);

    if (!isValidUrl(form.videoUrl)) {
      setError("Informe uma URL de vídeo válida (http ou https).");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const created = await apiFetch<LessonItem>("/lessons/", {
          method: "POST",
          body: form,
        });
        navigate(`/lessons/${created.id}/manage`, { replace: true });
      } else {
        const updated = await apiFetch<LessonItem>(`/lessons/${lessonId}`, {
          method: "PATCH",
          body: form,
        });
        setLesson(updated);
        setForm(toForm(updated));
        setFeedback("Alterações salvas.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar a videoaula");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lesson) return;
    if (!window.confirm(`Excluir a videoaula "${lesson.title}"? Essa ação não pode ser desfeita.`)) return;

    setSaving(true);
    try {
      await apiFetch<void>(`/lessons/${lesson.id}`, { method: "DELETE" });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir a videoaula");
      setSaving(false);
    }
  };

  const handleAddMaterial = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMaterialError(null);

    try {
      const created = await apiFetch<Material>(`/lessons/${lessonId}/materials`, {
        method: "POST",
        body: materialForm,
      });
      setMaterials((prev) => [...prev, created]);
      setMaterialForm({ title: "", type: "PDF", url: "" });
    } catch (err) {
      setMaterialError(err instanceof Error ? err.message : "Erro ao adicionar material");
    }
  };

  if (!isNew && !lesson) {
    return (
      <main className="manage-page">
        <Link to="/dashboard" className="back-link">← Voltar</Link>
        <p className="manage-error">{error}</p>
      </main>
    );
  }

  const embedUrl = getYoutubeEmbedUrl(form.videoUrl);
  const statusOptions: LessonStatus[] = isNew
    ? ["DRAFT", "PUBLISHED"]
    : ["DRAFT", "PUBLISHED", "ARCHIVED"];

  return (
    <main className="manage-page">
      <header className="manage-header">
        <Link to="/dashboard" className="back-link">
          ← Voltar
        </Link>

        {lesson?.discipline && (
          <p className="manage-label">
            {lesson.discipline.name} · {lesson.category?.name}
          </p>
        )}

        <div className="manage-title">
          <h1>{isNew ? "Nova videoaula" : lesson?.title}</h1>
          {lesson && (
            <span className={`status-badge status-${lesson.status.toLowerCase()}`}>
              {STATUS_LABELS[lesson.status]}
            </span>
          )}
        </div>

        {lesson && (
          <p className="manage-meta">
            {lesson.views} visualizações · atualizada em{" "}
            {new Date(lesson.updatedAt).toLocaleDateString("pt-BR")}
          </p>
        )}
      </header>

      {isValidUrl(form.videoUrl) && (
        <section className="manage-video">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="Preview da videoaula"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={form.videoUrl} controls />
          )}
        </section>
      )}

      <section className="manage-card">
        <h2>{isNew ? "Dados da videoaula" : "Editar videoaula"}</h2>

        <form className="manage-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="videoUrl">URL do vídeo</label>
            <input
              id="videoUrl"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={form.videoUrl}
              onChange={(e) => updateField("videoUrl", e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="topicId">Tópico</label>
              <select
                id="topicId"
                value={form.topicId}
                onChange={(e) => updateField("topicId", e.target.value)}
                required
              >
                {catalog?.categories.map((category) => {
                  const discipline = catalog.disciplines.find((d) => d.id === category.disciplineId);
                  const topics = catalog.topics.filter((t) => t.categoryId === category.id);
                  if (topics.length === 0) return null;

                  return (
                    <optgroup key={category.id} label={`${discipline?.name ?? ""} · ${category.name}`}>
                      {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value as LessonStatus)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="manage-error">{error}</p>}
          {feedback && <p className="manage-feedback">{feedback}</p>}

          <div className="manage-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Salvando..." : isNew ? "Criar videoaula" : "Salvar alterações"}
            </button>

            {!isNew && (
              <button
                type="button"
                className="danger-button"
                onClick={handleDelete}
                disabled={saving}
              >
                Excluir videoaula
              </button>
            )}
          </div>
        </form>
      </section>

      {!isNew && (
        <section className="manage-card">
          <h2>Materiais complementares</h2>

          {materials.length === 0 ? (
            <p className="manage-empty">Nenhum material cadastrado.</p>
          ) : (
            <ul className="material-list">
              {materials.map((material) => (
                <li key={material.id}>
                  <span className="material-type">{material.type}</span>
                  <a href={material.url} target="_blank" rel="noreferrer">
                    {material.title}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <form className="material-form" onSubmit={handleAddMaterial}>
            <input
              placeholder="Título do material"
              value={materialForm.title}
              onChange={(e) => setMaterialForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <select
              value={materialForm.type}
              onChange={(e) => setMaterialForm((prev) => ({ ...prev, type: e.target.value }))}
            >
              <option value="PDF">PDF</option>
              <option value="LINK">Link</option>
              <option value="SLIDES">Slides</option>
            </select>
            <input
              type="url"
              placeholder="https://..."
              value={materialForm.url}
              onChange={(e) => setMaterialForm((prev) => ({ ...prev, url: e.target.value }))}
              required
            />
            <button type="submit" className="secondary-button">
              Adicionar
            </button>
          </form>

          {materialError && <p className="manage-error">{materialError}</p>}
        </section>
      )}
    </main>
  );
}

export default ManageLesson;
