"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this data. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-red-50/50 border border-red-200 rounded-lg",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4 ring-8 ring-red-50">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-title-lg font-semibold text-red-900 mb-1">
        {title}
      </h3>
      <p className="text-body-md text-red-700 max-w-md mb-6">
        {description}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition min-h-[44px]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
