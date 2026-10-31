"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentRole, setCurrentRole } from "@/lib/auth";
import { useToast } from "@/components/ui/toast";
import { ShieldAlert, ArrowLeft, Home, UserCheck, Lock } from "lucide-react";

export default function ForbiddenPage() {
  const router = useRouter();
  const role = useCurrentRole();
  const { toast } = useToast();

  const handleSwitchToAdmin = () => {
    setCurrentRole("admin");
    toast("Switched to Administrator Role", {
      description: "You now have unrestricted access to all billing and staff features.",
      variant: "success",
    });
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col items-center justify-center p-6 antialiased text-on-surface">
      <div className="max-w-md w-full bg-surface border border-outline rounded-2xl p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-badge-overdue-bg text-badge-overdue-text flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-badge-overdue-bg text-badge-overdue-text font-bold text-xs uppercase tracking-wider">
            HTTP 403 · Access Denied
          </span>
          <h1 className="text-2xl font-bold text-on-surface mt-3">
            Administrative Clearance Required
          </h1>
          <p className="text-sm text-text-muted mt-2 leading-relaxed">
            Your current active role is <strong className="text-primary font-bold uppercase">{role}</strong>. This module (Staff Management or Discount Rules) requires root <strong className="text-on-surface">Administrator</strong> privileges.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface-container border border-outline/50 text-left space-y-2 text-xs">
          <div className="font-bold text-on-surface flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-secondary" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <p className="text-text-muted leading-relaxed">
            In our development demo environment, you can switch your active security role instantly below:
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={handleSwitchToAdmin}
              className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-plum-hover transition-colors"
            >
              Switch to Admin
            </button>
            <button
              onClick={() => {
                setCurrentRole("staff");
                toast("Role Switched to Staff", { variant: "info" });
                router.push("/admin/dashboard");
              }}
              className="px-3 py-1.5 rounded-lg bg-surface border border-outline text-on-surface text-xs font-medium hover:bg-surface-container transition-colors"
            >
              Switch to Staff
            </button>
            <button
              onClick={() => {
                setCurrentRole("customer");
                toast("Role Switched to Customer", { variant: "info" });
                router.push("/portal");
              }}
              className="px-3 py-1.5 rounded-lg bg-surface border border-outline text-on-surface text-xs font-medium hover:bg-surface-container transition-colors"
            >
              Switch to Customer
            </button>
          </div>
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
            href={role === "customer" ? "/portal" : "/admin/dashboard"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Home className="w-4 h-4 text-text-muted" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
