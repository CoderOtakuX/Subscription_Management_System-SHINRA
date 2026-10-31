"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  change?: {
    value: string;
    positive?: boolean;
    neutral?: boolean;
  };
  trend?: {
    value: string;
    direction?: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  change,
  trend,
  icon: IconProp,
  className,
}: KpiCardProps) {
  // Normalize trend/change
  const effectiveChange = change || (trend ? {
    value: trend.value,
    positive: trend.direction === "up",
    neutral: trend.direction === "neutral",
  } : undefined);

  // Render icon if component or ReactNode
  const renderIcon = () => {
    if (!IconProp) return null;
    if (React.isValidElement(IconProp)) {
      return IconProp;
    }
    const Comp = IconProp as React.ComponentType<{ className?: string }>;
    return <Comp className="w-4 h-4" />;
  };

  return (
    <div
      className={cn(
        "bg-surface rounded-lg border border-outline p-5 flex flex-col justify-between shadow-xs transition hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-body-sm font-medium text-on-surface-variant truncate">
          {title}
        </span>
        {IconProp && (
          <div className="w-8 h-8 rounded-md bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
            {renderIcon()}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-on-surface">
          {value}
        </div>

        {(effectiveChange || subtitle) && (
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            {effectiveChange && (
              <span
                className={cn(
                  "inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded",
                  effectiveChange.positive
                    ? "bg-emerald-50 text-emerald-700"
                    : effectiveChange.neutral
                    ? "bg-gray-100 text-gray-700"
                    : "bg-red-50 text-red-700"
                )}
              >
                {effectiveChange.positive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : effectiveChange.neutral ? (
                  <Minus className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                )}
                {effectiveChange.value}
              </span>
            )}
            {subtitle && (
              <span className="text-body-sm text-on-surface-muted truncate">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
