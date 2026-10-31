"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  durationMs?: number;
}

export interface ToastContextValue {
  toast: (title: string, options?: { description?: string; variant?: ToastType | "default" }) => void;
  showToast: (props: Omit<ToastItem, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, description, durationMs = 4000 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, description, durationMs };
      setToasts((prev) => [...prev, newToast]);

      if (durationMs > 0) {
        setTimeout(() => {
          removeToast(id);
        }, durationMs);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => {
      showToast({ type: "success", title, description });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      showToast({ type: "error", title, description });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      showToast({ type: "info", title, description });
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, description?: string) => {
      showToast({ type: "warning", title, description });
    },
    [showToast]
  );

  const toast = useCallback(
    (title: string, options?: { description?: string; variant?: ToastType | "default" }) => {
      const variant = options?.variant === "default" ? "info" : options?.variant || "info";
      showToast({ type: variant, title, description: options?.description });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ toast, showToast, success, error, info, warning }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border text-on-surface bg-surface transition-all transform ease-out duration-200 animate-in fade-in slide-in-from-bottom-3",
                t.type === "success" && "border-emerald-300 bg-emerald-50/90 text-emerald-950",
                t.type === "error" && "border-red-300 bg-red-50/90 text-red-950",
                t.type === "warning" && "border-amber-300 bg-amber-50/90 text-amber-950",
                t.type === "info" && "border-blue-300 bg-blue-50/90 text-blue-950"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-600" />}
                {t.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                {t.type === "info" && <Info className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1">
                <h4 className="text-body-md font-semibold">{t.title}</h4>
                {t.description && (
                  <p className="text-body-sm opacity-90 mt-0.5">{t.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-on-surface-muted hover:text-on-surface p-1 rounded min-h-[32px] min-w-[32px] flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      toast: (title: string, opts?: any) => console.log(`[Toast] ${title}`, opts),
      showToast: console.log,
      success: (t: string) => alert(`[Success] ${t}`),
      error: (t: string) => alert(`[Error] ${t}`),
      info: (t: string) => alert(`[Info] ${t}`),
      warning: (t: string) => alert(`[Warning] ${t}`),
    };
  }
  return context;
}
