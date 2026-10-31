"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { DataTable, Column } from "@/components/ui/data-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { Drawer } from "@/components/ui/drawer";
import { useToast } from "@/components/ui/toast";
import { getSubscriptions } from "@/lib/services/api";
import { Subscription } from "@/types/database";
import {
  RefreshCw,
  Plus,
  Download,
  Table as TableIcon,
  Kanban as KanbanIcon,
  TrendingUp,
  Layers,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function SubscriptionsListPage() {
  const router = useRouter();
  const toast = useToast();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [searchVal, setSearchVal] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getSubscriptions();
        setSubscriptions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.number.toLowerCase().includes(searchVal.toLowerCase()) ||
      sub.customerName.toLowerCase().includes(searchVal.toLowerCase()) ||
      sub.planName.toLowerCase().includes(searchVal.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || sub.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const columns: Column<Subscription>[] = [
    {
      key: "number",
      header: "Subscription #",
      isPrimary: true,
      cell: (sub) => (
        <span className="font-bold text-primary group-hover:underline">
          {sub.number}
        </span>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      isPrimary: true,
      cell: (sub) => (
        <div>
          <p className="font-semibold text-on-surface leading-tight">{sub.customerName}</p>
          <p className="text-xs text-on-surface-muted truncate mt-0.5">{sub.customerEmail}</p>
        </div>
      ),
    },
    {
      key: "planName",
      header: "Plan & Cadence",
      cell: (sub) => (
        <div>
          <span className="font-medium text-on-surface">{sub.planName}</span>
          <span className="text-xs text-on-surface-muted block capitalize">{sub.cadence}</span>
        </div>
      ),
    },
    {
      key: "planPrice",
      header: "Contract Amount",
      isPrimary: true,
      cell: (sub) => <MoneyText amount={sub.planPrice} className="font-bold text-on-surface" />,
    },
    {
      key: "status",
      header: "Status",
      cell: (sub) => <StatusBadge status={sub.status} />,
    },
    {
      key: "nextInvoiceDate",
      header: "Next Billing",
      cell: (sub) => <DateText date={sub.nextInvoiceDate} />,
    },
    {
      key: "actions",
      header: "",
      cell: () => (
        <ChevronRight className="w-4 h-4 text-on-surface-muted group-hover:text-primary transition" />
      ),
    },
  ];

  const kanbanStages = ["Draft", "Quotation", "Confirmed", "Active", "Closed"];

  return (
    <BackOfficeLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Subscriptions"
          subtitle={
            <span className="flex items-center gap-2">
              Automated recurring contract engine ·{" "}
              <span className="font-caveat text-amber-900 text-lg font-bold -rotate-1">
                recurring revenue on autopilot ✨
              </span>
            </span>
          }
          badge={
            <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-primary text-xs font-bold uppercase tracking-wider">
              Live Billing Engine
            </span>
          }
          actions={
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Table / Kanban View Toggle */}
              <div className="bg-surface-container rounded-lg p-1 flex items-center border border-outline">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                    viewMode === "table"
                      ? "bg-surface text-on-surface shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("kanban")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                    viewMode === "kanban"
                      ? "bg-surface text-on-surface shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <KanbanIcon className="w-3.5 h-3.5" />
                  <span>Kanban</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => toast.success("Export Complete", "Exported subscriptions CSV.")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-surface border border-outline hover:bg-surface-container text-on-surface font-semibold text-body-sm shadow-xs min-h-[44px]"
              >
                <Download className="w-4 h-4 text-on-surface-variant" />
                <span>Export</span>
              </button>

              <Link
                href="/admin/subscriptions/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-on-primary hover:bg-primary-hover font-bold text-body-sm shadow-xs min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>New Subscription</span>
              </Link>
            </div>
          }
        />

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Monthly Recurring Revenue"
            value={<MoneyText amount={8425000} />}
            subtitle="vs. ₹74,90,000 last month"
            change={{ value: "+12.4%", positive: true }}
            icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
          />
          <KpiCard
            title="Active Contracts"
            value="1,428"
            subtitle="98.2% retention rate"
            change={{ value: "+34 this wk", positive: true }}
            icon={<RefreshCw className="w-4 h-4 text-primary" />}
          />
          <KpiCard
            title="Pending Quotations"
            value="42"
            subtitle={<MoneyText amount={680000} />}
            change={{ value: "15-day validity", neutral: true }}
            icon={<FileText className="w-4 h-4 text-blue-600" />}
          />
          <KpiCard
            title="Contract Churn Rate"
            value="1.8%"
            subtitle="Target < 2.5%"
            change={{ value: "Low", positive: true }}
            icon={<AlertCircle className="w-4 h-4 text-amber-600" />}
          />
        </div>

        {/* Filter Bar with Status Tabs */}
        <FilterBar
          searchValue={searchVal}
          onSearchChange={setSearchVal}
          searchPlaceholder="Search by subscription #, customer name, plan..."
          tabs={[
            { id: "all", label: "All Contracts", count: subscriptions.length, active: statusFilter === "all", onClick: () => setStatusFilter("all") },
            { id: "active", label: "Active", count: subscriptions.filter((s) => s.status === "Active").length, active: statusFilter === "active", onClick: () => setStatusFilter("active") },
            { id: "quotation", label: "Quotation", count: subscriptions.filter((s) => s.status === "Quotation").length, active: statusFilter === "quotation", onClick: () => setStatusFilter("quotation") },
            { id: "confirmed", label: "Confirmed", count: subscriptions.filter((s) => s.status === "Confirmed").length, active: statusFilter === "confirmed", onClick: () => setStatusFilter("confirmed") },
            { id: "draft", label: "Draft", count: subscriptions.filter((s) => s.status === "Draft").length, active: statusFilter === "draft", onClick: () => setStatusFilter("draft") },
            { id: "closed", label: "Closed", count: subscriptions.filter((s) => s.status === "Closed").length, active: statusFilter === "closed", onClick: () => setStatusFilter("closed") },
          ]}
        />

        {/* VIEW 1: Table View */}
        {viewMode === "table" ? (
          <DataTable
            columns={columns}
            data={filteredSubscriptions}
            keyExtractor={(sub) => sub.id}
            isLoading={isLoading}
            pageSize={8}
            onRowClick={(sub) => setSelectedSub(sub)}
          />
        ) : (
          /* VIEW 2: Kanban Board View */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
            {kanbanStages.map((stage) => {
              const stageSubs = filteredSubscriptions.filter(
                (s) => s.status.toLowerCase() === stage.toLowerCase()
              );

              return (
                <div
                  key={stage}
                  className="bg-surface-container-low rounded-xl border border-outline p-3 flex flex-col gap-3 min-w-[260px]"
                >
                  {/* Stage Header */}
                  <div className="flex items-center justify-between px-1">
                    <span className="font-bold text-xs uppercase tracking-wider text-on-surface">
                      {stage}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface text-on-surface-variant font-bold text-xs border border-outline">
                      {stageSubs.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-2.5">
                    {stageSubs.length === 0 ? (
                      <div className="p-4 text-center text-xs text-on-surface-muted border border-dashed border-outline rounded-lg">
                        No contracts in {stage}
                      </div>
                    ) : (
                      stageSubs.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => setSelectedSub(sub)}
                          className="bg-surface p-3.5 rounded-lg border border-outline shadow-xs hover:shadow-md transition cursor-pointer space-y-2 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-primary group-hover:underline">
                              {sub.number}
                            </span>
                            <StatusBadge status={sub.status} size="sm" />
                          </div>
                          <div>
                            <p className="font-semibold text-body-sm text-on-surface truncate">
                              {sub.customerName}
                            </p>
                            <p className="text-xs text-on-surface-variant truncate">
                              {sub.planName}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-outline flex items-center justify-between text-xs">
                            <MoneyText amount={sub.planPrice} className="font-bold" />
                            <span className="text-on-surface-muted capitalize">{sub.cadence}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Slide-over Quick Drawer Preview */}
        <Drawer
          isOpen={!!selectedSub}
          onClose={() => setSelectedSub(null)}
          title={selectedSub ? `Subscription ${selectedSub.number}` : ""}
          subtitle={selectedSub ? `${selectedSub.customerName} · ${selectedSub.planName}` : ""}
          footer={
            <div className="flex gap-2 w-full justify-between items-center">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2 border border-outline rounded-md text-sm font-semibold hover:bg-surface-container"
              >
                Close
              </button>
              {selectedSub && (
                <Link
                  href={`/admin/subscriptions/${selectedSub.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-bold hover:bg-primary-hover shadow-xs"
                >
                  <span>Open Full Record</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          }
        >
          {selectedSub && (
            <div className="space-y-6">
              {/* Snapshot Card */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-body-sm text-on-surface-muted">Lifecycle Status</span>
                  <StatusBadge status={selectedSub.status} size="md" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body-sm text-on-surface-muted">Recurring Rate</span>
                  <MoneyText amount={selectedSub.planPrice} className="text-xl font-bold" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body-sm text-on-surface-muted">Billing Cadence</span>
                  <span className="text-body-sm font-semibold text-on-surface capitalize">
                    {selectedSub.cadence}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body-sm text-on-surface-muted">Next Invoice Date</span>
                  <DateText date={selectedSub.nextInvoiceDate} />
                </div>
              </div>

              {/* Customer Contact */}
              <div className="space-y-2">
                <h4 className="font-bold text-body-md text-on-surface">Customer Organization</h4>
                <div className="p-3 bg-surface border border-outline rounded-lg text-body-sm space-y-1">
                  <p className="font-semibold text-on-surface">{selectedSub.customerName}</p>
                  <p className="text-on-surface-variant">{selectedSub.customerEmail}</p>
                  <p className="text-xs text-on-surface-muted pt-1">
                    Terms: {selectedSub.paymentTerms}
                  </p>
                </div>
              </div>

              {/* Order Lines */}
              <div className="space-y-2">
                <h4 className="font-bold text-body-md text-on-surface">Order Line Items</h4>
                <div className="border border-outline rounded-lg divide-y divide-outline overflow-hidden text-body-sm">
                  {selectedSub.lines.map((line) => (
                    <div key={line.id} className="p-3 bg-surface flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-on-surface">{line.productName}</p>
                        {line.variant && (
                          <span className="text-xs text-primary font-medium">
                            Variant: {line.variant}
                          </span>
                        )}
                        <p className="text-xs text-on-surface-muted">Qty: {line.quantity} × {line.unitPrice}</p>
                      </div>
                      <MoneyText amount={line.subtotal} className="font-bold" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </BackOfficeLayout>
  );
}
