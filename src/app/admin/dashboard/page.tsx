"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable, Column } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/toast";
import {
  getDashboardKpis,
  getRevenueTimeSeries,
  getInvoices,
  getSubscriptions,
} from "@/lib/services/api";
import { Invoice, Subscription, DashboardKpi, RevenueDataPoint } from "@/types/database";
import {
  TrendingUp,
  RefreshCw,
  Wallet,
  AlertTriangle,
  Users,
  Download,
  ArrowRight,
  Zap,
  Mail,
  CreditCard,
} from "lucide-react";

export default function AdminDashboardPage() {
  const toast = useToast();

  const [kpis, setKpis] = useState<DashboardKpi[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [kpiRes, revRes, invRes, subRes] = await Promise.all([
          getDashboardKpis(),
          getRevenueTimeSeries(),
          getInvoices(),
          getSubscriptions(),
        ]);
        setKpis(kpiRes);
        setRevenueData(revRes);
        setInvoices(invRes);
        setSubscriptions(subRes);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const overdueInvoices = invoices.filter((i) => i.status === "Confirmed");

  const overdueColumns: Column<Invoice>[] = [
    {
      key: "number",
      header: "Invoice #",
      isPrimary: true,
      cell: (inv) => (
        <Link
          href={`/admin/invoices/${inv.id}`}
          className="font-bold text-primary hover:underline"
        >
          {inv.number}
        </Link>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      isPrimary: true,
      cell: (inv) => <span className="font-medium text-on-surface">{inv.customerName}</span>,
    },
    {
      key: "dueDate",
      header: "Due Date",
      cell: (inv) => <DateText date={inv.dueDate} className="text-red-700 font-medium" />,
    },
    {
      key: "amount",
      header: "Amount Due",
      isPrimary: true,
      cell: (inv) => <MoneyText amount={inv.totalAmount} className="font-bold text-on-surface" />,
    },
    {
      key: "status",
      header: "Status",
      cell: () => <StatusBadge status="Overdue" />,
    },
    {
      key: "actions",
      header: "Quick Actions",
      cell: (inv) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toast.success("Reminder Dispatched", `Sent payment reminder for ${inv.number}`);
            }}
            className="p-1.5 text-xs font-semibold rounded bg-surface border border-outline hover:bg-surface-container flex items-center gap-1 text-on-surface"
            title="Send Email Reminder"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remind</span>
          </button>
          <Link
            href={`/admin/invoices/${inv.id}`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-xs font-semibold rounded bg-primary text-on-primary hover:bg-primary-hover flex items-center gap-1"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settle</span>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <BackOfficeLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Revenue & Billing Health"
          subtitle={
            <span className="flex items-center gap-2">
              Financial Overview & Receivables Ledger ·{" "}
              <span className="font-caveat text-secondary text-lg font-bold -rotate-1">
                reconciled 4m ago ✨
              </span>
            </span>
          }
          badge={
            <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-primary text-xs font-bold uppercase tracking-wider">
              Q1 2026 Fiscal Run
            </span>
          }
          actions={
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => toast.info("Data refreshed from billing engine")}
                className="p-2.5 rounded-md bg-surface border border-outline hover:bg-surface-container text-on-surface-variant min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
                title="Refresh Metrics"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toast.success("Export Complete", "Exported ledger CSV.")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-surface border border-outline hover:bg-surface-container text-on-surface font-semibold text-body-sm shadow-xs min-h-[44px]"
              >
                <Download className="w-4 h-4 text-on-surface-variant" />
                <span>Export CSV</span>
              </button>
              <Link
                href="/admin/subscriptions/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-on-primary hover:bg-primary-hover font-bold text-body-sm shadow-xs min-h-[44px]"
              >
                <span>+ New Contract</span>
              </Link>
            </div>
          }
        />

        {/* 5 KPI Cards Grid (Mobile 1 col, md 2 col, xl 5 col) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <KpiCard
            title="Active Subscriptions"
            value="1,428"
            subtitle="+34 this month"
            change={{ value: "+2.4%", positive: true }}
            icon={<RefreshCw className="w-4 h-4 text-primary" />}
          />
          <KpiCard
            title="Monthly Run-rate (MRR)"
            value={<MoneyText amount={8640000} />}
            subtitle="vs. ₹76.5L last quarter"
            change={{ value: "+14.2%", positive: true }}
            icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
          />
          <KpiCard
            title="Annual Run-rate (ARR)"
            value={<MoneyText amount={103680000} />}
            subtitle="Projected 2026 target"
            change={{ value: "+18.5%", positive: true }}
            icon={<Wallet className="w-4 h-4 text-secondary" />}
          />
          <KpiCard
            title="Overdue Receivables"
            value={<MoneyText amount={240300} />}
            subtitle="4 pending accounts"
            change={{ value: "-4.8%", positive: false }}
            icon={<AlertTriangle className="w-4 h-4 text-red-600" />}
          />
          <KpiCard
            title="Customer Churn Rate"
            value="1.6%"
            subtitle="Benchmark < 2.0%"
            change={{ value: "0.0%", neutral: true }}
            icon={<Users className="w-4 h-4 text-on-surface-variant" />}
          />
        </div>

        {/* Charts & Engine Status Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Bar / Trend Visualizer */}
          <div className="lg:col-span-8 bg-surface rounded-xl border border-outline p-6 shadow-xs flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-outline">
              <div>
                <h3 className="text-title-lg font-bold text-on-surface">
                  Monthly Revenue Realization (INR)
                </h3>
                <p className="text-body-sm text-on-surface-muted">
                  Actual collected revenue vs. forecast target across the last 6 fiscal months.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="w-3 h-3 rounded bg-primary inline-block" /> Realized Revenue
                </span>
                <span className="flex items-center gap-1.5 text-on-surface-muted">
                  <span className="w-3 h-3 rounded bg-surface-container-high inline-block" /> Target
                </span>
              </div>
            </div>

            {/* Simple Elegant SVG / CSS Bar Chart */}
            <div className="pt-6 pb-2 space-y-4">
              <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 sm:h-56 border-b border-outline px-2">
                {revenueData.map((d) => {
                  const maxVal = 10000000;
                  const revHeight = Math.round((d.revenue / maxVal) * 100);
                  const targetHeight = Math.round((d.target / maxVal) * 100);

                  return (
                    <div key={d.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        {/* Target Bar */}
                        <div
                          style={{ height: `${targetHeight}%` }}
                          className="w-1/3 bg-surface-container rounded-t transition-all group-hover:bg-surface-container-high"
                          title={`Target: ${d.target}`}
                        />
                        {/* Realized Bar */}
                        <div
                          style={{ height: `${revHeight}%` }}
                          className="w-1/2 bg-primary rounded-t transition-all group-hover:bg-primary-hover shadow-xs relative"
                          title={`Realized: ${d.revenue}`}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-on-surface-variant truncate w-full text-center">
                        {d.month.split(" ")[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-body-sm text-on-surface-muted">
              <span>Total Q1 Realized: ₹2,51,60,000</span>
              <span className="font-caveat text-secondary text-base font-bold">
                108% of fiscal quota achieved! 🚀
              </span>
            </div>
          </div>

          {/* Right: Quick Actions & Billing Engine Trigger Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Recurring Billing Engine Status Tile */}
            <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-container text-primary flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-on-surface">Billing Engine</h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  Scheduled
                </span>
              </div>

              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Next automated cron sweep runs tonight at midnight. 1,428 active contracts will be evaluated for invoice generation.
              </p>

              <div className="p-3 bg-surface-container-low rounded-lg border border-outline text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-on-surface-muted">Last Execution:</span>
                  <span className="font-semibold text-on-surface">Today, 00:05 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-muted">Success Rate:</span>
                  <span className="font-semibold text-emerald-700">98.2% (1,395 invoices)</span>
                </div>
              </div>

              <Link
                href="/admin/run-billing"
                className="w-full py-2.5 px-4 rounded-md bg-secondary text-on-secondary hover:bg-secondary-hover font-semibold text-body-sm flex items-center justify-center gap-2 transition min-h-[44px]"
              >
                <span>Manage Billing Runs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Subscription Lifecycle Distribution */}
            <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-3">
              <h4 className="font-bold text-on-surface text-body-md">
                Contract Status Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="flex items-center gap-2">
                    <StatusBadge status="Active" size="sm" /> Active Contracts
                  </span>
                  <span className="font-bold text-on-surface">1,428</span>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="flex items-center gap-2">
                    <StatusBadge status="Quotation" size="sm" /> Pending Quotes
                  </span>
                  <span className="font-bold text-on-surface">124</span>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="flex items-center gap-2">
                    <StatusBadge status="Confirmed" size="sm" /> Confirmed / Locked
                  </span>
                  <span className="font-bold text-on-surface">88</span>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="flex items-center gap-2">
                    <StatusBadge status="Draft" size="sm" /> Draft Pipeline
                  </span>
                  <span className="font-bold text-on-surface">42</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Receivables Ledger Section */}
        <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-title-lg font-bold text-on-surface flex items-center gap-2">
                <span>Overdue Invoices Requiring Dunning Attention</span>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                  {overdueInvoices.length} Due
                </span>
              </h3>
              <p className="text-body-sm text-on-surface-muted">
                Accounts that have passed the standard Net payment terms.
              </p>
            </div>
            <Link
              href="/admin/reports"
              className="text-body-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View Full Aging Breakdown</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <DataTable
            columns={overdueColumns}
            data={overdueInvoices}
            keyExtractor={(i) => i.id}
            isLoading={isLoading}
            pageSize={5}
          />
        </div>
      </div>
    </BackOfficeLayout>
  );
}
