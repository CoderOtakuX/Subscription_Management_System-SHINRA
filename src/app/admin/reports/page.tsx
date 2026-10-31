"use client";

import React, { useState, useEffect } from "react";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { getInvoices, getCustomers, getAgingReport } from "@/lib/services/api";
import { Invoice, Customer, AgingBucket } from "@/types/database";
import {
  FileText,
  Download,
  Send,
  Zap,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Filter,
  Layers,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function ReportsPage() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [agingBuckets, setAgingBuckets] = useState<AgingBucket[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [period, setPeriod] = useState("Last 90 Days");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);

  // Dunning Sweep state
  const [isDunningModalOpen, setIsDunningModalOpen] = useState(false);
  const [runningSweep, setRunningSweep] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [invData, agingData] = await Promise.all([
          getInvoices(),
          getAgingReport(),
        ]);
        setInvoices(invData);
        setAgingBuckets(agingData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter open / overdue invoices
  const overdueInvoices = invoices.filter(
    (inv) => inv.status === "Overdue" || inv.status === "Outstanding"
  );

  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const handleRunDunningSweep = async () => {
    setRunningSweep(true);
    setTimeout(() => {
      setRunningSweep(false);
      setIsDunningModalOpen(false);
      toast("Dunning Sweep Dispatched", {
        description: `Automated payment reminders sent to 4 delinquent accounts via WhatsApp & Email.`,
        variant: "success",
      });
    }, 1200);
  };

  return (
    <BackOfficeLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Financial & Billing Reports"
          badge="Audit & Ledger v2.4"
          subtitle="Comprehensive revenue analytics, receivables aging, and settlement velocity."
          breadcrumbs={[
            { label: "Analytics" },
            { label: "Reports", href: "/admin/reports" },
          ]}
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  toast("Aging Schedule Exported", {
                    description: "Financial aging schedule exported as PDF document.",
                    variant: "info",
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-outline hover:bg-surface-container text-on-surface text-sm font-medium transition-colors shadow-xs"
              >
                <Download className="w-4 h-4 text-text-muted" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setIsDunningModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary-hover text-sm font-semibold transition-all shadow-xs"
              >
                <Zap className="w-4 h-4" />
                <span>Run Auto-Dunning Sweep</span>
              </button>
            </div>
          }
        />

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-xl bg-surface border border-outline shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-surface-container border border-outline/50">
              <Calendar className="w-4 h-4 text-secondary shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-text-muted font-medium">Billing Period</span>
                <span className="text-xs font-semibold text-on-surface truncate">
                  Last 90 Days (Q4 FY26)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-surface-container border border-outline/50">
              <Layers className="w-4 h-4 text-text-muted shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-text-muted font-medium">Subscription Plan</span>
                <span className="text-xs font-semibold text-on-surface truncate">
                  All Cadences & Tiers
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-surface-container border border-outline/50">
              <Filter className="w-4 h-4 text-text-muted shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-text-muted font-medium">Account Scope</span>
                <span className="text-xs font-semibold text-on-surface truncate">
                  All Active Tenants
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-surface-container border border-outline/50">
              <AlertCircle className="w-4 h-4 text-badge-overdue-text shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-text-muted font-medium">Total Delinquent Exposure</span>
                <MoneyText amount={totalOverdue} className="text-xs font-bold text-badge-overdue-text truncate" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Visual Section: Aging Buckets & Dunning Health */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Receivables Aging Distribution (8 Cols) */}
          <div className="lg:col-span-8 bg-surface border border-outline rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-on-surface">
                    Receivables Aging Distribution
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-badge-overdue-bg text-badge-overdue-text text-xs font-semibold">
                    Net-Due Calculated
                  </span>
                </div>
                <span className="text-xs text-text-muted font-medium">
                  {overdueInvoices.length} Delinquent Claims
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Open claims categorized across chronological settlement windows in accordance with Indian GAAP & GST regulations.
              </p>

              {/* 3 Visual Bucket Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                {/* Bucket 1: 1-7 Days */}
                <div
                  onClick={() => setSelectedBucket(selectedBucket === "1-7" ? null : "1-7")}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedBucket === "1-7"
                      ? "ring-2 ring-amber-500 bg-amber-500/10 border-amber-500"
                      : "bg-badge-outstanding-bg/30 border-amber-200/50 hover:bg-badge-outstanding-bg/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-700">1 – 7 Days Due</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <MoneyText amount={425000} className="text-xl font-bold text-on-surface" />
                  <span className="text-[11px] text-text-muted block mt-1">2 invoices · First dunning level</span>
                </div>

                {/* Bucket 2: 8-30 Days */}
                <div
                  onClick={() => setSelectedBucket(selectedBucket === "8-30" ? null : "8-30")}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedBucket === "8-30"
                      ? "ring-2 ring-orange-500 bg-orange-500/10 border-orange-500"
                      : "bg-orange-50/50 border-orange-200/50 hover:bg-orange-100/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-orange-700">8 – 30 Days Due</span>
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <MoneyText amount={283554} className="text-xl font-bold text-on-surface" />
                  <span className="text-[11px] text-text-muted block mt-1">1 invoice · Second escalation</span>
                </div>

                {/* Bucket 3: 30+ Days */}
                <div
                  onClick={() => setSelectedBucket(selectedBucket === "30+" ? null : "30+")}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedBucket === "30+"
                      ? "ring-2 ring-badge-overdue-text bg-badge-overdue-bg border-badge-overdue-text"
                      : "bg-badge-overdue-bg/40 border-rose-200/50 hover:bg-badge-overdue-bg/70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-badge-overdue-text">30+ Days Critical</span>
                    <ShieldAlert className="w-4 h-4 text-badge-overdue-text" />
                  </div>
                  <MoneyText amount={120000} className="text-xl font-bold text-on-surface" />
                  <span className="text-[11px] text-text-muted block mt-1">1 invoice · Legal notice pending</span>
                </div>
              </div>
            </div>

            {/* Distribution Bar */}
            <div className="pt-4 border-t border-outline">
              <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                <span>Exposure Weighting</span>
                <span className="font-semibold text-on-surface">
                  <MoneyText amount={totalOverdue} /> Total Outstanding
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-container flex overflow-hidden">
                <div style={{ width: "52%" }} className="bg-amber-400" title="1-7 Days (52%)"></div>
                <div style={{ width: "34%" }} className="bg-orange-400" title="8-30 Days (34%)"></div>
                <div style={{ width: "14%" }} className="bg-rose-500" title="30+ Days (14%)"></div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> 1-7 Days (52%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span> 8-30 Days (34%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> 30+ Days (14%)
                </span>
              </div>
            </div>
          </div>

          {/* Dunning Health & Automation (4 Cols) */}
          <div className="lg:col-span-4 bg-surface border border-outline rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-base text-on-surface">Dunning Health</h3>
                <span className="w-7 h-7 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
                  <Zap className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Automated multi-channel dunning recovering 88.4% of delinquent subscriptions before service suspension.
              </p>

              <div className="my-5 p-4 rounded-xl bg-surface-container border border-outline/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">Recovery Rate</span>
                  <span className="text-lg font-bold text-secondary">88.4%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">Avg Settlement Lag</span>
                  <span className="text-xs font-semibold text-on-surface">4.2 Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">WhatsApp Read Rate</span>
                  <span className="text-xs font-semibold text-on-surface">94.8%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setIsDunningModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white hover:bg-plum-hover font-semibold text-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Trigger Batch Reminder Notice</span>
              </button>
              <p className="text-[11px] text-text-muted text-center">
                Next automated cron sweep scheduled at 18:00 IST.
              </p>
            </div>
          </div>
        </div>

        {/* Aging Breakdown Ledger Table */}
        <div className="bg-surface border border-outline rounded-xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-outline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-base text-on-surface">Aging Breakdown Ledger</h3>
              <p className="text-xs text-text-muted mt-0.5">
                Itemized receivable line items requiring credit review or billing collection intervention.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  toast("Schedule PDF Ready", {
                    description: "Full aging schedule ready for download.",
                    variant: "info",
                  });
                }}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface text-xs font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-text-muted" />
                <span>Aging Schedule PDF</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-outline">
                <tr>
                  <th className="py-3 px-4">Invoice Number</th>
                  <th className="py-3 px-4">Customer Account</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Aging Window</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4">Dunning Stage</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {overdueInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-primary">
                      {inv.number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-on-surface">{inv.customerName}</div>
                      <div className="text-[11px] text-text-muted">GSTIN: 27AABCT3421A1Z8</div>
                    </td>
                    <td className="py-3 px-4">
                      <DateText date={inv.dueDate} className="text-text-muted" />
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-badge-overdue-bg text-badge-overdue-text">
                        <Clock className="w-3 h-3" />
                        14 Days Overdue
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <MoneyText amount={inv.totalAmount} className="font-semibold text-on-surface" />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-text-muted">Notice #2 Dispatched</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          toast("Reminder Dispatched", {
                            description: `Instant WhatsApp reminder sent to ${inv.customerName}.`,
                            variant: "success",
                          });
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary-container text-primary hover:bg-primary/20 text-xs font-semibold transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Notice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dunning Sweep Confirmation Modal */}
        <Modal
          isOpen={isDunningModalOpen}
          onClose={() => setIsDunningModalOpen(false)}
          title="Run Automated Dunning Sweep"
          description="This process scans all delinquent and overdue invoices, generates Indian GST payment links via UPI / Razorpay, and dispatches multi-channel alerts (SMS, WhatsApp, Email)."
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-container space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">Eligible Delinquent Accounts</span>
                <span className="font-semibold text-on-surface">4 Accounts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Total Outstanding Exposure</span>
                <MoneyText amount={totalOverdue} className="font-semibold text-badge-overdue-text" />
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Channels Used</span>
                <span className="font-semibold text-on-surface">WhatsApp Business, SMS & Email</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline">
              <button
                type="button"
                onClick={() => setIsDunningModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunDunningSweep}
                disabled={runningSweep}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary-hover text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>{runningSweep ? "Dispatching Sweep..." : "Confirm & Run Sweep"}</span>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </BackOfficeLayout>
  );
}
