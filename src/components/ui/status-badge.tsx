"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type BadgeStatus =
  | "Draft"
  | "Quotation"
  | "Confirmed"
  | "Active"
  | "Closed"
  | "Paid"
  | "Outstanding"
  | "Overdue"
  | "Pending"
  | "Failed"
  | "Successful"
  | "Invited"
  | "Expired"
  | "Disabled";

const statusStyles: Record<string, string> = {
  Draft: "bg-badge-draft-bg text-badge-draft-text",
  Quotation: "bg-badge-quotation-bg text-badge-quotation-text",
  Confirmed: "bg-badge-confirmed-bg text-badge-confirmed-text",
  Active: "bg-badge-active-bg text-badge-active-text",
  Successful: "bg-badge-active-bg text-badge-active-text",
  Closed: "bg-badge-closed-bg text-badge-closed-text",
  Expired: "bg-badge-closed-bg text-badge-closed-text",
  Disabled: "bg-badge-closed-bg text-badge-closed-text",
  Paid: "bg-badge-active-bg text-badge-active-text",
  Outstanding: "bg-badge-outstanding-bg text-badge-outstanding-text",
  Pending: "bg-badge-outstanding-bg text-badge-outstanding-text",
  Invited: "bg-badge-quotation-bg text-badge-quotation-text",
  Overdue: "bg-badge-overdue-bg text-badge-overdue-text",
  Failed: "bg-badge-overdue-bg text-badge-overdue-text",
};

interface StatusBadgeProps {
  status: BadgeStatus | string;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({
  status,
  className,
  size = "sm",
}: StatusBadgeProps) {
  const style = statusStyles[status] ?? "bg-badge-draft-bg text-badge-draft-text";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold whitespace-nowrap",
        size === "sm"
          ? "px-2.5 py-0.5 text-label-sm"
          : "px-3 py-1 text-label-md",
        style,
        className
      )}
    >
      {status}
    </span>
  );
}
