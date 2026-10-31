"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { DataTable, Column } from "@/components/ui/data-table";
import { MoneyText } from "@/components/ui/money-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { useCurrentRole, setCurrentRole } from "@/lib/auth";
import { getDiscounts, createDiscount } from "@/lib/services/api";
import { Discount } from "@/types/database";
import {
  Tag,
  Percent,
  Download,
  Plus,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";

export default function DiscountsPage() {
  const role = useCurrentRole();
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    code: "FESTIVE26",
    description: "Enterprise Q4 Promotional Voucher",
    type: "percentage" as Discount["type"],
    value: 20,
    duration: "repeating" as Discount["duration"],
    applicableScope: "all" as Discount["applicableScope"],
    maxRedemptions: 50,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getDiscounts();
        setDiscounts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createDiscount({
        code: newDiscount.code.toUpperCase(),
        description: newDiscount.description,
        type: newDiscount.type,
        value: Number(newDiscount.value),
        duration: newDiscount.duration,
        applicableScope: newDiscount.applicableScope,
        maxRedemptions: Number(newDiscount.maxRedemptions),
      });

      setDiscounts([created, ...discounts]);
      setIsModalOpen(false);
      toast("Discount Rule Created", {
        description: `Promo code ${created.code} is now active and ready for subscription checkout.`,
        variant: "success",
      });
    } catch (err) {
      toast("Creation Failed", {
        description: "Failed to create discount voucher.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // If role is not admin, show RBAC Guard
  if (role !== "admin") {
    return (
      <BackOfficeLayout>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-badge-overdue-bg text-badge-overdue-text flex items-center justify-center mb-6 shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 rounded-full bg-badge-overdue-bg text-badge-overdue-text font-bold text-xs uppercase tracking-wider mb-2">
            Access Restricted · Admin Only
          </span>
          <h1 className="text-2xl font-bold text-on-surface">Discount Management Locked</h1>
          <p className="text-sm text-text-muted mt-2 leading-relaxed">
            Only workspace administrators have security clearance to create, modify, or revoke promotional discount codes and rate overrides.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                setCurrentRole("admin");
                toast("Role Switched to Admin", {
                  description: "You now have full administrative privileges.",
                  variant: "success",
                });
              }}
              className="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-plum-hover font-semibold text-xs transition-colors shadow-sm"
            >
              Switch to Admin Role
            </button>
            <Link
              href="/admin/dashboard"
              className="px-5 py-2.5 rounded-lg border border-outline text-on-surface hover:bg-surface-container font-medium text-xs transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </BackOfficeLayout>
    );
  }

  const columns: Column<Discount>[] = [
    {
      header: "Voucher Code",
      accessorKey: "code",
      cell: (d) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-primary text-sm tracking-wide">{d.code}</span>
          <span className="text-xs text-text-muted">{d.description}</span>
        </div>
      ),
    },
    {
      header: "Discount Value",
      accessorKey: "value",
      cell: (d) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container font-mono text-xs font-bold text-secondary">
          <Percent className="w-3 h-3" />
          {d.type === "percentage" ? `${d.value}% Off` : `₹${d.value.toLocaleString("en-IN")} Off`}
        </span>
      ),
    },
    {
      header: "Duration",
      accessorKey: "duration",
      cell: (d) => (
        <span className="text-xs font-medium text-on-surface capitalize">
          {d.duration === "once" ? "First Invoice Only" : d.duration === "repeating" ? "First 3 Cycles" : "Forever (Contract Term)"}
        </span>
      ),
    },
    {
      header: "Redemptions",
      accessorKey: "currentRedemptions",
      cell: (d) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-on-surface">
            {d.currentRedemptions} / {d.maxRedemptions || "∞"} used
          </span>
          <div className="w-24 h-1.5 rounded-full bg-surface-container overflow-hidden mt-1">
            <div
              style={{
                width: `${Math.min(100, (d.currentRedemptions / (d.maxRedemptions || 100)) * 100)}%`,
              }}
              className="h-full bg-secondary"
            ></div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (d) => <StatusBadge status={d.status} />,
    },
  ];

  return (
    <BackOfficeLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Discounts & Promo Rules"
          badge="Admin Only"
          subtitle="Create promotional vouchers, tiered volume incentives, and coupon codes for automated recurring invoices."
          breadcrumbs={[
            { label: "Settings" },
            { label: "Discounts", href: "/admin/discounts" },
          ]}
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  toast("Export Complete", {
                    description: "Discounts audit ledger exported to CSV.",
                    variant: "info",
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-outline hover:bg-surface-container text-on-surface text-sm font-medium transition-colors shadow-xs"
              >
                <Download className="w-4 h-4 text-text-muted" />
                <span>Export Ledger</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-plum-hover text-sm font-semibold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Discount Rule</span>
              </button>
            </div>
          }
        />

        {/* Admin Verification Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-surface-container rounded-xl border border-outline/50 shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-primary">Role Verified:</span>{" "}
              <span className="font-semibold text-on-surface">Claire Laurent</span> (Finance Lead / Administrator) ·{" "}
              <span className="text-text-muted">Unrestricted Rule Access & Audit Override Active</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-secondary font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Ledger Guard Sync: Live</span>
          </div>
        </div>

        {/* Bento KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Active Promo Codes"
            value={discounts.filter((d) => d.status === "active").length}
            trend={{ value: "+2 new", direction: "up" }}
            subtitle="Live across checkout & API"
            icon={Tag}
          />
          <KpiCard
            title="Total Redemptions"
            value={discounts.reduce((acc, curr) => acc + curr.currentRedemptions, 0)}
            subtitle="Applied across customer base"
            icon={CheckCircle2}
          />
          <KpiCard
            title="Average Discount"
            value="17.5%"
            subtitle="Blended rate across plans"
            icon={Percent}
          />
          <KpiCard
            title="Volume Savings (MTD)"
            value={<MoneyText amount={1420000} />}
            subtitle="Incentive revenue driver"
            icon={Sparkles}
          />
        </div>

        {/* Discounts Table */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-on-surface">Active Voucher Catalog</h3>
              <p className="text-xs text-text-muted mt-0.5">
                Vouchers stack automatically before statutory GST tax calculations.
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={discounts}
            loading={loading}
            keyExtractor={(d) => d.id}
            pageSize={10}
            emptyTitle="No discount rules found"
            emptyDescription="Create your first discount coupon to incentivize new customer subscriptions."
          />
        </div>

        {/* Create Discount Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Promotional Discount Rule"
          description="Configure discount vouchers to apply at quotation creation or subscription onboarding."
        >
          <form onSubmit={handleCreateDiscount} className="space-y-4">
            <FormField label="Coupon Code" description="Customers will enter this code during checkout." required>
              <input
                type="text"
                placeholder="e.g. DIWALI2026"
                value={newDiscount.code}
                onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-mono uppercase"
                required
              />
            </FormField>

            <FormField label="Description / Campaign Label" required>
              <input
                type="text"
                value={newDiscount.description}
                onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Discount Type">
                <select
                  value={newDiscount.type}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, type: e.target.value as Discount["type"] })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed INR Amount (₹)</option>
                </select>
              </FormField>

              <FormField label="Discount Value" required>
                <input
                  type="number"
                  min="1"
                  value={newDiscount.value}
                  onChange={(e) => setNewDiscount({ ...newDiscount, value: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Duration Period">
                <select
                  value={newDiscount.duration}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, duration: e.target.value as Discount["duration"] })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  <option value="once">Once (First billing cycle only)</option>
                  <option value="repeating">Repeating (Multi-cycle promo)</option>
                  <option value="forever">Forever (Full subscription lifetime)</option>
                </select>
              </FormField>

              <FormField label="Max Redemptions Cap" description="Total customer uses permitted.">
                <input
                  type="number"
                  min="1"
                  value={newDiscount.maxRedemptions}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, maxRedemptions: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </FormField>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-plum-hover text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Voucher Rule"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </BackOfficeLayout>
  );
}
