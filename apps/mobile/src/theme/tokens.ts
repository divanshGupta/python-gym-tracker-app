// apps/mobile/src/theme/tokens.ts
// Import from the package root — Babel alias resolves this correctly
import tokensData from "@gymtracker/tailwind-config";

export const tokens = tokensData.tokens;
export type { Tokens } from "@gymtracker/tailwind-config";