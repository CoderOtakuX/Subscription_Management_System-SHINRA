"use client";

import React, { useState, useEffect } from "react";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { getBillingRuns, triggerManualBillingRun } from "@/lib/services/api";
import { BillingRun } from "@/types/database";
import {
  Zap,
  Calendar,
  History,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
} from "lucide-react";

export default function RunBillingPage() {
  const { toast } = useToast();
  const [runs, setRuns] = useState<BillingRun[]>([]);
  const [loading, setLoading] = useState(true);

  // Run execution simulation state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getBillingRuns();
        setRuns(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRunBilling = async () => {
    setIsConfirmModalOpen(false);
    setIsProcessing(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 400);

    setTimeout(async () => {
      clearInterval(interval);
      setProgress(100);
      try {
        const newRun = await triggerManualBillingRun();
        setRuns([newRun, ...runs]);
        toast("Billing Engine Run Complete", {
          description: `Processed ${newRun.processedSubscriptions} subscriptions. Generated ₹${newRun.totalBilled.toLocaleString("en-IN")} in invoices.`,
          variant: "success",
        });
      } catch (err) {
        toast("Billing Run Error", {
          description: "Execution encountered an error. Please retry.",
          variant: "error",
        });
      } finally {
        setTimeout(() => {
          setIsProcessing(false);
          setProgress(0);
        }, 800);
      }
    }, 2000);
  };

  const columns: Column<BillingRun>[] = [
    {
      header: "Run ID & Mode",
      accessorKey: "runNumber",
      cell: (run) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface font-mono text-xs">{run.runNumber}</span>
          <span className="text-[11px] text-text-muted capitalize">Trigger: {run.trigger}</span>
        </div>
      ),
    },
    {
      header: "Execution Time",
      accessorKey: "executedAt",
      cell: (run) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-on-surface">{run.executedAt}</span>
          <span className="text-[11px] text-text-muted">By: {run.executedBy}</span>
        </div>
      ),
    },
    {
      header: "Processed Contracts",
      accessorKey: "processedSubscriptions",
      cell: (run) => (
        <span className="text-xs font-semibold text-on-surface">
          {run.processedSubscriptions} contracts
        </span>
      ),
    },
    {
      header: "Invoices Generated",
      accessorKey: "invoicesGenerated",
      cell: (run) => (
        <span className="text-xs font-medium text-secondary">
          {run.invoicesGenerated} invoices
        </span>
      ),
    },
    {
      header: "Success Rate",
      accessorKey: "succeeded",
      cell: (run) => {
        const rate = ((run.succeeded / run.processedSubscriptions) * 100).toFixed(1);
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{rate}%</span>
          </div>
        );
      },
    },
    {
      header: "Total Billed",
      accessorKey: "totalBilled",
      className: "text-right",
      cell: (run) => (
        <div className="text-right">
          <MoneyText amount={run.totalBilled} className="font-bold text-on-surface text-sm" />
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (run) => <StatusBadge status={run.status} />,
    },
  ];

  return (
    <BackOfficeLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Run Recurring Billing"
          badge={isProcessing ? "Engine Running" : "Engine Idle"}
          subtitle="Automated execution engine for recurring invoice generation, subscription renewals, and mandate charge triggers."
          breadcrumbs={[
            { label: "Billing" },
            { label: "Run Billing", href: "/admin/run-billing" },
          ]}
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  toast("Billing Rules Config", {
                    description: "Rules drawer is locked to master billing cycle (00:00 IST).",
                    variant: "info",
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-outline hover:bg-surface-container text-on-surface text-sm font-medium transition-colors shadow-xs"
              >
                <Sliders className="w-4 h-4 text-text-muted" />
                <span>Billing Rules</span>
              </button>
            </div>
          }
        />

        {/* Hero Execution Trigger Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-surface border border-outline shadow-sm p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex flex-col gap-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
                    Scheduled Engine Queue
                  </span>
                  <h2 className="text-lg font-bold text-on-surface">
                    Scheduled Billing Execution for Today
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container border border-outline/50 flex flex-col justify-between">
                  <span className="text-xs text-text-muted font-medium">Subscriptions Due Today</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-primary">248</span>
                    <span className="text-xs text-text-muted">active contracts</span>
                  </div>
                  <span className="text-[11px] text-secondary font-medium mt-2">
                    ✓ All regional tenant profiles verified
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface-container border border-outline/50 flex flex-col justify-between">
                  <span className="text-xs text-text-muted font-medium">Target Cycle & Estimated Total</span>
                  <div className="mt-1">
                    <MoneyText amount={18432000} className="text-2xl font-extrabold text-on-surface" />
                    <span className="text-[11px] text-text-muted block mt-0.5">
                      Cycle: Oct 2026 · UPI, eNACH & Card Mandates
                    </span>
                  </div>
                  <span className="text-[11px] text-secondary font-medium mt-2">
                    ✓ Payment gateway velocity limits OK
                  </span>
                </div>
              </div>
            </div>

            {/* Run Trigger CTA */}
            <div className="flex flex-col sm:w-80 gap-3 shrink-0">
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={isProcessing}
                className="group relative inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-plum-hover transition-all duration-200 shadow-md active:scale-[0.99] disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 transition-transform group-hover:scale-110 ${isProcessing ? "animate-spin" : ""}`} />
                <span>{isProcessing ? "Executing Billing Run..." : "⚡ Run Billing Now"}</span>
              </button>

              <p className="text-xs text-text-muted text-center sm:text-left leading-relaxed">
                Trigger batch invoice generation, legal GST e-invoicing seals, and auto-charge triggers for all 248 contracts.
              </p>

              <div className="p-3 rounded-lg bg-surface-container border border-outline/50 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span className="text-[11px] text-on-surface-variant leading-tight">
                  Idempotent safety lock enabled. Run operations are safe against multi-clicks.
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar simulation */}
          {isProcessing && (
            <div className="mt-6 pt-6 border-t border-outline">
              <div className="flex items-center justify-between text-xs font-semibold text-primary mb-2">
                <span>Generating invoices & dispatching UPI auto-debits...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Execution History Table */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-on-surface">Execution Audit Ledger</h3>
              <p className="text-xs text-text-muted mt-0.5">
                History of automated cron runs and manual trigger cycles.
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={runs}
            loading={loading}
            keyExtractor={(r) => r.id}
            pageSize={10}
            emptyTitle="No billing runs recorded"
            emptyDescription="Execute your first recurring billing run using the button above."
          />
        </div>

        {/* Confirmation Modal */}
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Confirm Immediate Billing Run Execution"
          description="Are you sure you want to trigger the billing engine? This will generate tax invoices and initiate direct debits across 248 active customer subscriptions."
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-container space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">Target Subscriptions</span>
                <span className="font-semibold text-on-surface">248 Contracts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Estimated Billing Volume</span>
                <MoneyText amount={18432000} className="font-semibold text-primary" />
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Payment Channels</span>
                <span className="font-semibold text-on-surface">Razorpay UPI AutoPay, eNACH, Cards</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Legal Compliance</span>
                <span className="font-semibold text-secondary">Indian GST e-Invoicing QR active</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunBilling}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white hover:bg-plum-hover text-xs font-semibold transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Confirm & Execute Run</span>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </BackOfficeLayout>
  );
}
