"use client";

import React from "react";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DateTextProps {
  date: string | Date | null | undefined;
  className?: string;
}

export function DateText({ date, className }: DateTextProps) {
  const formatted = formatDate(date);

  return (
    <span className={cn("text-body-md text-on-surface whitespace-nowrap", className)}>
      {formatted}
    </span>
  );
}
