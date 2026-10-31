"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { DataTable, Column } from "@/components/ui/data-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { useToast } from "@/components/ui/toast";
import { getInvoices } from "@/lib/services/api";
import { Invoice } from "@/types/database";
import {
  Receipt,
  Download,
  Plus,
  RefreshCw,
  Wallet,
  Clock,
  AlertTriangle,
  Zap,
  ChevronRight,
  Printer,
} from "lucide-react";

export default function InvoicesListPage() {
  const toast = useToast();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getInvoices();
        setInvoices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(searchVal.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchVal.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || inv.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Invoice>[] = [
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
      cell: (inv) => <span className="font-semibold text-on-surface">{inv.customerName}</span>,
    },
    {
      key: "issueDate",
      header: "Issue Date",
      cell: (inv) => <DateText date={inv.issueDate} />,
    },
    {
      key: "dueDate",
      header: "Due Date",
      cell: (inv) => <DateText date={inv.dueDate} />,
    },
    {
      key: "totalAmount",
      header: "Total Billed (GST Incl.)",
      isPrimary: true,
      cell: (inv) => <MoneyText amount={inv.totalAmount} className="font-bold text-on-surface" />,
    },
    {
      key: "status",
      header: "Status",
      cell: (inv) => <StatusBadge status={inv.status} />,
    },
    {
      key: "actions",
      header: "",
      cell: (inv) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toast.info(`Printing invoice PDF for ${inv.number}`);
            }}
            className="p-1 text-on-surface-muted hover:text-on-surface rounded"
            title="Print PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
          <Link
            href={`/admin/invoices/${inv.id}`}
            className="p-1 text-on-surface-muted hover:text-primary rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <BackOfficeLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        <PageHeader
          title="Invoices & Receivables"
          subtitle="Customer billings, GST invoices, automated reconciliation, and settlement tracking."
          breadcrumbs={[
            { label: "Billing", href: "/admin/dashboard" },
            { label: "Invoices" },
          ]}
          actions={
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => toast.success("Export Complete", "Exported all invoices to CSV.")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-surface border border-outline hover:bg-surface-container text-on-surface font-semibold text-body-sm shadow-xs min-h-[44px]"
              >
                <Download className="w-4 h-4 text-on-surface-variant" />
                <span>Export CSV</span>
              </button>
              <Link
                href="/admin/subscriptions/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-on-primary hover:bg-primary-hover font-bold text-body-sm shadow-xs min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Create Invoice</span>
              </Link>
            </div>
          }
        />

        {/* 4 Invoicing KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Receivables"
            value={<MoneyText amount={14892400} />}
            subtitle="vs. last fiscal month"
            change={{ value: "+12.4%", positive: true }}
            icon={<Wallet className="w-4 h-4 text-primary" />}
          />
          <KpiCard
            title="Unsettled / Due"
            value={<MoneyText amount={249830} />}
            subtitle="4 pending accounts"
            change={{ value: "Net 30 terms", neutral: true }}
            icon={<Clock className="w-4 h-4 text-amber-600" />}
          />
          <KpiCard
            title="Overdue Delinquency"
            value={<MoneyText amount={142800} />}
            subtitle="Immediate dunning required"
            change={{ value: "-4.2%", positive: false }}
            icon={<AlertTriangle className="w-4 h-4 text-red-600" />}
          />
          <KpiCard
            title="Direct Debit Capture"
            value="94.2%"
            subtitle="Automated bank & card mandates"
            change={{ value: "+1.8%", positive: true }}
            icon={<Zap className="w-4 h-4 text-secondary" />}
          />
        </div>

        {/* Filter Bar with Lifecycle Tabs */}
        <FilterBar
          searchValue={searchVal}
          onSearchChange={setSearchVal}
          searchPlaceholder="Search by invoice number or customer name..."
          tabs={[
            { id: "all", label: "All Invoices", count: invoices.length, active: statusFilter === "all", onClick: () => setStatusFilter("all") },
            { id: "draft", label: "Draft", count: invoices.filter((i) => i.status === "Draft").length, active: statusFilter === "draft", onClick: () => setStatusFilter("draft") },
            { id: "confirmed", label: "Confirmed / Due", count: invoices.filter((i) => i.status === "Confirmed").length, active: statusFilter === "confirmed", onClick: () => setStatusFilter("confirmed") },
            { id: "paid", label: "Paid", count: invoices.filter((i) => i.status === "Paid").length, active: statusFilter === "paid", onClick: () => setStatusFilter("paid") },
          ]}
        />

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(inv) => inv.id}
          isLoading={isLoading}
          pageSize={8}
        />
      </div>
    </BackOfficeLayout>
  );
}
