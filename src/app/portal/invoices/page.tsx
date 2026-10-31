"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layouts/portal-layout";
import { DataTable, Column } from "@/components/ui/data-table";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { getInvoices } from "@/lib/services/api";
import { Invoice } from "@/types/database";
import {
  Receipt,
  Download,
  Zap,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  ExternalLink,
  CreditCard,
  FileCheck,
} from "lucide-react";

export default function MyInvoicesPage() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter tab & search
  const [activeTab, setActiveTab] = useState<"all" | "unpaid" | "paid">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pay Modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState("UPI");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getInvoices();
        setInvoices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const unpaidInvoices = invoices.filter(
    (i) => i.status === "Outstanding" || i.status === "Overdue" || i.status === "Draft"
  );
  const paidInvoices = invoices.filter((i) => i.status === "Paid");

  const filteredInvoices = invoices.filter((inv) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "unpaid"
        ? inv.status === "Outstanding" || inv.status === "Overdue" || inv.status === "Draft"
        : inv.status === "Paid";

    const matchesSearch =
      inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const pendingBalance = unpaidInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const paidTotal = paidInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      if (selectedInvoice) {
        setInvoices(
          invoices.map((inv) =>
            inv.id === selectedInvoice.id ? { ...inv, status: "Paid" } : inv
          )
        );
      }
      setSelectedInvoice(null);
      toast("Payment Completed", {
        description: `Payment for ${selectedInvoice?.number} recorded successfully.`,
        variant: "success",
      });
    }, 1200);
  };

  const columns: Column<Invoice>[] = [
    {
      header: "Invoice Number",
      accessorKey: "number",
      cell: (inv) => (
        <div className="flex flex-col">
          <Link
            href={`/portal/invoices/${inv.id}`}
            className="font-mono font-semibold text-primary hover:underline text-sm"
          >
            {inv.number}
          </Link>
          <span className="text-[11px] text-text-muted">GST Tax Invoice</span>
        </div>
      ),
    },
    {
      header: "Invoice Date",
      accessorKey: "invoiceDate",
      cell: (inv) => <DateText date={inv.invoiceDate} className="text-xs text-text-muted" />,
    },
    {
      header: "Due Date",
      accessorKey: "dueDate",
      cell: (inv) => <DateText date={inv.dueDate} className="text-xs text-text-muted" />,
    },
    {
      header: "Amount (INR)",
      accessorKey: "totalAmount",
      className: "text-right",
      cell: (inv) => (
        <div className="text-right">
          <MoneyText amount={inv.totalAmount} className="font-bold text-on-surface text-sm" />
          <span className="text-[11px] text-text-muted block">GST incl</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (inv) => <StatusBadge status={inv.status} />,
    },
    {
      header: "Action",
      accessorKey: "id",
      className: "text-right",
      cell: (inv) => (
        <div className="flex items-center justify-end gap-2">
          {inv.status === "Paid" ? (
            <Link
              href={`/portal/invoices/${inv.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline hover:bg-surface-container text-xs font-medium text-on-surface transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-text-muted" />
              <span>Download PDF</span>
            </Link>
          ) : (
            <button
              onClick={() => setSelectedInvoice(inv)}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-secondary text-white hover:bg-secondary-hover text-xs font-semibold shadow-xs"
            >
              <Zap className="w-3 h-3" />
              <span>Pay Now</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-1">
              <span className="text-secondary uppercase tracking-wider">Financial Ledger</span>
              <span>·</span>
              <span>Bharat Technologies Private Limited · Org #BL-9920</span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">My Invoices</h1>
            <p className="text-sm text-text-muted mt-1 max-w-xl">
              Access, download, and pay your official Indian GST tax invoices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                toast("Exporting Statements", {
                  description: "Full statements archive downloaded as zip.",
                  variant: "info",
                });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-outline hover:bg-surface-container text-on-surface text-sm font-medium transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-text-muted" />
              <span>Export Statements</span>
            </button>
          </div>
        </div>

        {/* 3 Bento KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-surface border border-outline shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Pending Balance
              </span>
              <MoneyText amount={pendingBalance} className="text-2xl font-extrabold text-primary mt-1 block" />
              <span className="text-[11px] text-amber-900 font-semibold block mt-1">
                {unpaidInvoices.length} invoices awaiting settlement
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-badge-outstanding-bg text-badge-outstanding-text flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-outline shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Paid to Date
              </span>
              <MoneyText amount={paidTotal} className="text-2xl font-extrabold text-on-surface mt-1 block" />
              <span className="text-[11px] text-secondary font-medium block mt-1">
                ✓ 100% on-time settlement record
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-badge-active-bg text-secondary flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-outline shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Billing Cadence
              </span>
              <p className="text-lg font-bold text-on-surface mt-1">Monthly Net 15</p>
              <span className="text-[11px] text-text-muted block mt-1">
                UPI AutoPay · Next cycle Nov 2026
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-surface border border-outline rounded-xl shadow-xs">
          <div className="flex items-center gap-1 p-1 bg-surface-container rounded-lg">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-surface text-on-surface shadow-xs"
                  : "text-text-muted hover:text-on-surface"
              }`}
            >
              All ({invoices.length})
            </button>
            <button
              onClick={() => setActiveTab("unpaid")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "unpaid"
                  ? "bg-surface text-badge-overdue-text shadow-xs"
                  : "text-text-muted hover:text-on-surface"
              }`}
            >
              Unpaid / Due ({unpaidInvoices.length})
            </button>
            <button
              onClick={() => setActiveTab("paid")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "paid"
                  ? "bg-surface text-secondary shadow-xs"
                  : "text-text-muted hover:text-on-surface"
              }`}
            >
              Paid ({paidInvoices.length})
            </button>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invoice number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline bg-surface-container text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Invoices Table */}
        <DataTable
          columns={columns}
          data={filteredInvoices}
          loading={loading}
          keyExtractor={(i) => i.id}
          pageSize={10}
          emptyTitle="No invoices found"
          emptyDescription="No invoices matching your active tab or search criteria."
        />

        {/* Immediate Settlement Modal */}
        <Modal
          isOpen={Boolean(selectedInvoice)}
          onClose={() => setSelectedInvoice(null)}
          title={`Pay Invoice ${selectedInvoice?.number || ""}`}
          description="Execute instant settlement via Corporate UPI or Credit Card."
        >
          {selectedInvoice && (
            <form onSubmit={handlePay} className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-muted uppercase tracking-wider block">Total Payable</span>
                  <MoneyText amount={selectedInvoice.totalAmount} className="text-2xl font-bold text-primary mt-0.5" />
                </div>
                <div className="text-right text-xs">
                  <span className="text-text-muted block">GST e-Invoice Verified</span>
                  <span className="font-mono font-semibold text-on-surface">{selectedInvoice.number}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod("UPI")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      method === "UPI"
                        ? "border-primary bg-primary-container text-primary font-bold"
                        : "border-outline bg-surface text-on-surface"
                    }`}
                  >
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs">UPI AutoPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("Card")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      method === "Card"
                        ? "border-primary bg-primary-container text-primary font-bold"
                        : "border-outline bg-surface text-on-surface"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="text-xs">Corporate Card</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paying}
                  className="px-5 py-2.5 rounded-lg bg-secondary text-white hover:bg-secondary-hover text-xs font-semibold transition-colors"
                >
                  {paying ? "Processing..." : `Pay ₹${selectedInvoice.totalAmount.toLocaleString("en-IN")}`}
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </PortalLayout>
  );
}
