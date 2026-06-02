import { jsx as _jsx } from "react/jsx-runtime";
// apps/web/src/components/contributions/RangeSelector.tsx
import { CONTRIBUTION_RANGES, } from '@gymtracker/constants';
export function RangeSelector({ selected, onChange }) {
    return (_jsx("div", { className: "flex gap-1 p-1 rounded md:rounded-lg", children: Object.keys(CONTRIBUTION_RANGES).map((key) => (_jsx("button", { onClick: () => onChange(key), className: `
            text-text-primary border border-text-tertiary p-1 md:px-3 md:py-1 rounded-md text-xs md:text-sm font-medium
            transition-colors duration-150
            ${selected === key
                ? 'bg-elevated text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-primary'}
          `, children: CONTRIBUTION_RANGES[key].label }, key))) }));
}
