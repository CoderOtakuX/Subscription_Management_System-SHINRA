"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Stepper } from "@/components/ui/stepper";
import { StatusBadge } from "@/components/ui/status-badge";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { Drawer } from "@/components/ui/drawer";
import { FormField } from "@/components/ui/form-field";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { getInvoiceById, updateInvoiceStatus, recordPayment } from "@/lib/services/api";
import { Invoice, PaymentMethod } from "@/types/database";
import {
  CreditCard,
  Mail,
  Printer,
  XCircle,
  Copy,
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  ArrowLeft,
  Check,
  Clock,
} from "lucide-react";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const id = params?.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Settlement Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentAmountError, setPaymentAmountError] = useState("");
  const [paymentDate, setPaymentDate] = useState("2026-03-15");
  const [referenceCode, setReferenceCode] = useState("");
  const [notes, setNotes] = useState("");
  const [sendReceipt, setSendReceipt] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const inv = await getInvoiceById(id);
        setInvoice(inv);
        if (inv) {
          setPaymentAmount(inv.totalAmount);
          setReferenceCode(`UPI-${Math.floor(100000 + Math.random() * 900000)}`);
        }
      } catch (err) {
        console.error(err);
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
          <div className="h-64 bg-surface rounded-xl border border-outline animate-pulse" />
        </div>
      </BackOfficeLayout>
    );
  }

  if (!invoice) {
    return (
      <BackOfficeLayout>
        <div className="max-w-md mx-auto my-16 text-center space-y-4 p-8 bg-surface border border-outline rounded-xl">
          <h2 className="text-xl font-bold">Invoice Not Found</h2>
          <p className="text-body-sm text-on-surface-variant">
            Could not find invoice matching ID &quot;{id}&quot;.
          </p>
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-md font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Invoices</span>
          </Link>
        </div>
      </BackOfficeLayout>
    );
  }

  const handleStepTransition = async (stage: string) => {
    const updated = await updateInvoiceStatus(invoice.id, stage as any);
    if (updated) {
      setInvoice({ ...updated });
      toast.success("Status Updated", `Invoice moved to ${stage}`);
    }
  };

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentAmountError("");
    if (paymentAmount > invoice.totalAmount) {
      const msg = `Payment amount (₹${paymentAmount.toLocaleString("en-IN")}) cannot exceed amount due (₹${invoice.totalAmount.toLocaleString("en-IN")}).`;
      setPaymentAmountError(msg);
      toast.error("Payment Exceeds Balance", msg);
      return;
    }

    await recordPayment({
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      method: paymentMethod,
      amount: paymentAmount,
      date: paymentDate,
      referenceCode,
      notes,
    });

    const updated = await updateInvoiceStatus(invoice.id, "Paid");
    if (updated) {
      setInvoice({ ...updated, paidAmount: paymentAmount });
    }
    setIsSettlementOpen(false);
    toast.success("Payment Recorded", `Marked ${invoice.number} as Paid via ${paymentMethod}.`);
  };

  const handleCancelInvoice = async () => {
    // In our model cancel moves it to draft or archives
    const updated = await updateInvoiceStatus(invoice.id, "Draft");
    if (updated) setInvoice({ ...updated });
    setIsCancelModalOpen(false);
    toast.warning("Invoice Cancelled", `${invoice.number} reverted to Draft.`);
  };

  const copyPortalLink = () => {
    const portalUrl = `${window.location.origin}/portal/invoices/${invoice.id}`;
    navigator.clipboard.writeText(portalUrl);
    toast.success("Link Copied", "Customer self-service payment URL copied to clipboard.");
  };

  const subtotal = invoice.amount;
  const tax = invoice.taxAmount;
  const total = invoice.totalAmount;

  return (
    <BackOfficeLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="no-print">
          <PageHeader
            title={`Invoice ${invoice.number}`}
            subtitle={`Billing Cycle #${invoice.billingCycle} · Issued to ${invoice.customerName}`}
            breadcrumbs={[
              { label: "Invoices", href: "/admin/invoices" },
              { label: invoice.number },
            ]}
            badge={<StatusBadge status={invoice.status} size="md" />}
            actions={
              <div className="flex items-center gap-2 flex-wrap">
                {invoice.status !== "Paid" && (
                  <button
                    type="button"
                    onClick={() => setIsSettlementOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-on-primary hover:bg-primary-hover font-semibold text-body-sm shadow-xs min-h-[44px]"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Register Payment</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => toast.success("Email Dispatched", `Sent invoice PDF to customer contact.`)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-surface border border-outline hover:bg-surface-container text-on-surface font-semibold text-body-sm min-h-[44px]"
                >
                  <Mail className="w-4 h-4 text-on-surface-variant" />
                  <span>Send by Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-surface border border-outline hover:bg-surface-container text-on-surface font-semibold text-body-sm min-h-[44px]"
                >
                  <Printer className="w-4 h-4 text-on-surface-variant" />
                  <span>Print PDF</span>
                </button>
                {invoice.status !== "Paid" && (
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-body-sm min-h-[44px]"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            }
          />
        </div>

        {/* 3-Step Lifecycle Stepper */}
        <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs no-print">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Invoice Lifecycle Stages
            </span>
            <span className="font-caveat text-secondary text-base font-bold -rotate-1">
              Draft → Confirmed → Paid
            </span>
          </div>
          <Stepper
            steps={["Draft", "Confirmed", "Paid"]}
            currentStep={invoice.status}
            onStepClick={(stage) => handleStepTransition(stage)}
          />
        </div>

        {/* Main 2-Column Split: Letterhead on Left, Action & Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Printable Letterhead (8 Cols) */}
          <div className="lg:col-span-8 bg-surface rounded-xl border border-outline p-8 sm:p-12 shadow-sm space-y-8 print-container">
            {/* Letterhead Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-outline">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-9 h-9 rounded-lg bg-primary text-white font-black text-xl flex items-center justify-center">
                    B
                  </span>
                  <span className="font-bold text-2xl text-primary tracking-tight">Brightloop</span>
                </div>
                <p className="text-body-sm text-on-surface-muted">
                  Brightloop Technologies Private Limited<br />
                  Bandra-Kurla Complex, Mumbai, Maharashtra 400051<br />
                  GSTIN: <span className="font-mono font-semibold text-on-surface">27AABCB9900M1Z3</span>
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-muted block">
                  Tax Invoice
                </span>
                <span className="text-2xl font-black text-on-surface">{invoice.number}</span>
                <p className="text-xs text-on-surface-muted mt-1">
                  Issue: <DateText date={invoice.issueDate} /><br />
                  Due: <DateText date={invoice.dueDate} />
                </p>
              </div>
            </div>

            {/* Billed To / Shipping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-body-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-muted block mb-1">
                  Billed To
                </span>
                <p className="font-bold text-on-surface text-base">{invoice.customerName}</p>
                <p className="text-on-surface-variant">
                  Nexus Enterprises Corporate Park<br />
                  Bandra East, Mumbai 400051<br />
                  GSTIN: <span className="font-mono font-semibold">27AABCN1234F1Z5</span>
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-muted block mb-1">
                  Contract &amp; Terms
                </span>
                <p className="text-on-surface font-medium">Subscription: SUB-0042</p>
                <p className="text-on-surface font-medium">Payment Terms: {invoice.paymentTerms}</p>
                <p className="text-on-surface font-medium">Place of Supply: Maharashtra (27)</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-body-sm">
                <thead>
                  <tr className="bg-surface-container-low border-y border-outline text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                    <th className="py-3 px-3">Item &amp; Description</th>
                    <th className="py-3 px-3 text-right">Qty</th>
                    <th className="py-3 px-3 text-right">Rate</th>
                    <th className="py-3 px-3 text-right">GST</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  {invoice.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="py-3.5 px-3">
                        <p className="font-semibold text-on-surface">{line.productName}</p>
                        {line.variant && (
                          <span className="text-xs text-primary font-medium">
                            Variant: {line.variant}
                          </span>
                        )}
                        <p className="text-xs text-on-surface-muted">{line.description}</p>
                      </td>
                      <td className="py-3.5 px-3 text-right font-medium">{line.quantity}</td>
                      <td className="py-3.5 px-3 text-right">
                        <MoneyText amount={line.unitPrice} />
                      </td>
                      <td className="py-3.5 px-3 text-right font-medium">{line.taxRate}%</td>
                      <td className="py-3.5 px-3 text-right font-bold text-on-surface">
                        <MoneyText amount={line.subtotal} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex flex-col sm:flex-row justify-end items-end gap-2 pt-4 border-t border-outline text-body-sm">
              <div className="w-full sm:w-72 space-y-2">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal Amount:</span>
                  <MoneyText amount={subtotal} className="font-semibold" />
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>CGST (9%) + SGST (9%):</span>
                  <MoneyText amount={tax} className="font-semibold" />
                </div>
                <div className="pt-2 border-t border-outline flex justify-between text-base font-bold text-on-surface">
                  <span>Grand Total Due:</span>
                  <MoneyText amount={total} className="text-2xl font-black text-primary" />
                </div>
              </div>
            </div>

            {/* Footer Compliance Stamp */}
            <div className="pt-6 border-t border-outline flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-muted gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                Computer-generated GST compliant invoice. Digitally signed.
              </span>
              <span className="font-mono">IRN: 8a7f4b2e...9103c</span>
            </div>
          </div>

          {/* Right Column: Actions, Portal Link & Subscription Quick Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 no-print">
            {/* Settlement Status Card */}
            <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-on-surface">Settlement Status</h4>
                <StatusBadge status={invoice.status} />
              </div>

              <div className="p-4 bg-surface-container-low rounded-lg border border-outline space-y-2">
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-muted">Total Billed:</span>
                  <MoneyText amount={invoice.totalAmount} className="font-bold" />
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-muted">Amount Paid:</span>
                  <MoneyText amount={invoice.paidAmount} className="font-bold text-emerald-700" />
                </div>
                <div className="flex justify-between text-body-sm pt-2 border-t border-outline font-bold">
                  <span>Balance Due:</span>
                  <MoneyText
                    amount={invoice.status === "Paid" ? 0 : invoice.totalAmount - invoice.paidAmount}
                    className="text-red-700 font-bold"
                  />
                </div>
              </div>

              {invoice.status !== "Paid" ? (
                <button
                  type="button"
                  onClick={() => setIsSettlementOpen(true)}
                  className="w-full py-2.5 px-4 rounded-md bg-primary text-on-primary font-bold hover:bg-primary-hover shadow-xs flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Record Payment Settlement</span>
                </button>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Invoice Fully Settled</span>
                </div>
              )}
            </div>

            {/* Customer Self-Serve Portal Link */}
            <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-3">
              <h4 className="font-bold text-on-surface text-body-md">
                Customer Pay Portal
              </h4>
              <p className="text-xs text-on-surface-variant">
                Direct URL where customer can pay via UPI, Razorpay card, or download receipt.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyPortalLink}
                  className="flex-1 py-2 px-3 border border-outline rounded-md bg-surface text-body-sm font-semibold hover:bg-surface-container flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <Copy className="w-4 h-4 text-on-surface-variant" />
                  <span>Copy Pay Link</span>
                </button>
                <Link
                  href={`/portal/invoices/${invoice.id}`}
                  className="p-2.5 rounded-md bg-surface border border-outline hover:bg-surface-container text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Preview Customer Payment View"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Linked Subscription */}
            <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-muted block">
                Parent Contract
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={`/admin/subscriptions/${invoice.subscriptionId}`}
                    className="font-bold text-primary hover:underline block"
                  >
                    SUB-0042
                  </Link>
                  <span className="text-xs text-on-surface-muted">Enterprise Core Annual</span>
                </div>
                <StatusBadge status="Active" size="sm" />
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-on-surface text-body-md">Status History Timeline</h4>
                <Clock className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline">
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <p className="text-xs font-semibold text-on-surface">Invoice Created (Draft)</p>
                  <span className="text-[11px] text-on-surface-muted">15 Oct 2026, 09:30 AM · System</span>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <p className="text-xs font-semibold text-on-surface">Terms Confirmed & Sealed</p>
                  <span className="text-[11px] text-on-surface-muted">16 Oct 2026, 11:15 AM · Claire L.</span>
                </div>
                {invoice.status === "Paid" && (
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <p className="text-xs font-semibold text-on-surface">Payment Settled</p>
                    <span className="text-[11px] text-on-surface-muted">18 Oct 2026, 02:45 PM · UPI AutoPay</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settlement Slide-over Drawer */}
        <Drawer
          isOpen={isSettlementOpen}
          onClose={() => setIsSettlementOpen(false)}
          title="Record Payment Settlement"
          subtitle={`Invoice ${invoice.number} · Due: ₹${invoice.totalAmount}`}
        >
          <form onSubmit={handleRegisterPayment} className="space-y-4 py-2">
            <FormField
              label="Payment Method"
              as="select"
              required
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              options={[
                { label: "UPI (PhonePe / Google Pay / BHIM)", value: "UPI" },
                { label: "Card (Credit / Debit via Gateway)", value: "Card" },
                { label: "Bank transfer (NEFT / RTGS / IMPS)", value: "Bank transfer" },
                { label: "Cash / Direct Check", value: "Cash" },
              ]}
            />

            <FormField
              label="Settlement Amount (INR)"
              type="number"
              required
              value={paymentAmount}
              onChange={(e) => {
                setPaymentAmount(parseFloat(e.target.value) || 0);
                if (paymentAmountError) setPaymentAmountError("");
              }}
              error={paymentAmountError}
            />

            <FormField
              label="Payment Received Date"
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />

            <FormField
              label="Transaction Reference / UTR Number"
              placeholder="e.g. UPI-2026-992144"
              required
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
            />

            <FormField
              label="Remittance Notes"
              as="textarea"
              placeholder="Bank reconciliation notes or gateway authorization code..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="sendReceipt"
                checked={sendReceipt}
                onChange={(e) => setSendReceipt(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary"
              />
              <label htmlFor="sendReceipt" className="text-xs text-on-surface-variant cursor-pointer">
                Automatically email payment confirmation receipt to customer
              </label>
            </div>

            <div className="pt-4 border-t border-outline flex gap-3">
              <button
                type="button"
                onClick={() => setIsSettlementOpen(false)}
                className="flex-1 py-2.5 px-4 border border-outline rounded-md font-semibold text-sm hover:bg-surface-container min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-hover shadow-md min-h-[44px]"
              >
                Confirm Settlement
              </button>
            </div>
          </form>
        </Drawer>

        {/* Cancel Invoice Confirm Modal */}
        <ConfirmDialog
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleCancelInvoice}
          title="Cancel Invoice?"
          description={`Are you sure you want to cancel ${invoice.number}? The invoice will be reverted to Draft.`}
          confirmLabel="Cancel Invoice"
          variant="danger"
        />
      </div>
    </BackOfficeLayout>
  );
}
