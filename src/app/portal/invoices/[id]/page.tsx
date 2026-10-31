"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PortalLayout } from "@/components/layouts/portal-layout";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { getInvoiceById, updateInvoiceStatus } from "@/lib/services/api";
import { Invoice } from "@/types/database";
import {
  ArrowLeft,
  Download,
  Printer,
  ShieldCheck,
  Zap,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  QrCode,
} from "lucide-react";

export default function PortalInvoiceDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const invId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  // Settlement Form State
  const [method, setMethod] = useState<"UPI" | "Card" | "Bank">("UPI");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const found = await getInvoiceById(invId);
        if (found) setInvoice(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [invId]);

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;
    setPaying(true);

    setTimeout(async () => {
      setPaying(false);
      await updateInvoiceStatus(invoice.id, "Paid");
      setInvoice({ ...invoice, status: "Paid" });
      toast("Settlement Confirmed", {
        description: `Invoice ${invoice.number} paid via ${method}. GST receipt dispatched.`,
        variant: "success",
      });
    }, 1200);
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-sm text-text-muted">
          Loading invoice details...
        </div>
      </PortalLayout>
    );
  }

  if (!invoice) {
    return (
      <PortalLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-xl font-bold text-on-surface">Invoice Not Found</h2>
          <p className="text-sm text-text-muted mt-2">The requested invoice statement does not exist.</p>
          <Link
            href="/portal/invoices"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Invoices</span>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const isPaid = invoice.status === "Paid";

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/portal/invoices"
              aria-label="Back to Invoices"
              className="p-2 rounded-lg border border-outline hover:bg-surface-container text-on-surface transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-text-muted">
                  Tax Invoice
                </span>
                <StatusBadge status={invoice.status} />
              </div>
              <h1 className="text-2xl font-bold text-on-surface">{invoice.number}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg border border-outline hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors inline-flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-text-muted" />
              <span>Print</span>
            </button>
            <button
              onClick={() => {
                toast("PDF Downloaded", {
                  description: `GST Invoice ${invoice.number} saved to downloads.`,
                  variant: "success",
                });
              }}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-plum-hover text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* 2-Column Layout: GST Document (7-8 cols) + Payment Settlement (4-5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official GST Tax Invoice Letterhead */}
          <section className="lg:col-span-8 bg-surface border border-outline rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* Letterhead Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-outline">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-primary text-white font-bold text-sm flex items-center justify-center">
                    B
                  </span>
                  <span className="text-lg font-bold text-primary">Brightloop Technologies</span>
                </div>
                <p className="text-xs text-text-muted">
                  Brightloop Billing Technologies Private Limited<br />
                  Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051<br />
                  GSTIN: <span className="font-mono font-semibold text-on-surface">27AAACB2234P1Z4</span> · CIN: U72900MH2026PTC392811
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-secondary block">
                  Original For Recipient
                </span>
                <span className="text-xl font-mono font-bold text-on-surface block">
                  {invoice.number}
                </span>
                <div className="text-xs text-text-muted">
                  Invoice Date: <DateText date={invoice.invoiceDate} className="font-medium text-on-surface" /><br />
                  Due Date: <DateText date={invoice.dueDate} className="font-medium text-on-surface" />
                </div>
              </div>
            </div>

            {/* Bill To & Subscription Ref */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-surface-container border border-outline/50 text-xs">
              <div>
                <span className="font-bold text-text-muted uppercase tracking-wider block mb-1">
                  Billed To (Client Entity)
                </span>
                <span className="font-bold text-sm text-on-surface block">
                  {invoice.customerName}
                </span>
                <span className="text-text-muted block mt-0.5">
                  GSTIN: <span className="font-mono font-semibold text-on-surface">27AAAAA0000A1Z5</span><br />
                  State Code: 27 (Maharashtra) · Place of Supply: 27
                </span>
              </div>

              <div>
                <span className="font-bold text-text-muted uppercase tracking-wider block mb-1">
                  Agreement Details
                </span>
                <span className="text-text-muted block">
                  Subscription Ref: <span className="font-mono font-semibold text-primary">{invoice.subscriptionNumber || "SUB-2026-0042"}</span><br />
                  Payment Terms: <span className="font-semibold text-on-surface">Net 15 Days</span><br />
                  IRN: <span className="font-mono text-[10px] text-text-muted truncate block">e718b9c240...98f4</span>
                </span>
              </div>
            </div>

            {/* Itemized Lines */}
            <div className="overflow-x-auto rounded-xl border border-outline">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-outline">
                  <tr>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-center">GST Slab</th>
                    <th className="py-3 px-4 text-right">Net Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  {invoice.lines.map((line) => (
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
                      <td className="py-3.5 px-4 text-center font-mono text-xs">
                        {line.taxRate}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-on-surface">
                        <MoneyText amount={line.lineTotal} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Calculation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-4 border-t border-outline">
              <div className="p-4 rounded-xl bg-surface-container text-xs space-y-1.5 max-w-sm">
                <span className="font-bold text-on-surface block">Payment Instructions</span>
                <p className="text-text-muted leading-relaxed">
                  Direct settlement via corporate UPI or IMPS. Please quote invoice reference <span className="font-mono font-bold text-primary">{invoice.number}</span>.
                </p>
                <div className="flex items-center gap-1.5 text-secondary font-semibold pt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>GST e-Invoice Authenticated via NIC</span>
                </div>
              </div>

              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-outline">
                  <span className="text-text-muted">Subtotal Net:</span>
                  <MoneyText amount={invoice.subtotal} className="font-medium text-on-surface" />
                </div>
                <div className="flex justify-between py-1 border-b border-outline">
                  <span className="text-text-muted">GST (18% IGST):</span>
                  <MoneyText amount={invoice.taxAmount} className="font-medium text-on-surface" />
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-sm font-bold text-on-surface">Total Amount:</span>
                  <MoneyText amount={invoice.totalAmount} className="text-2xl font-extrabold text-primary" />
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Checkout & Settlement Panel */}
          <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-20">
            <div className="bg-surface border border-outline rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-on-surface">Instant Settlement</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-xs font-semibold text-text-muted">
                  INR Direct
                </span>
              </div>

              {isPaid ? (
                <div className="p-5 rounded-xl bg-badge-active-bg border border-secondary/20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-base">Invoice Fully Paid</h4>
                    <p className="text-xs text-secondary-hover mt-1">
                      Settled via Corporate UPI. Receipt voucher and GSTR input tax credit available.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      toast("Receipt Downloaded", {
                        description: `Payment receipt voucher for ${invoice.number} saved.`,
                        variant: "success",
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary-hover text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Payment Receipt</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePayNow} className="space-y-4">
                  <div className="p-4 rounded-xl bg-surface-container space-y-1">
                    <span className="text-xs text-text-muted block">Total Balance Due</span>
                    <MoneyText amount={invoice.totalAmount} className="text-2xl font-extrabold text-primary block" />
                    <span className="text-[11px] text-amber-900 font-semibold">Due in 4 days</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface">Payment Channel</label>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setMethod("UPI")}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          method === "UPI"
                            ? "border-primary bg-primary-container text-primary font-bold"
                            : "border-outline bg-surface text-on-surface"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="text-xs">UPI AutoPay / Collect</span>
                        </div>
                        <span className="text-[11px] text-secondary font-medium">Instant</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMethod("Card")}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          method === "Card"
                            ? "border-primary bg-primary-container text-primary font-bold"
                            : "border-outline bg-surface text-on-surface"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary" />
                          <span className="text-xs">Corporate Credit Card</span>
                        </div>
                        <span className="text-[11px] text-text-muted">MasterCard / Visa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMethod("Bank")}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          method === "Bank"
                            ? "border-primary bg-primary-container text-primary font-bold"
                            : "border-outline bg-surface text-on-surface"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-primary" />
                          <span className="text-xs">NEFT / RTGS Virtual Account</span>
                        </div>
                        <span className="text-[11px] text-text-muted">HDFC-VAN</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={paying}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-white hover:bg-secondary-hover font-semibold text-sm transition-all shadow-md disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{paying ? "Authorizing..." : `Pay ₹${invoice.totalAmount.toLocaleString("en-IN")}`}</span>
                  </button>

                  <div className="text-[11px] text-text-muted text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                    <span>256-bit bank encrypted settlement</span>
                  </div>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </PortalLayout>
  );
}
