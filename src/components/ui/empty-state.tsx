"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-4 ring-8 ring-surface-container-low">
        {icon ?? <FolderOpen className="w-7 h-7 text-on-surface-muted" />}
      </div>
      <h3 className="text-title-lg font-semibold text-on-surface mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-body-md text-on-surface-variant max-w-md mb-6">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
