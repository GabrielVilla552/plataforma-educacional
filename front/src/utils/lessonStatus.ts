export type LessonStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

const statusLabels: Record<LessonStatus, string> = {
  PUBLISHED: "Publicado",
  DRAFT: "Privado",
  ARCHIVED: "Arquivado",
};

export function getLessonStatusLabel(status: string) {
  return statusLabels[status as LessonStatus] || status;
}
