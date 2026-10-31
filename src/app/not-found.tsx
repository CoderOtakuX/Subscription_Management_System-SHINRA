"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileQuestion, ArrowLeft, Home, LayoutDashboard } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col items-center justify-center p-6 antialiased text-on-surface">
      <div className="max-w-md w-full bg-surface border border-outline rounded-2xl p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary-container text-primary flex items-center justify-center mx-auto shadow-xs">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-surface-container text-text-muted font-mono font-bold text-xs uppercase tracking-wider">
            HTTP 404 · Page Not Found
          </span>
          <h1 className="text-2xl font-bold text-on-surface mt-3">
            Looking for a missing ledger or document?
          </h1>
          <p className="text-sm text-text-muted mt-2 leading-relaxed">
            The page, subscription contract, or invoice statement you requested could not be located in the billing system registry.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-outline hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <Link
            href="/admin/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-plum-hover text-xs font-semibold transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
          <Link
            href="/portal"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Home className="w-4 h-4 text-text-muted" />
            <span>Customer Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
