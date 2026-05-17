import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";

interface DeleteConfirmModalProps {
  /** Controls visibility */
  open:        boolean;
  /** What are we deleting? e.g. "workout", "goal", "measurement" */
  itemType?:   string;
  /** Optional specific name e.g. "Push Day" or "Weight loss" */
  itemName?:   string;
  /** Called when user confirms deletion */
  onConfirm:   () => void;
  /** Called when user cancels or clicks backdrop */
  onCancel:    () => void;
  /** Show loading spinner on confirm button */
  loading?:    boolean;
}

export function DeleteConfirmModal({
  open,
  itemType = "item",
  itemName,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button on open (safer default)
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Escape key closes
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-void/75 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="w-full max-w-sm bg-surface border border-border-default rounded-2xl p-6 flex flex-col gap-5 shadow-xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-danger" />
            </div>
            <div>
              <h2
                id="delete-modal-title"
                className="text-[15px] font-bold text-text-primary leading-snug"
              >
                Delete {itemType}
              </h2>
              {itemName && (
                <p className="text-[12px] text-text-secondary mt-0.5 truncate max-w-50">
                  "{itemName}"
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-text-tertiary hover:text-text-primary hover:bg-elevated transition-colors"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <p className="text-[13px] text-text-secondary leading-relaxed">
          This will permanently delete this {itemType}.{" "}
          <span className="text-text-primary font-medium">This action cannot be undone.</span>
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            ref={cancelRef}
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={loading}
            onClick={onConfirm}
            className="flex-1"
          >
            Delete {itemType}
          </Button>
        </div>

      </div>
    </div>
  );
}