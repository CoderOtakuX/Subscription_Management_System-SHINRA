"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Stepper } from "@/components/ui/stepper";
import { StatusBadge, BadgeStatus } from "@/components/ui/status-badge";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { getSubscriptionById, updateSubscriptionStatus, getInvoices } from "@/lib/services/api";
import { Subscription, Invoice } from "@/types/database";
import {
  RefreshCw,
  Pause,
  Mail,
  Printer,
  XCircle,
  Building2,
  Calendar,
  CreditCard,
  Receipt,
  FileCheck,
  ChevronRight,
  ArrowLeft,
  Zap,
} from "lucide-react";

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const id = params?.id as string;

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const subData = await getSubscriptionById(id);
        const invData = await getInvoices();
        setSubscription(subData);
        setInvoices(invData.filter((i) => i.subscriptionId === subData?.id));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <BackOfficeLayout>
        <div className="max-w-5xl mx-auto py-12 space-y-4">
          <div className="h-8 bg-surface-container rounded w-1/3 animate-pulse" />
          <div className="h-32 bg-surface rounded-xl border border-outline animate-pulse" />
          <div className="h-64 bg-surface rounded-xl border border-outline animate-pulse" />
        </div>
      </BackOfficeLayout>
    );
  }

  if (!subscription) {
    return (
      <BackOfficeLayout>
        <div className="max-w-md mx-auto my-16 text-center space-y-4 p-8 bg-surface border border-outline rounded-xl">
          <h2 className="text-xl font-bold">Subscription Not Found</h2>
          <p className="text-body-sm text-on-surface-variant">
            Could not find subscription record matching ID &quot;{id}&quot;.
          </p>
          <Link
            href="/admin/subscriptions"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-md font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Subscriptions</span>
          </Link>
        </div>
      </BackOfficeLayout>
    );
  }

  const handleStepTransition = async (newStage: string) => {
    // TODO(service): Update subscription status via Supabase
    const updated = await updateSubscriptionStatus(subscription.id, newStage as any);
    if (updated) {
      setSubscription({ ...updated });
      toast.success("Stage Updated", `Subscription moved to ${newStage}`);
    }
  };

  const handleCancel = async () => {
    await updateSubscriptionStatus(subscription.id, "Closed");
    setSubscription({ ...subscription, status: "Closed" });
    setIsCancelModalOpen(false);
    toast.warning("Subscription Cancelled", `${subscription.number} has been moved to Closed.`);
  };

  const calculateSubtotal = () =>
    subscription.lines.reduce((sum, line) => sum + line.subtotal, 0);
  const subtotal = calculateSubtotal();
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const grandTotal = subtotal + tax;

  return (
    <BackOfficeLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <PageHeader
          title={`Subscription ${subscription.number}`}
          subtitle={`Managed for ${subscription.customerName} · Next billing cycle due on ${subscription.nextInvoiceDate}`}
          breadcrumbs={[
            { label: "Subscriptions", href: "/admin/subscriptions" },
            { label: subscription.number },
          ]}
          badge={<StatusBadge status={subscription.status} size="md" />}
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => toast.success("Contract Renewed", "Extended term by 1 cadence year.")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-primary text-on-primary hover:bg-primary-hover font-semibold text-body-sm shadow-xs min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Renew</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPauseModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-surface border border-outline hover:bg-surface-container text-on-surface font-semibold text-body-sm min-h-[44px]"
              >
                <Pause className="w-4 h-4 text-on-surface-variant" />
                <span>Pause</span>
              </button>
              <button
                type="button"
                onClick={() => toast.success("Dispatched Email", `Sent summary to ${subscription.customerEmail}`)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-surface border border-outline hover:bg-surface-container text-on-surface font-semibold text-body-sm min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-on-surface-variant" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-surface border border-outline hover:bg-surface-container text-on-surface font-semibold text-body-sm min-h-[44px]"
              >
                <Printer className="w-4 h-4 text-on-surface-variant" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-body-sm min-h-[44px]"
              >
                <XCircle className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          }
        />

        {/* 5-Stage Stepper Component */}
        <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Contract Lifecycle Stages
            </span>
            <span className="font-caveat text-secondary text-base font-bold -rotate-1">
              click stage to transition ~
            </span>
          </div>
          <Stepper
            steps={["Draft", "Quotation", "Confirmed", "Active", "Closed"]}
            currentStep={subscription.status}
            onStepClick={(stage) => handleStepTransition(stage)}
          />
        </div>

        {/* Two Column Layout: Customer & Contract Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer & Billing Entity Card */}
          <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-on-surface text-title-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span>Customer Details</span>
            </h3>
            <div className="space-y-3 text-body-sm">
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-semibold">Entity Name</span>
                <p className="font-bold text-on-surface text-base">{subscription.customerName}</p>
              </div>
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-semibold">Billing Contact</span>
                <p className="text-on-surface font-medium">{subscription.customerEmail}</p>
              </div>
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-semibold">Payment Terms</span>
                <p className="text-on-surface font-medium">{subscription.paymentTerms}</p>
              </div>
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-semibold">GSTIN Jurisdiction</span>
                <p className="text-on-surface font-mono font-medium">27AABCN1234F1Z5 (Maharashtra)</p>
              </div>
            </div>
          </div>

          {/* Contract Specifications Card */}
          <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-on-surface text-title-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              <span>Contract Dates</span>
            </h3>
            <div className="space-y-3 text-body-sm">
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-semibold">Start Date</span>
                <p className="font-medium text-on-surface">
                  <DateText date={subscription.startDate} />
                </p>
              </div>
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-semibold">Expiration / End Date</span>
                <p className="font-medium text-on-surface">
                  <DateText date={subscription.endDate} />
                </p>
              </div>
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-semibold">Next Invoice Generation</span>
                <p className="font-bold text-primary">
                  <DateText date={subscription.nextInvoiceDate} />
                </p>
              </div>
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-semibold">Billing Cycle Count</span>
                <p className="text-on-surface font-medium">Cycle #{subscription.billingCycle}</p>
              </div>
            </div>
          </div>

          {/* Commercial Run-rate Value */}
          <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-on-surface text-title-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-600" />
              <span>Commercial Terms</span>
            </h3>
            <div className="space-y-3 text-body-sm">
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-semibold">Plan Cadence</span>
                <p className="font-bold text-on-surface capitalize">{subscription.cadence}</p>
              </div>
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-semibold">Contract Amount</span>
                <div className="text-2xl font-black text-on-surface mt-0.5">
                  <MoneyText amount={subscription.planPrice} />
                </div>
              </div>
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-semibold">Effective Monthly MRR</span>
                <div className="text-lg font-bold text-emerald-700">
                  <MoneyText amount={subscription.mrr} />
                  <span className="text-xs text-on-surface-muted font-normal ml-1">/month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Lines & Commercials Table */}
        <div className="bg-surface rounded-xl border border-outline overflow-hidden shadow-xs">
          <div className="p-5 border-b border-outline bg-surface flex items-center justify-between">
            <h3 className="font-bold text-title-lg text-on-surface">
              Order Lines &amp; Commercials
            </h3>
            <span className="text-xs font-semibold text-on-surface-muted">
              {subscription.lines.length} Line Items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-body-sm">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  <th className="px-4 py-3">Product / Service</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Quantity</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-right">Tax (GST)</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {subscription.lines.map((line) => (
                  <tr key={line.id} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-on-surface">{line.productName}</p>
                      {line.variant && (
                        <span className="text-xs text-primary font-semibold">
                          Variant: {line.variant}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-on-surface-variant max-w-xs">
                      {line.description}
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium">{line.quantity}</td>
                    <td className="px-4 py-3.5 text-right">
                      <MoneyText amount={line.unitPrice} />
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium">{line.taxRate}%</td>
                    <td className="px-4 py-3.5 text-right font-bold text-on-surface">
                      <MoneyText amount={line.subtotal} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals Section */}
          <div className="p-6 bg-surface-container-low border-t border-outline flex flex-col sm:flex-row justify-end items-end gap-2 text-body-sm">
            <div className="w-full sm:w-72 space-y-2">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal (Exclusive):</span>
                <MoneyText amount={subtotal} className="font-semibold" />
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Applicable GST (18%):</span>
                <MoneyText amount={tax} className="font-semibold" />
              </div>
              <div className="pt-2 border-t border-outline flex justify-between text-base font-bold text-on-surface">
                <span>Total Recurring Rate:</span>
                <MoneyText amount={grandTotal} className="text-xl font-black text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Generated Invoices Ledger */}
        <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline">
            <div>
              <h3 className="font-bold text-title-lg text-on-surface">
                Generated Billing Invoices
              </h3>
              <p className="text-xs text-on-surface-muted">
                Invoices spawned from this contract by the recurring billing engine.
              </p>
            </div>
            <Link
              href="/admin/invoices"
              className="text-body-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>All Invoices</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-outline border border-outline rounded-lg overflow-hidden">
            {invoices.length === 0 ? (
              <div className="p-6 text-center text-body-sm text-on-surface-muted">
                No invoices generated for this contract yet. The recurring engine will generate Cycle #1 on the next run date.
              </div>
            ) : (
              invoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/admin/invoices/${inv.id}`}
                  className="p-4 bg-surface hover:bg-surface-container-low transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-primary group-hover:underline">
                        {inv.number}
                      </p>
                      <p className="text-xs text-on-surface-muted">
                        Issue Date: <DateText date={inv.issueDate} /> · Due Date: <DateText date={inv.dueDate} />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <MoneyText amount={inv.totalAmount} className="font-bold text-base" />
                    <StatusBadge status={inv.status} />
                    <ChevronRight className="w-4 h-4 text-on-surface-muted group-hover:text-primary transition" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Status History Timeline */}
        <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline">
            <div>
              <h3 className="font-bold text-title-lg text-on-surface">
                Status History Timeline
              </h3>
              <p className="text-xs text-on-surface-muted">
                Audit trail of lifecycle state transitions and milestones.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-surface-container rounded-full text-on-surface-variant">
              Live Audit Log
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline">
            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20"></span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <p className="text-sm font-bold text-on-surface">Contract Initiated (Draft)</p>
                <span className="text-xs text-on-surface-muted">01 Oct 2026, 09:30 AM · System</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Initial subscription draft created with {subscription.cadence} cadence and recurring price.
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20"></span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <p className="text-sm font-bold text-on-surface">Quotation Generated</p>
                <span className="text-xs text-on-surface-muted">02 Oct 2026, 02:15 PM · Staff Admin</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Quotation sent to {subscription.customerEmail} with 30 days price lock.
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20"></span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <p className="text-sm font-bold text-on-surface">Order Confirmed</p>
                <span className="text-xs text-on-surface-muted">05 Oct 2026, 11:45 AM · Customer Approval</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Customer accepted terms and authorized recurring UPI mandate.
              </p>
            </div>

            {subscription.status === "Active" && (
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-600/20"></span>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="text-sm font-bold text-emerald-800">Activated &amp; Billing Active</p>
                  <span className="text-xs text-on-surface-muted">06 Oct 2026, 10:00 AM · Automated Engine</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Subscription entered Active phase. Cycle #1 scheduled.
                </p>
              </div>
            )}

            {subscription.status === "Closed" && (
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-4 ring-red-600/20"></span>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="text-sm font-bold text-red-700">Contract Terminated / Closed</p>
                  <span className="text-xs text-on-surface-muted">Terminated</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Subscription marked as closed. Recurring billing cancelled.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <ConfirmDialog
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleCancel}
          title="Cancel Subscription Contract?"
          description={`Are you sure you want to cancel subscription ${subscription.number}? Recurring automated billing will cease immediately.`}
          confirmLabel="Yes, Cancel Contract"
          variant="danger"
        />

        <ConfirmDialog
          isOpen={isPauseModalOpen}
          onClose={() => setIsPauseModalOpen(false)}
          onConfirm={() => {
            setIsPauseModalOpen(false);
            toast.info("Subscription paused until next billing cycle resume.");
          }}
          title="Pause Subscription?"
          description={`Temporarily pause ${subscription.number}. Invoices will not be generated during the pause interval.`}
          confirmLabel="Pause Contract"
          variant="warning"
        />
      </div>
    </BackOfficeLayout>
  );
}
