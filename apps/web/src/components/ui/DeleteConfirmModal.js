import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";
export function DeleteConfirmModal({ open, itemType = "item", itemName, onConfirm, onCancel, loading = false, }) {
    const cancelRef = useRef(null);
    // Focus cancel button on open (safer default)
    useEffect(() => {
        if (open)
            cancelRef.current?.focus();
    }, [open]);
    // Escape key closes
    useEffect(() => {
        if (!open)
            return;
        const handler = (e) => {
            if (e.key === "Escape")
                onCancel();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onCancel]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center px-4 bg-void/75 backdrop-blur-sm", onClick: (e) => e.target === e.currentTarget && onCancel(), role: "dialog", "aria-modal": "true", "aria-labelledby": "delete-modal-title", children: _jsxs("div", { className: "w-full max-w-sm bg-surface border border-border-default rounded-2xl p-6 flex flex-col gap-5 shadow-xl", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-danger/10 flex items-center justify-center shrink-0", children: _jsx(AlertTriangle, { size: 16, className: "text-danger" }) }), _jsxs("div", { children: [_jsxs("h2", { id: "delete-modal-title", className: "text-[15px] font-bold text-text-primary leading-snug", children: ["Delete ", itemType] }), itemName && (_jsxs("p", { className: "text-[12px] text-text-secondary mt-0.5 truncate max-w-50", children: ["\"", itemName, "\""] }))] })] }), _jsx("button", { onClick: onCancel, className: "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-text-tertiary hover:text-text-primary hover:bg-elevated transition-colors", "aria-label": "Close", children: _jsx(X, { size: 15 }) })] }), _jsxs("p", { className: "text-[13px] text-text-secondary leading-relaxed", children: ["This will permanently delete this ", itemType, ".", " ", _jsx("span", { className: "text-text-primary font-medium", children: "This action cannot be undone." })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { ref: cancelRef, variant: "secondary", size: "sm", onClick: onCancel, disabled: loading, className: "flex-1", children: "Cancel" }), _jsxs(Button, { variant: "danger", size: "sm", loading: loading, onClick: onConfirm, className: "flex-1", children: ["Delete ", itemType] })] })] }) }));
}
