import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  error?:    string;
  hint?:     string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, iconLeft, iconRight, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-medium text-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {iconLeft && (
            <span className="absolute left-3 flex items-center text-text-tertiary pointer-events-none">
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={[
              "w-full h-9 bg-elevated border rounded-md text-[13px] text-text-primary placeholder:text-text-tertiary",
              "transition-colors duration-150 outline-none",
              "focus:border-accent focus:ring-2 focus:ring-accent/20",
              error
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "border-border-default hover:border-border-strong",
              iconLeft  ? "pl-9"  : "pl-3",
              iconRight ? "pr-9"  : "pr-3",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              className,
            ].join(" ")}
            {...props}
          />

          {iconRight && (
            <span className="absolute right-3 flex items-center text-text-tertiary">
              {iconRight}
            </span>
          )}
        </div>

        {error && (
          <p className="text-[11px] text-danger">{error}</p>
        )}
        {!error && hint && (
          <p className="text-[11px] text-text-tertiary">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";


// ── Textarea variant ────────────────────────────────────────────────────────

import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?:  string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[12px] font-medium text-text-secondary">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={[
            "w-full bg-elevated border rounded-md text-[13px] text-text-primary placeholder:text-text-tertiary",
            "px-3 py-2.5 resize-none transition-colors duration-150 outline-none",
            "focus:border-accent focus:ring-2 focus:ring-accent/20",
            error
              ? "border-danger focus:border-danger focus:ring-danger/20"
              : "border-border-default hover:border-border-strong",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            className,
          ].join(" ")}
          {...props}
        />

        {error && <p className="text-[11px] text-danger">{error}</p>}
        {!error && hint && <p className="text-[11px] text-text-tertiary">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";


// ── Select variant ──────────────────────────────────────────────────────────

import { type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?:  string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className = "", id, children, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[12px] font-medium text-text-secondary">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={[
              "w-full h-9 bg-elevated border rounded-md text-[13px] text-text-primary appearance-none",
              "pl-3 pr-8 transition-colors duration-150 outline-none",
              "focus:border-accent focus:ring-2 focus:ring-accent/20",
              error
                ? "border-danger"
                : "border-border-default hover:border-border-strong",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              className,
            ].join(" ")}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
          />
        </div>

        {error && <p className="text-[11px] text-danger">{error}</p>}
        {!error && hint && <p className="text-[11px] text-text-tertiary">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";