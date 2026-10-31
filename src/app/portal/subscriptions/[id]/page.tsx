"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PortalLayout } from "@/components/layouts/portal-layout";
import { Stepper, Step } from "@/components/ui/stepper";
import { StatusBadge } from "@/components/ui/status-badge";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { getSubscriptionById, getInvoices } from "@/lib/services/api";
import { Subscription, Invoice } from "@/types/database";
import {
  ArrowLeft,
  Calendar,
  Layers,
  PauseCircle,
  RefreshCw,
  CheckCircle2,
  FileText,
  ShieldCheck,
  CreditCard,
  Download,
} from "lucide-react";

const SUB_STEPS: Step[] = [
  { id: "Draft", label: "Draft Proposal", description: "Created" },
  { id: "Quotation", label: "Quotation Sent", description: "Sent to client" },
  { id: "Confirmed", label: "Confirmed Terms", description: "Agreed terms" },
  { id: "Active", label: "Active Recurring", description: "Invoicing live" },
  { id: "Closed", label: "Closed / Terminated", description: "Completed" },
];

export default function PortalSubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const subId = params.id as string;

  const [sub, setSub] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Pause Modal
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [subData, invData] = await Promise.all([
          getSubscriptionById(subId),
          getInvoices(),
        ]);
        if (subData) {
          setSub(subData);
          setInvoices(invData.filter((i) => i.subscriptionId === subData.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [subId]);

  if (loading) {
    return (
      <PortalLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-sm text-text-muted">
          Loading subscription details...
        </div>
      </PortalLayout>
    );
  }

  if (!sub) {
    return (
      <PortalLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-xl font-bold text-on-surface">Subscription Not Found</h2>
          <p className="text-sm text-text-muted mt-2">The requested contract could not be located.</p>
          <Link
            href="/portal/subscriptions"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Subscriptions</span>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Breadcrumbs & Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/portal/subscriptions"
              className="p-2 rounded-lg border border-outline hover:bg-surface-container text-on-surface transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-text-muted">
                  {sub.subscriptionNumber}
                </span>
                <StatusBadge status={sub.status} />
              </div>
              <h1 className="text-2xl font-bold text-on-surface">{sub.planName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPauseModalOpen(true)}
              className="px-3.5 py-2 rounded-lg border border-outline hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors inline-flex items-center gap-1.5"
            >
              <PauseCircle className="w-4 h-4 text-amber-600" />
              <span>Pause Plan</span>
            </button>
            <button
              onClick={() => {
                toast("Upgrade Request Logged", {
                  description: "Your account manager will contact you within 2 business hours.",
                  variant: "success",
                });
              }}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-plum-hover text-xs font-semibold transition-colors"
            >
              Request Plan Upgrade
            </button>
          </div>
        </div>

        {/* 5-Step Lifecycle Stepper */}
        <div className="bg-surface border border-outline rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-4">
            Contract Lifecycle Status
          </span>
          <Stepper steps={SUB_STEPS} currentStep={sub.status} />
        </div>

        {/* Contract Key Commercial Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface border border-outline shadow-xs">
            <span className="text-xs text-text-muted font-medium block">Cadence & Cycle</span>
            <span className="text-lg font-bold text-on-surface capitalize mt-1 block">
              {sub.planCadence} Plan
            </span>
            <span className="text-[11px] text-text-muted mt-0.5 block">
              Terms: {sub.paymentTerms}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-outline shadow-xs">
            <span className="text-xs text-text-muted font-medium block">Start Date</span>
            <span className="text-lg font-bold text-on-surface mt-1 block">
              <DateText date={sub.startDate} />
            </span>
            <span className="text-[11px] text-secondary font-medium mt-0.5 block">
              ✓ Legally active
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-outline shadow-xs">
            <span className="text-xs text-text-muted font-medium block">Next Renewal</span>
            <span className="text-lg font-bold text-on-surface mt-1 block">
              <DateText date={sub.nextBillingDate} />
            </span>
            <span className="text-[11px] text-text-muted mt-0.5 block">
              Auto-charge via UPI
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-outline shadow-xs">
            <span className="text-xs text-text-muted font-medium block">Recurring Amount</span>
            <MoneyText amount={sub.recurringTotal} className="text-2xl font-extrabold text-primary mt-1" />
            <span className="text-[11px] text-text-muted mt-0.5 block">
              Includes 18% GST
            </span>
          </div>
        </div>

        {/* Commercial Line Items Table */}
        <div className="bg-surface border border-outline rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-outline">
            <h3 className="font-bold text-base text-on-surface">Contract Line Items & Add-ons</h3>
            <p className="text-xs text-text-muted mt-0.5">
              Itemized software licenses, brand variants, and add-on seats.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-outline">
                <tr>
                  <th className="py-3 px-4">Item & Variant</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-center">Tax Slab</th>
                  <th className="py-3 px-4 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {sub.lines.map((line) => (
                  <tr key={line.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-on-surface">{line.productName}</div>
                      {line.variantName && (
                        <div className="text-xs text-primary font-medium">
                          Variant: {line.variantName}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-on-surface">
                      {line.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <MoneyText amount={line.unitPrice} className="text-text-muted" />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-surface-container font-mono text-on-surface">
                        {line.taxRate}% GST
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <MoneyText amount={line.lineTotal} className="font-bold text-on-surface" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Linked Invoices */}
        <div className="bg-surface border border-outline rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-outline flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-on-surface">Linked Invoices</h3>
              <p className="text-xs text-text-muted mt-0.5">
                Tax invoices generated under this subscription agreement.
              </p>
            </div>
          </div>

          <div className="divide-y divide-outline">
            {invoices.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted">
                No past invoices generated for this subscription contract yet.
              </div>
            ) : (
              invoices.map((inv) => (
                <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-surface-container/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <span className="font-mono text-xs font-bold text-primary">{inv.number}</span>
                      <span className="text-xs text-text-muted block">
                        Billed: <DateText date={inv.invoiceDate} />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <MoneyText amount={inv.totalAmount} className="font-bold text-on-surface text-sm" />
                    <StatusBadge status={inv.status} />
                    <Link
                      href={`/portal/invoices/${inv.id}`}
                      className="px-3 py-1.5 rounded-lg border border-outline text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                    >
                      View Invoice
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pause Modal */}
        <Modal
          isOpen={isPauseModalOpen}
          onClose={() => setIsPauseModalOpen(false)}
          title="Pause Subscription"
          description="Temporarily freeze recurring billing cycles for this contract."
        >
          <div className="space-y-4">
            <p className="text-xs text-text-muted leading-relaxed">
              When paused, you retain your workspace configurations and data. Invoicing will pause until you unpause or until 90 days elapse.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline">
              <button
                type="button"
                onClick={() => setIsPauseModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-outline text-xs font-medium text-on-surface hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPauseModalOpen(false);
                  toast("Subscription Paused", {
                    description: "Contract is temporarily suspended.",
                    variant: "info",
                  });
                }}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 text-xs font-semibold"
              >
                Confirm Pause
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </PortalLayout>
  );
}
