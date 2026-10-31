"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { MoneyText } from "@/components/ui/money-text";
import { DataTable, Column } from "@/components/ui/data-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { useToast } from "@/components/ui/toast";
import { getPlans } from "@/lib/services/api";
import { Plan } from "@/types/database";
import { Layers, Plus, Edit3, CheckCircle2, PauseCircle, RefreshCw, XCircle } from "lucide-react";

export default function PlansListPage() {
  const toast = useToast();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [cadenceFilter, setCadenceFilter] = useState("all");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getPlans();
        setPlans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = plans.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.code.toLowerCase().includes(searchVal.toLowerCase());
    const matchesCadence =
      cadenceFilter === "all" || p.cadence.toLowerCase() === cadenceFilter.toLowerCase();
    return matchesSearch && matchesCadence;
  });

  const columns: Column<Plan>[] = [
    {
      key: "name",
      header: "Plan Name",
      isPrimary: true,
      cell: (p) => (
        <div>
          <Link
            href={`/admin/plans/${p.id}/edit`}
            className="font-bold text-primary hover:underline block"
          >
            {p.name}
          </Link>
          <span className="font-mono text-xs text-on-surface-muted">{p.code}</span>
        </div>
      ),
    },
    {
      key: "cadence",
      header: "Cadence",
      cell: (p) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface capitalize">
          {p.cadence}
        </span>
      ),
    },
    {
      key: "price",
      header: "Base Recurring Rate",
      isPrimary: true,
      cell: (p) => <MoneyText amount={p.price} className="font-bold text-on-surface" />,
    },
    {
      key: "policies",
      header: "Contract Rules",
      cell: (p) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {p.pausable && (
            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold">
              Pausable
            </span>
          )}
          {p.renewable && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
              Renewable
            </span>
          )}
          {p.closableByCustomer && (
            <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[11px] font-semibold">
              Closable
            </span>
          )}
          {p.autoClose && (
            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[11px] font-semibold">
              Auto-Close
            </span>
          )}
        </div>
      ),
    },
    {
      key: "subscriberCount",
      header: "Active Accounts",
      cell: (p) => <span className="font-medium text-on-surface">{p.subscriberCount}</span>,
    },
    {
      key: "mrrGenerated",
      header: "Monthly Run-rate",
      isPrimary: true,
      cell: (p) => <MoneyText amount={p.mrrGenerated} className="font-bold text-emerald-700" />,
    },
    {
      key: "actions",
      header: "",
      cell: (p) => (
        <Link
          href={`/admin/plans/${p.id}/edit`}
          className="p-1.5 text-on-surface-muted hover:text-primary rounded flex items-center gap-1 text-xs font-medium"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Edit</span>
        </Link>
      ),
    },
  ];

  return (
    <BackOfficeLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        <PageHeader
          title="Subscription Plans"
          subtitle="Configure daily, weekly, monthly, and yearly recurring plan tiers and lifecycle policies."
          breadcrumbs={[
            { label: "Billing", href: "/admin/plans" },
            { label: "Plans" },
          ]}
          actions={
            <Link
              href="/admin/plans/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-on-primary hover:bg-primary-hover font-bold text-body-sm shadow-xs min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Plan</span>
            </Link>
          }
        />

        <FilterBar
          searchValue={searchVal}
          onSearchChange={setSearchVal}
          searchPlaceholder="Search plans by name or SKU..."
          tabs={[
            { id: "all", label: "All Cadences", count: plans.length, active: cadenceFilter === "all", onClick: () => setCadenceFilter("all") },
            { id: "monthly", label: "Monthly SaaS", count: plans.filter((p) => p.cadence === "monthly").length, active: cadenceFilter === "monthly", onClick: () => setCadenceFilter("monthly") },
            { id: "yearly", label: "Yearly Enterprise", count: plans.filter((p) => p.cadence === "yearly").length, active: cadenceFilter === "yearly", onClick: () => setCadenceFilter("yearly") },
            { id: "weekly", label: "Weekly Sprint", count: plans.filter((p) => p.cadence === "weekly").length, active: cadenceFilter === "weekly", onClick: () => setCadenceFilter("weekly") },
            { id: "daily", label: "Daily Sandbox", count: plans.filter((p) => p.cadence === "daily").length, active: cadenceFilter === "daily", onClick: () => setCadenceFilter("daily") },
          ]}
        />

        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(p) => p.id}
          isLoading={isLoading}
          pageSize={8}
        />
      </div>
    </BackOfficeLayout>
  );
}
