"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth,
  size = "lg",
  className,
}: ModalProps) {
  const effectiveMaxWidth = maxWidth || size;
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const modalEl = modalRef.current;
    // Find all focusable elements
    const focusable = modalEl?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && modalEl && focusable && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
  }[effectiveMaxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog (Full screen on mobile, floating dialog on sm+) */}
      <div
        ref={modalRef}
        className={cn(
          "relative z-10 w-full bg-surface shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] rounded-t-2xl sm:rounded-xl border border-outline overflow-hidden transition-all",
          maxWidthStyles,
          className
        )}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline flex items-center justify-between shrink-0 bg-surface">
          <div>
            <h2 id="modal-title" className="text-title-lg font-bold text-on-surface">
              {title}
            </h2>
            {description && (
              <p className="text-body-sm text-on-surface-variant mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-outline bg-surface-container-low flex flex-col-reverse sm:flex-row items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
