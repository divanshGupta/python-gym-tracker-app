// packages/utils/src/contributions/heatmap.ts
import { parseLocalDate, formatDate } from './dateUtils';
// Snaps a date back to the most recent Sunday
// If the date is already a Sunday, returns it unchanged
function snapToWeekStart(dateStr) {
    const date = parseLocalDate(dateStr);
    const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
    date.setDate(date.getDate() - dayOfWeek);
    return formatDate(date);
}
export function buildHeatmapGrid(
// Dense array with intensity already applied
entries) {
    if (entries.length === 0)
        return [];
    // Build O(1) lookup — same pattern as fill.ts
    const lookup = new Map();
    for (const entry of entries) {
        lookup.set(entry.date, entry);
    }
    // Snap grid start to nearest Sunday before range start
    const gridStart = snapToWeekStart(entries[0].date);
    const gridEnd = entries[entries.length - 1].date;
    const weeks = [];
    const current = parseLocalDate(gridStart);
    const end = parseLocalDate(gridEnd);
    // Walk day by day, grouping into weeks
    while (current <= end) {
        const week = [];
        // Each week is exactly 7 days (Sun → Sat)
        for (let dow = 0; dow < 7; dow++) {
            const dateStr = formatDate(current);
            if (current <= end) {
                // Date is within range — use real entry or empty placeholder
                week.push(lookup.get(dateStr) ?? {
                    date: dateStr,
                    count: 0,
                    intensity: 0,
                });
                current.setDate(current.getDate() + 1);
            }
        }
        weeks.push({ days: week });
    }
    return weeks;
}
