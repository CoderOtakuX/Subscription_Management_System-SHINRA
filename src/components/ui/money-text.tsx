"use client";

import React from "react";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MoneyTextProps {
  amount: number | string | null | undefined;
  className?: string;
  currencyClassName?: string;
}

export function MoneyText({ amount, className, currencyClassName }: MoneyTextProps) {
  const numericAmount = typeof amount === "number" ? amount : Number(amount) || 0;
  const formatted = formatINR(numericAmount);

  return (
    <span className={cn("font-medium tracking-tight text-on-surface", className)}>
      {formatted}
    </span>
  );
}
