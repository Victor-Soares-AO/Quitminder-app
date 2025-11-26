export function calculateAbstinence(lastRelapseDate) {

    const now = new Date();
    const relapse = new Date(lastRelapseDate);

    const diffMs = now.getTime() - relapse.getTime();
    if (diffMs < 0) return "—";

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d  ${hours}h  ${minutes}m  ${seconds}s`;
}