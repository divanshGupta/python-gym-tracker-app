// packages/utils/src/contributions/fill.ts
import { parseLocalDate, formatDate } from './dateUtils';
export function fillContributionGaps(contributions, // sparse, already normalized
from, // YYYY-MM-DD
to // YYYY-MM-DD
) {
    // Build the O(1) lookup map — this is why you said "map"
    const lookup = new Map();
    for (const c of contributions) {
        lookup.set(c.date, c.count);
    }
    const result = [];
    const current = parseLocalDate(from);
    const end = parseLocalDate(to);
    // Walk every day in the range
    while (current <= end) {
        const dateStr = formatDate(current);
        result.push({
            date: dateStr,
            count: lookup.get(dateStr) ?? 0, // 0 if not in sparse array
        });
        current.setDate(current.getDate() + 1); // advance one day
    }
    return result;
}
