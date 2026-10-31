"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2 pb-4", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-body-sm text-on-surface-muted flex-wrap">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-primary transition-colors hover:underline"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={cn(isLast && "text-on-surface font-medium")}>
                    {crumb.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-3.5 h-3.5 text-on-surface-muted shrink-0" />}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Title + Badges + Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            {title}
          </h1>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
            {actions}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-body-md text-on-surface-variant max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
