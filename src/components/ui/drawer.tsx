"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  children,
  footer,
  width,
  size = "lg",
  className,
}: DrawerProps) {
  const effectiveSubtitle = subtitle || description;
  const effectiveWidth = (width || size || "lg") as "md" | "lg" | "xl";
  const drawerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const drawerEl = drawerRef.current;
    const focusable = drawerEl?.querySelectorAll<HTMLElement>(
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
      if (e.key === "Tab" && drawerEl && focusable && focusable.length > 0) {
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

  const widthStyles = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-xl",
    xl: "sm:max-w-2xl",
  }[effectiveWidth as "sm" | "md" | "lg" | "xl"] || "sm:max-w-xl";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        {/* Drawer Panel */}
        <div
          ref={drawerRef}
          className={cn(
            "w-screen bg-surface shadow-2xl flex flex-col border-l border-outline transform transition-transform ease-in-out duration-300",
            widthStyles,
            className
          )}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-outline flex items-center justify-between shrink-0 bg-surface">
            <div>
              <h2 id="drawer-title" className="text-title-lg font-bold text-on-surface">
                {title}
              </h2>
              {effectiveSubtitle && (
                <p className="text-body-sm text-on-surface-variant mt-0.5">
                  {effectiveSubtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

          {/* Drawer Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-outline bg-surface-container-low flex flex-col-reverse sm:flex-row items-center justify-end gap-3 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
