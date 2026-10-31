"use client";

import React from "react";
import { Modal } from "./modal";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
}: ConfirmDialogProps) {
  const isDanger = variant === "danger";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 text-body-md font-semibold text-on-surface-variant bg-surface border border-outline rounded-md hover:bg-surface-container transition min-h-[44px]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "w-full sm:w-auto px-5 py-2 text-body-md font-semibold text-white rounded-md transition min-h-[44px] flex items-center justify-center gap-2",
              isDanger
                ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                : "bg-primary hover:bg-primary-hover active:bg-primary-active"
            )}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4 py-2">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            isDanger ? "bg-red-100 text-red-600" : "bg-primary-container text-primary"
          )}
        >
          {isDanger ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5" />
          )}
        </div>
        <p className="text-body-md text-on-surface-variant leading-relaxed">
          {description}
        </p>
      </div>
    </Modal>
  );
}
