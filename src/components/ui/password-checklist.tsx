"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordChecklistProps {
  password?: string;
  className?: string;
}

export function PasswordChecklist({
  password = "",
  className,
}: PasswordChecklistProps) {
  const rules = [
    {
      id: "length",
      label: "More than 8 characters",
      passed: password.length > 8,
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter (A-Z)",
      passed: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "At least one lowercase letter (a-z)",
      passed: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "At least one number (0-9)",
      passed: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "At least one special character (!@#%^&* or symbols)",
      passed: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div
      className={cn(
        "p-3 rounded-md bg-surface-container-low border border-outline space-y-2",
        className
      )}
    >
      <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
        Password Requirements
      </span>
      <ul className="space-y-1.5">
        {rules.map((rule) => (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors",
              rule.passed
                ? "text-emerald-700 font-medium"
                : "text-on-surface-muted"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white",
                rule.passed ? "bg-emerald-600" : "bg-outline"
              )}
            >
              {rule.passed ? (
                <Check className="w-3 h-3 stroke-[3]" />
              ) : (
                <X className="w-2.5 h-2.5 stroke-[2.5]" />
              )}
            </div>
            <span>{rule.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
