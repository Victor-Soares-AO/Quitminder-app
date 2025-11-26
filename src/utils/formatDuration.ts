export function formatDuration(totalMinutes){
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (h === 0) return `${m} minuto${m !== 1 ? "s" : ""}`;
    if (m === 0) return `${h} hora${h !== 1 ? "s" : ""}`;
    return `${h} hora${h !== 1 ? "s" : ""} e ${m} minuto${m !== 1 ? "s" : ""}`;
};