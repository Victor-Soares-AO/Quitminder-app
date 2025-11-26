export function formatDateToDayMonth(dateString?: string | null) {
  if (!dateString) return "—";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-PT", {
      day: "numeric",
      month: "long",
    }).format(date);
  } catch {
    return "—";
  }
}
