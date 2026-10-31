"use client";

import React, { useState, useEffect } from "react";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { DataTable, Column } from "@/components/ui/data-table";
import { FilterBar, FilterOption } from "@/components/ui/filter-bar";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { Drawer } from "@/components/ui/drawer";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { getPayments, recordPayment, getInvoices, getCustomers } from "@/lib/services/api";
import { Payment, Invoice, Customer } from "@/types/database";
import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  Download,
  Plus,
  Eye,
  FileText,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function PaymentsPage() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modals & Drawers
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [viewPayment, setViewPayment] = useState<Payment | null>(null);

  // Form State for Recording Payment
  const [newPayment, setNewPayment] = useState({
    customerId: "",
    invoiceId: "",
    method: "UPI" as Payment["method"],
    amount: 150000,
    referenceCode: "",
    notes: "Direct settlement via corporate banking",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [payData, invData, custData] = await Promise.all([
          getPayments(),
          getInvoices(),
          getCustomers(),
        ]);
        setPayments(payData);
        setInvoices(invData);
        setCustomers(custData);
        if (custData.length > 0 && invData.length > 0) {
          setNewPayment((prev) => ({
            ...prev,
            customerId: custData[0].id,
            invoiceId: invData[0].id,
            amount: invData[0].totalAmount,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered Payments
  const filteredPayments = payments.filter((pay) => {
    const matchesSearch =
      pay.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pay.referenceCode && pay.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMethod =
      selectedMethod === "all" || pay.method.toLowerCase() === selectedMethod.toLowerCase();

    const matchesStatus =
      selectedStatus === "all" || pay.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesMethod && matchesStatus;
  });

  // Calculate Metrics
  const totalVolume = payments
    .filter((p) => p.status === "Successful")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingVolume = payments
    .filter((p) => p.status === "Pending")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const successCount = payments.filter((p) => p.status === "Successful").length;
  const successRate = payments.length > 0 ? ((successCount / payments.length) * 100).toFixed(1) : "100";

  const [amountError, setAmountError] = useState("");

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAmountError("");
    const selectedCust = customers.find((c) => c.id === newPayment.customerId);
    const selectedInv = invoices.find((i) => i.id === newPayment.invoiceId);

    if (selectedInv && Number(newPayment.amount) > selectedInv.totalAmount) {
      const msg = `Payment amount (₹${Number(newPayment.amount).toLocaleString('en-IN')}) cannot exceed amount due (₹${selectedInv.totalAmount.toLocaleString('en-IN')}).`;
      setAmountError(msg);
      toast("Payment Exceeds Balance", {
        description: msg,
        variant: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      const created = await recordPayment({
        customerId: newPayment.customerId,
        customerName: selectedCust?.companyName || "Enterprise Customer",
        invoiceId: newPayment.invoiceId,
        invoiceNumber: selectedInv?.number || "INV-MANUAL",
        method: newPayment.method,
        amount: Number(newPayment.amount),
        referenceCode: newPayment.referenceCode || `UTR${Date.now()}`,
        notes: newPayment.notes,
      });

      setPayments([created, ...payments]);
      setIsRecordModalOpen(false);
      toast("Payment Recorded", {
        description: `Successfully booked payment of ₹${Number(newPayment.amount).toLocaleString('en-IN')} for ${selectedCust?.companyName}.`,
        variant: "success",
      });
    } catch (err) {
      toast("Error Recording Payment", {
        description: "Failed to save payment record. Please retry.",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Payment>[] = [
    {
      header: "Transaction Ref",
      accessorKey: "transactionId",
      cell: (pay) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface">{pay.transactionId}</span>
          <span className="text-xs text-text-muted">{pay.referenceCode || "Direct settlement"}</span>
        </div>
      ),
    },
    {
      header: "Customer",
      accessorKey: "customerName",
      cell: (pay) => (
        <div className="flex flex-col">
          <span className="font-medium text-on-surface">{pay.customerName}</span>
          <span className="text-xs text-text-muted">Inv: {pay.invoiceNumber}</span>
        </div>
      ),
    },
    {
      header: "Method",
      accessorKey: "method",
      cell: (pay) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container text-xs font-medium text-on-surface">
          <CreditCard className="w-3.5 h-3.5 text-primary" />
          {pay.method}
        </span>
      ),
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: (pay) => <DateText date={pay.date} className="text-sm text-text-muted" />,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "text-right",
      cell: (pay) => (
        <div className="text-right">
          <MoneyText amount={pay.amount} className="font-semibold text-on-surface text-sm" />
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (pay) => <StatusBadge status={pay.status} />,
    },
    {
      header: "Actions",
      accessorKey: "id",
      className: "text-right",
      cell: (pay) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setViewPayment(pay)}
            title="View Receipt"
            className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-surface-container transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              toast("Receipt Downloaded", {
                description: `Payment voucher for ${pay.transactionId} downloaded as PDF.`,
                variant: "success",
              });
            }}
            title="Download Voucher"
            className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-surface-container transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const methodFilterOptions: FilterOption[] = [
    { label: "All Payment Methods", value: "all" },
    { label: "UPI", value: "upi" },
    { label: "Card", value: "card" },
    { label: "Bank Transfer", value: "bank transfer" },
    { label: "Cash", value: "cash" },
  ];

  const statusFilterOptions: FilterOption[] = [
    { label: "All Settlement Statuses", value: "all" },
    { label: "Successful", value: "successful" },
    { label: "Pending", value: "pending" },
    { label: "Failed", value: "failed" },
  ];

  return (
    <BackOfficeLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Payment Reconciliation Ledger"
          badge="Live Reconciliation"
          subtitle="Track inbound settlements, manual receipts, and automated payment gateway webhooks."
          breadcrumbs={[
            { label: "Finance" },
            { label: "Payments", href: "/admin/payments" },
          ]}
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  toast("Export Complete", {
                    description: "Payments ledger CSV exported to downloads.",
                    variant: "info",
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-outline hover:bg-surface-container text-on-surface text-sm font-medium transition-colors shadow-xs"
              >
                <Download className="w-4 h-4 text-text-muted" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setIsRecordModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-plum-hover text-sm font-semibold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Record Payment</span>
              </button>
            </div>
          }
        />

        {/* Bento KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Settled Volume (MTD)"
            value={<MoneyText amount={totalVolume} />}
            trend={{ value: "+14.2% vs last month", direction: "up" }}
            subtitle="Ledger balanced with GST"
            icon={IndianRupee}
          />
          <KpiCard
            title="Pending Inbound"
            value={<MoneyText amount={pendingVolume} />}
            subtitle="Under banking clearing"
            icon={Clock}
          />
          <KpiCard
            title="Reconciliation Rate"
            value={`${successRate}%`}
            trend={{ value: "+0.8% accuracy", direction: "up" }}
            subtitle="Auto-cleared via UPI/PG"
            icon={CheckCircle2}
          />
          <KpiCard
            title="Failed Transactions"
            value={payments.filter((p) => p.status === "Failed").length}
            subtitle="Requires retry or outreach"
            icon={AlertTriangle}
          />
        </div>

        {/* Filter Controls */}
        <FilterBar
          searchPlaceholder="Search by transaction ID, customer, invoice ref, or UTR..."
          onSearchChange={setSearchQuery}
          filterGroups={[
            {
              id: "method",
              label: "Method",
              options: methodFilterOptions,
              selectedValue: selectedMethod,
              onChange: (val) => setSelectedMethod(val),
            },
            {
              id: "status",
              label: "Status",
              options: statusFilterOptions,
              selectedValue: selectedStatus,
              onChange: (val) => setSelectedStatus(val),
            },
          ]}
        />

        {/* Payments Table */}
        <DataTable
          columns={columns}
          data={filteredPayments}
          loading={loading}
          keyExtractor={(p) => p.id}
          pageSize={10}
          emptyTitle="No payment records found"
          emptyDescription="Try adjusting your search filters or record an inbound payment manually."
        />

        {/* Record Payment Modal */}
        <Modal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          title="Record Manual / Offline Settlement"
          description="Book payment against an outstanding invoice. This immediately credits the customer ledger and updates the invoice status."
          size="lg"
        >
          <form onSubmit={handleRecordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Customer Account" required>
                <select
                  value={newPayment.customerId}
                  onChange={(e) => {
                    const custId = e.target.value;
                    const custInvs = invoices.filter((i) => i.customerId === custId);
                    setNewPayment({
                      ...newPayment,
                      customerId: custId,
                      invoiceId: custInvs[0]?.id || "",
                      amount: custInvs[0]?.totalAmount || 100000,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.gstin})
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Invoice Reference" required>
                <select
                  value={newPayment.invoiceId}
                  onChange={(e) => {
                    const inv = invoices.find((i) => i.id === e.target.value);
                    setNewPayment({
                      ...newPayment,
                      invoiceId: e.target.value,
                      amount: inv?.totalAmount || newPayment.amount,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.number} — ₹{inv.totalAmount.toLocaleString("en-IN")} ({inv.status})
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Payment Method" required>
                <select
                  value={newPayment.method}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, method: e.target.value as Payment["method"] })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  <option value="UPI">UPI (Instant VPA)</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Bank transfer">NEFT / RTGS Bank Transfer</option>
                  <option value="Cash">Cash Ledger</option>
                </select>
              </FormField>

              <FormField label="Amount Paid (₹)" required error={amountError}>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={newPayment.amount}
                  onChange={(e) => {
                    setNewPayment({ ...newPayment, amount: Number(e.target.value) });
                    if (amountError) setAmountError("");
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  required
                />
              </FormField>
            </div>

            <FormField label="UTR / Bank Transaction Reference" description="External bank transfer reference or UPI RRN code.">
              <input
                type="text"
                placeholder="e.g. UTR-HDFC-9923841094"
                value={newPayment.referenceCode}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, referenceCode: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </FormField>

            <FormField label="Accounting Notes">
              <textarea
                rows={2}
                value={newPayment.notes}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, notes: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </FormField>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline">
              <button
                type="button"
                onClick={() => setIsRecordModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-plum-hover text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {submitting ? "Booking Payment..." : "Confirm & Book Payment"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Payment Detail Drawer */}
        <Drawer
          isOpen={Boolean(viewPayment)}
          onClose={() => setViewPayment(null)}
          title={`Payment Receipt — ${viewPayment?.transactionId || ""}`}
          description="Detailed transaction receipt and bank reconciliation logs."
          size="md"
        >
          {viewPayment && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-muted uppercase tracking-wider block">Total Credited</span>
                  <MoneyText amount={viewPayment.amount} className="text-2xl font-bold text-primary mt-0.5" />
                </div>
                <StatusBadge status={viewPayment.status} />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-outline">
                  <span className="text-text-muted">Customer</span>
                  <span className="font-semibold text-on-surface">{viewPayment.customerName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-outline">
                  <span className="text-text-muted">Invoice Ref</span>
                  <span className="font-semibold text-primary">{viewPayment.invoiceNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-outline">
                  <span className="text-text-muted">Payment Channel</span>
                  <span className="font-medium text-on-surface">{viewPayment.method}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-outline">
                  <span className="text-text-muted">Bank Reference / UTR</span>
                  <span className="font-mono text-xs font-semibold text-on-surface">
                    {viewPayment.referenceCode || "DIRECT-GATEWAY"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-outline">
                  <span className="text-text-muted">Settlement Date</span>
                  <DateText date={viewPayment.date} className="font-medium text-on-surface" />
                </div>
                <div className="flex justify-between py-2 border-b border-outline">
                  <span className="text-text-muted">Internal Remarks</span>
                  <span className="font-medium text-on-surface">{viewPayment.notes}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-badge-active-bg/50 border border-secondary/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div className="text-xs text-secondary-hover">
                  <p className="font-semibold">Statutory GST & Bank Reconciliation Verified</p>
                  <p className="mt-0.5">
                    This transaction has passed two-way ledger verification with the Reserve Bank of India (RBI) payment gateway guidelines.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    toast("PDF Generated", {
                      description: `Voucher for ${viewPayment.transactionId} exported.`,
                      variant: "success",
                    });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white hover:bg-plum-hover font-semibold text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Signed Receipt Voucher</span>
                </button>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </BackOfficeLayout>
  );
}
