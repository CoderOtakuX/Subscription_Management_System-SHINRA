"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, X } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  selectedValue?: string;
  onChange?: (value: string) => void;
}

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filterGroups?: FilterGroup[];
  tabs?: {
    id: string;
    label: string;
    count?: number;
    active?: boolean;
    onClick: () => void;
  }[];
  actions?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search records...",
  filterGroups = [],
  tabs = [],
  actions,
  className,
}: FilterBarProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Quick Filter Tabs (e.g. All, Active, Quotation, Expiring) */}
      {tabs.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-outline">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={tab.onClick}
              className={cn(
                "px-3.5 py-2 text-body-sm font-semibold rounded-t-md transition whitespace-nowrap border-b-2 flex items-center gap-2",
                tab.active
                  ? "border-primary text-primary bg-primary-container/30"
                  : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              )}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-bold",
                    tab.active
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Bar: Search + Filters + Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 min-w-[240px] max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-base sm:text-body-md rounded-md bg-surface border border-outline text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange?.("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-on-surface p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Desktop Dropdown filters + Mobile sheet trigger + Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Desktop Filter Dropdowns */}
          <div className="hidden md:flex items-center gap-2">
            {filterGroups.map((group) => (
              <select
                key={group.id}
                aria-label={`Filter by ${group.label}`}
                value={group.selectedValue ?? ""}
                onChange={(e) => group.onChange?.(e.target.value)}
                className="py-2 px-3 text-body-sm font-medium rounded-md bg-surface border border-outline text-on-surface focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              >
                <option value="">All {group.label}</option>
                {group.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>

          {/* Mobile Filter Sheet Button */}
          {filterGroups.length > 0 && (
            <button
              type="button"
              aria-label="Open filter options"
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded-md border border-outline bg-surface text-body-sm font-medium text-on-surface min-h-[44px]"
            >
              <SlidersHorizontal className="w-4 h-4 text-on-surface-variant" />
              <span>Filters</span>
            </button>
          )}

          {/* Action buttons (e.g. + New Plan, Export CSV) */}
          {actions}
        </div>
      </div>

      {/* Mobile Filter Sheet Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs md:hidden">
          <div className="w-full bg-surface rounded-t-xl sm:rounded-xl p-6 shadow-xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <h3 className="text-title-lg font-semibold text-on-surface">Filters</h3>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 text-on-surface-variant hover:text-on-surface rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {filterGroups.map((group) => (
                <div key={group.id} className="space-y-1.5">
                  <label htmlFor={`mobile-filter-${group.id}`} className="text-body-sm font-semibold text-on-surface">
                    {group.label}
                  </label>
                  <select
                    id={`mobile-filter-${group.id}`}
                    aria-label={`Filter by ${group.label}`}
                    value={group.selectedValue ?? ""}
                    onChange={(e) => {
                      group.onChange?.(e.target.value);
                    }}
                    className="w-full py-2.5 px-3 text-base rounded-md bg-surface border border-outline text-on-surface min-h-[44px]"
                  >
                    <option value="">All {group.label}</option>
                    {group.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-outline flex gap-3">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-md bg-primary text-on-primary font-semibold min-h-[44px]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
