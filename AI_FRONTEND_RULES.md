# GymTracker Frontend Rules

## Stack
- React
- TypeScript
- TailwindCSS
- React Query
- Zustand/Redux Toolkit

## Styling Rules
- Mobile-first Tailwind only
- Reuse theme tokens
- No inline styles
- No arbitrary values unless necessary

## Responsive Rules
- Avoid fixed widths
- Prefer responsive grid/flex
- Preserve desktop layouts
- Prevent horizontal overflow

## Component Rules
- Keep components small
- Reuse existing UI patterns
- Prefer composition over duplication

## UX Rules
- Skeletons for async loading
- Error states required
- Empty states required
- Smooth hover/transition animations

## Accessibility
- aria-label where needed
- keyboard accessible
- minimum touch target 44px

## Important
- Explain major architectural changes
- Keep diffs small
- Never rewrite unrelated files