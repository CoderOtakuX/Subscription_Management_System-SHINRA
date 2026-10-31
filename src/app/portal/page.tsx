"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layouts/portal-layout";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { getInvoices, getSubscriptions } from "@/lib/services/api";
import { Invoice, Subscription } from "@/types/database";
import {
  RefreshCw,
  Calendar,
  CreditCard,
  Receipt,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Zap,
} from "lucide-react";

export default function PortalHomePage() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Pay Modal
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [invData, subData] = await Promise.all([
          getInvoices(),
          getSubscriptions(),
        ]);
        // Filter for customer #cust-01
        setInvoices(invData);
        setSubscriptions(subData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeSubs = subscriptions.filter((s) => s.status === "Active");
  const overdueOrUnpaidInvoices = invoices.filter(
    (i) => i.status === "Overdue" || i.status === "Outstanding"
  );
  const totalDue = overdueOrUnpaidInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      if (selectedInvoiceForPay) {
        setInvoices(
          invoices.map((inv) =>
            inv.id === selectedInvoiceForPay.id ? { ...inv, status: "Paid" } : inv
          )
        );
      }
      setSelectedInvoiceForPay(null);
      toast("Payment Successful", {
        description: `₹${selectedInvoiceForPay?.totalAmount.toLocaleString("en-IN")} settled via ${paymentMethod}. GST receipt issued.`,
        variant: "success",
      });
    }, 1200);
  };

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Greeting & Account Identifier */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-primary text-xs font-semibold mb-2">
              <span>Bharat Technologies Private Limited</span>
              <span>·</span>
              <span className="font-mono">Account #CUST-2026-892</span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">
              Welcome back, Marcus
            </h1>
            <p className="text-sm text-text-muted mt-1 max-w-xl">
              Manage your corporate subscriptions, review GST-compliant tax invoices, and configure automated billing mandates.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-surface border border-outline px-4 py-2 rounded-xl shadow-xs self-start md:self-auto">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">Auto-Debit Active</span>
              <span className="text-[11px] text-text-muted">UPI AutoPay Mandate</span>
            </div>
          </div>
        </div>

        {/* 3-Card Bento Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tile 1: Active Subscriptions */}
          <div className="rounded-2xl bg-surface border border-outline p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Current Subscriptions
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-primary">{activeSubs.length}</span>
                  <span className="text-sm font-semibold text-on-surface">Active Plans</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-outline flex items-center justify-between text-xs">
              <span className="text-text-muted">All licenses active</span>
              <Link
                href="/portal/subscriptions"
                className="font-semibold text-secondary hover:underline inline-flex items-center gap-1"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tile 2: Next Scheduled Charge */}
          <div className="rounded-2xl bg-surface border border-outline p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Next Scheduled Charge
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-badge-outstanding-bg text-badge-outstanding-text text-[11px] font-bold">
                    in 18 days
                  </span>
                </div>
                <div className="mt-2">
                  <MoneyText amount={1240300} className="text-3xl font-extrabold text-on-surface" />
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-outline flex items-center justify-between text-xs">
              <span className="text-text-muted">Cycle: 01 Nov 2026</span>
              <span className="text-secondary font-semibold">UPI AutoPay Verified</span>
            </div>
          </div>

          {/* Tile 3: Outstanding Balance */}
          <div className="rounded-2xl bg-surface border border-outline p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Outstanding Balance
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <MoneyText
                    amount={totalDue}
                    className={`text-3xl font-extrabold ${totalDue > 0 ? "text-badge-overdue-text" : "text-secondary"}`}
                  />
                  <span className="text-xs text-text-muted">
                    {totalDue > 0 ? "due for payment" : "all settled"}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-secondary flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-outline flex items-center justify-between text-xs">
              <span className="text-text-muted">GST E-Invoicing compliant</span>
              <button
                onClick={() => {
                  toast("Tax Summary Downloaded", {
                    description: "Annual GST input tax credit summary (GSTR-2B) exported.",
                    variant: "success",
                  });
                }}
                className="text-secondary hover:underline font-semibold"
              >
                Download Tax Summary
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Invoices Table + Sidebar Quick Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Recent Invoices (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-on-surface">Recent Tax Invoices</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-text-muted text-xs font-semibold">
                  Last 90 Days
                </span>
              </div>
              <Link
                href="/portal/invoices"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                All Invoices <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-surface border border-outline rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-outline">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Billing Date</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4 text-right">Amount (INR)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline">
                    {invoices.slice(0, 5).map((inv) => (
                      <tr key={inv.id} className="hover:bg-surface-container/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/portal/invoices/${inv.id}`}
                            className="font-mono font-semibold text-primary hover:underline"
                          >
                            {inv.number}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <DateText date={inv.invoiceDate} className="text-text-muted text-xs" />
                        </td>
                        <td className="py-3.5 px-4">
                          <DateText date={inv.dueDate} className="text-text-muted text-xs" />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <MoneyText amount={inv.totalAmount} className="font-bold text-on-surface text-sm" />
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={inv.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {inv.status === "Paid" ? (
                            <Link
                              href={`/portal/invoices/${inv.id}`}
                              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-primary font-medium"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Receipt</span>
                            </Link>
                          ) : (
                            <button
                              onClick={() => setSelectedInvoiceForPay(inv)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-secondary text-white hover:bg-secondary-hover text-xs font-semibold shadow-xs"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Pay Now</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Mandate & Payment Profile (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Active Payment Mandate Card */}
            <div className="bg-surface border border-outline rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-on-surface">Payment Method</h3>
                <span className="px-2 py-0.5 rounded-full bg-badge-active-bg text-secondary text-xs font-semibold">
                  Default
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
                    UPI
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">
                      bharat.corp@okhdfcbank
                    </span>
                    <span className="text-[11px] text-text-muted">HDFC Corporate Current</span>
                  </div>
                </div>
                <div className="text-[11px] text-text-muted pt-2 border-t border-outline flex justify-between">
                  <span>Mandate Limit: ₹5,00,000 / mo</span>
                  <span className="text-secondary font-medium">Verified (RBI Compliant)</span>
                </div>
              </div>

              <Link
                href="/portal/profile"
                className="w-full inline-flex items-center justify-center py-2 rounded-lg border border-outline text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
              >
                Manage Payment Methods
              </Link>
            </div>

            {/* GST Tax Profile & Compliance */}
            <div className="bg-surface border border-outline rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <h3 className="font-bold text-sm text-on-surface">GST & Tax Clearance</h3>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Registered GSTIN: <span className="font-mono font-semibold text-on-surface">27AAAAA0000A1Z5</span> (Maharashtra). All invoices automatically flow to your GSTR-2B credit ledger.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    toast("Certificate Downloaded", {
                      description: "GST Compliance certificate for FY 2025-26 saved.",
                      variant: "success",
                    });
                  }}
                  className="text-xs text-secondary hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Annual Tax Statement (PDF)</span>
                </button>
              </div>
            </div>

            {/* Help & Support */}
            <div className="p-5 rounded-2xl bg-surface-container border border-outline/50 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-text-muted">
                <span className="font-semibold text-on-surface block">Need billing assistance?</span>
                <span>Contact your dedicated enterprise account manager at </span>
                <a href="mailto:billing@brightloop.in" className="text-primary font-semibold hover:underline">
                  billing@brightloop.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Immediate Settlement Modal */}
        <Modal
          isOpen={Boolean(selectedInvoiceForPay)}
          onClose={() => setSelectedInvoiceForPay(null)}
          title={`Pay Invoice ${selectedInvoiceForPay?.number || ""}`}
          description="Complete instant payment using UPI, Corporate Card, or Net Banking. Official GST invoice receipt will be generated immediately."
        >
          {selectedInvoiceForPay && (
            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-muted uppercase tracking-wider block">Payable Amount</span>
                  <MoneyText amount={selectedInvoiceForPay.totalAmount} className="text-2xl font-bold text-primary mt-0.5" />
                </div>
                <div className="text-right text-xs">
                  <span className="text-text-muted block">GST (18%) Included</span>
                  <span className="font-mono font-semibold text-on-surface">{selectedInvoiceForPay.number}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface">Select Payment Channel</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      paymentMethod === "UPI"
                        ? "border-primary bg-primary-container text-primary font-bold"
                        : "border-outline bg-surface text-on-surface"
                    }`}
                  >
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs">UPI (GooglePay / PhonePe)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Card")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      paymentMethod === "Card"
                        ? "border-primary bg-primary-container text-primary font-bold"
                        : "border-outline bg-surface text-on-surface"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="text-xs">Corporate Card</span>
                  </button>
                </div>
              </div>

              {paymentMethod === "UPI" && (
                <div className="p-3.5 rounded-lg bg-surface-container border border-outline/50 text-xs space-y-1">
                  <span className="font-semibold text-on-surface block">UPI AutoPay / QR Settlement</span>
                  <span className="text-text-muted">A push collect request will be sent to your registered VPA: bharat.corp@okhdfcbank.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPay(null)}
                  className="px-4 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paying}
                  className="px-5 py-2.5 rounded-lg bg-secondary text-white hover:bg-secondary-hover text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {paying ? "Authorizing Payment..." : `Pay ₹${selectedInvoiceForPay.totalAmount.toLocaleString("en-IN")}`}
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </PortalLayout>
  );
}
