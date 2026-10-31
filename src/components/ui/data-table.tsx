"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import { EmptyState } from "./empty-state";

export interface Column<T> {
  key?: string;
  accessorKey?: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  isPrimary?: boolean; // Shown in mobile collapsed card (top 3)
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  pageSize?: number;
  className?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  loading,
  emptyTitle = "No records found",
  emptyDescription = "There are no entries to display at this time.",
  emptyAction,
  pageSize = 10,
  className,
  onRowClick,
}: DataTableProps<T>) {
  const isDataLoading = isLoading ?? loading ?? false;
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  const toggleRow = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isDataLoading) {
    return (
      <div className={cn("w-full bg-surface rounded-lg border border-outline overflow-hidden", className)}>
        <div className="p-4 space-y-3">
          <div className="h-10 bg-surface-container rounded animate-pulse" />
          <div className="h-14 bg-surface-container-low rounded animate-pulse" />
          <div className="h-14 bg-surface-container rounded animate-pulse" />
          <div className="h-14 bg-surface-container-low rounded animate-pulse" />
          <div className="h-14 bg-surface-container rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("w-full bg-surface rounded-lg border border-outline overflow-hidden p-8", className)}>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      </div>
    );
  }

  // Identify top primary columns for mobile card
  const primaryColumns = columns.filter((col) => col.isPrimary);
  const displayMobileCols = primaryColumns.length > 0 ? primaryColumns : columns.slice(0, 3);
  const secondaryCols = columns.filter((col) => !displayMobileCols.includes(col));

  return (
    <div className={cn("w-full bg-surface rounded-lg border border-outline overflow-hidden flex flex-col", className)}>
      {/* Desktop / Tablet Table View (md and up) */}
      <div className="hidden md:block overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline">
              {columns.map((col, idx) => (
                <th
                  key={col.key || col.accessorKey || idx}
                  className={cn(
                    "px-4 py-3 text-label-md font-semibold text-on-surface-variant uppercase tracking-wider text-xs",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline">
            {currentData.map((item, rowIdx) => {
              const rowKey = keyExtractor(item);
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "transition-colors hover:bg-surface-container-low/60 group",
                    onRowClick ? "cursor-pointer" : ""
                  )}
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={col.key || col.accessorKey || cIdx}
                      className={cn("px-4 py-3.5 text-body-md text-on-surface align-middle", col.className)}
                    >
                      {col.cell(item, startIndex + rowIdx)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards View (below md) */}
      <div className="md:hidden divide-y divide-outline">
        {currentData.map((item, rowIdx) => {
          const rowKey = keyExtractor(item);
          const isExpanded = !!expandedRows[rowKey];

          return (
            <div
              key={rowKey}
              onClick={() => onRowClick?.(item)}
              className="p-4 transition-colors hover:bg-surface-container-low/50"
            >
              {/* Primary 2-3 fields */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  {displayMobileCols.map((col, cIdx) => (
                    <div key={col.key || col.accessorKey || cIdx} className="flex flex-col">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-on-surface-muted">
                        {col.header}
                      </span>
                      <div className="text-body-md font-medium text-on-surface">
                        {col.cell(item, startIndex + rowIdx)}
                      </div>
                    </div>
                  ))}
                </div>

                {secondaryCols.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => toggleRow(rowKey, e)}
                    className="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={isExpanded ? "Collapse details" : "Expand details"}
                  >
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                )}
              </div>

              {/* Collapsed Secondary Fields Drawer */}
              {isExpanded && secondaryCols.length > 0 && (
                <div className="mt-3 pt-3 border-t border-outline/70 grid grid-cols-2 gap-2 text-body-sm bg-surface-container-low/60 p-3 rounded-md">
                  {secondaryCols.map((col, sIdx) => (
                    <div key={col.key || col.accessorKey || sIdx} className="flex flex-col">
                      <span className="text-[11px] font-semibold text-on-surface-muted uppercase">
                        {col.header}
                      </span>
                      <div className="text-on-surface font-medium mt-0.5">
                        {col.cell(item, startIndex + rowIdx)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-outline bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 text-body-sm text-on-surface-variant">
          <div>
            Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
            <span className="font-semibold">{Math.min(startIndex + pageSize, data.length)}</span> of{" "}
            <span className="font-semibold">{data.length}</span> results
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="p-1.5 rounded hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-medium text-on-surface">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="p-1.5 rounded hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
