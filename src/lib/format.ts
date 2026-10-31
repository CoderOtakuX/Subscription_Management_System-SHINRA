import { format, parseISO } from "date-fns";

/**
 * Format a number as Indian Rupees (INR) currency.
 * @example formatINR(240300) => "₹2,40,300.00"
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a compact INR value without decimals.
 * @example formatINRCompact(84250) => "₹84,250"
 */
export function formatINRCompact(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string or Date object as "dd MMM yyyy".
 * @example formatDate("2026-11-15") => "15 Nov 2026"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    if (isNaN(d.getTime())) return "—";
    return format(d, "dd MMM yyyy");
  } catch {
    return "—";
  }
}

/**
 * Format a date string or Date object as "dd MMM yyyy, hh:mm a".
 * @example formatDateTime("2026-11-15T10:30:00") => "15 Nov 2026, 10:30 AM"
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    if (isNaN(d.getTime())) return "—";
    return format(d, "dd MMM yyyy, hh:mm a");
  } catch {
    return "—";
  }
}

/**
 * Format a percentage value.
 * @example formatPercent(12.4) => "12.4%"
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format a number with Indian number system separators.
 * @example formatNumber(1428) => "1,428"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}
