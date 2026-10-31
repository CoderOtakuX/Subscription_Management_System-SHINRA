"use client";

import React, { useState } from "react";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge, BadgeStatus } from "@/components/ui/status-badge";
import { Stepper } from "@/components/ui/stepper";
import { DataTable, Column } from "@/components/ui/data-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { KpiCard } from "@/components/ui/kpi-card";
import { Modal } from "@/components/ui/modal";
import { Drawer } from "@/components/ui/drawer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormField } from "@/components/ui/form-field";
import { PasswordChecklist } from "@/components/ui/password-checklist";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useToast } from "@/components/ui/toast";
import {
  TrendingUp,
  CreditCard,
  Users,
  Search,
  Plus,
  Mail,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";

interface SampleRow {
  id: string;
  code: string;
  customer: string;
  plan: string;
  amount: number;
  status: BadgeStatus;
  date: string;
}

const SAMPLE_ROWS: SampleRow[] = [
  { id: "1", code: "SUB-0042", customer: "Nexus Enterprises", plan: "Enterprise Core Annual", amount: 240300, status: "Active", date: "2026-03-15" },
  { id: "2", code: "SUB-0043", customer: "Bharat Tech Solutions", plan: "Professional Monthly", amount: 14500, status: "Quotation", date: "2026-03-20" },
  { id: "3", code: "SUB-0044", customer: "Tata Consultancy Pvt", plan: "Starter Daily", amount: 4800, status: "Confirmed", date: "2026-03-22" },
  { id: "4", code: "SUB-0045", customer: "Infosys Cloud Labs", plan: "Enterprise Custom", amount: 560000, status: "Draft", date: "2026-03-25" },
  { id: "5", code: "SUB-0046", customer: "Reliance Retail", plan: "Growth Quarterly", amount: 89000, status: "Closed", date: "2026-01-10" },
  { id: "6", code: "SUB-0047", customer: "Wipro Digital", plan: "Professional Monthly", amount: 14500, status: "Overdue", date: "2026-02-01" },
];

export default function DevComponentsPage() {
  const toast = useToast();

  // State controls for interactive demos
  const [currentStep, setCurrentStep] = useState("Active");
  const [password, setPassword] = useState("Bright@2026");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [tableLoading, setTableLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const statuses: BadgeStatus[] = [
    "Draft",
    "Quotation",
    "Confirmed",
    "Active",
    "Closed",
    "Paid",
    "Outstanding",
    "Overdue",
    "Pending",
    "Failed",
    "Invited",
  ];

  const columns: Column<SampleRow>[] = [
    {
      key: "code",
      header: "Subscription #",
      isPrimary: true,
      cell: (row) => <span className="font-bold text-primary">{row.code}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      isPrimary: true,
      cell: (row) => <span className="font-medium text-on-surface">{row.customer}</span>,
    },
    {
      key: "plan",
      header: "Plan Tier",
      cell: (row) => <span className="text-on-surface-variant">{row.plan}</span>,
    },
    {
      key: "amount",
      header: "Annual / Run Value",
      isPrimary: true,
      cell: (row) => <MoneyText amount={row.amount} className="font-semibold" />,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "date",
      header: "Effective Date",
      cell: (row) => <DateText date={row.date} />,
    },
  ];

  return (
    <BackOfficeLayout>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Header */}
        <PageHeader
          title="Component Showcase & Design Tokens"
          subtitle="All reusable Warm Pragmatic SaaS components matching mobile-first responsive rules, typography tokens, and lifecycle badges."
          breadcrumbs={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Dev Tools", href: "/dev/components" },
            { label: "UI Library" },
          ]}
          badge={
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-container text-primary">
              v1.0 Ready
            </span>
          }
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.success("Toast Notification", "System successfully triggered toast.")}
                className="px-4 py-2 bg-primary text-on-primary font-semibold text-sm rounded-md hover:bg-primary-hover min-h-[44px]"
              >
                Trigger Test Toast
              </button>
            </div>
          }
        />

        {/* Section 1: Typography & Handwritten Highlight */}
        <section className="bg-surface p-6 rounded-xl border border-outline space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">1. Typography & Handwritten Accent</h2>
            <span className="text-xs text-on-surface-muted">Inter & Caveat fonts</span>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-extrabold text-on-surface">
              Enterprise Billing Orchestration for Modern SaaS
            </p>
            <p className="text-body-lg text-on-surface-variant">
              Body Large: Standard 16px body copy ensuring clean mobile readability and preventing iOS viewport zoom on touch inputs.
            </p>
            <p className="text-body-md text-on-surface-muted">
              Body Medium / Small: Used for table records, timestamps, and secondary operational notes.
            </p>
            <div className="p-4 bg-marker-yellow-container rounded-lg border border-marker-yellow/40">
              <p className="text-caveat text-xl sm:text-2xl text-on-surface font-bold">
                ✍️ Caveat script highlight: &quot;Auto-renew scheduled for 31 Dec 2026. Handled via automated mandate.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Stepper Component */}
        <section className="bg-surface p-6 rounded-xl border border-outline space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">2. Stepper Component</h2>
            <span className="text-xs text-on-surface-muted">
              Horizontal on md+, vertical below md
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            Click on any stage to interactively shift the current active step:
          </p>
          <div className="bg-surface-container-low p-4 rounded-lg">
            <Stepper
              steps={["Draft", "Quotation", "Confirmed", "Active", "Closed"]}
              currentStep={currentStep}
              onStepClick={(stepId) => {
                setCurrentStep(stepId);
                toast.info(`Switched step to ${stepId}`);
              }}
            />
          </div>
        </section>

        {/* Section 3: Status Badges */}
        <section className="bg-surface p-6 rounded-xl border border-outline space-y-4">
          <h2 className="text-xl font-bold text-on-surface">3. StatusBadge Lifecycle Tokens</h2>
          <div className="flex flex-wrap gap-2.5">
            {statuses.map((s) => (
              <StatusBadge key={s} status={s} size="md" />
            ))}
          </div>
        </section>

        {/* Section 4: KPI Cards */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-on-surface">4. KpiCard Grid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard
              title="Monthly Recurring Revenue"
              value={<MoneyText amount={1850400} />}
              subtitle="vs. ₹16,20,000 last month"
              change={{ value: "+14.2%", positive: true }}
              icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
            />
            <KpiCard
              title="Active Subscriptions"
              value="1,428"
              subtitle="32 contracts added"
              change={{ value: "+2.8%", positive: true }}
              icon={<Layers className="w-4 h-4 text-primary" />}
            />
            <KpiCard
              title="Receivables Overdue"
              value={<MoneyText amount={240300} />}
              subtitle="4 pending invoices"
              change={{ value: "-5.1%", positive: false }}
              icon={<CreditCard className="w-4 h-4 text-red-600" />}
            />
            <KpiCard
              title="Retention Rate"
              value="98.4%"
              subtitle="Stable enterprise churn"
              change={{ value: "0.0%", neutral: true }}
              icon={<Users className="w-4 h-4 text-secondary" />}
            />
          </div>
        </section>

        {/* Section 5: FilterBar & Responsive DataTable */}
        <section className="bg-surface p-6 rounded-xl border border-outline space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-on-surface">
                5. FilterBar & Responsive DataTable
              </h2>
              <p className="text-body-sm text-on-surface-muted">
                Transforms into stacked card rows with expandable details on mobile below md.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTableLoading(!tableLoading)}
                className="text-xs px-2.5 py-1.5 rounded border border-outline bg-surface-container font-medium hover:bg-surface min-h-[36px]"
              >
                {tableLoading ? "Stop Skeleton" : "Test Loading Skeleton"}
              </button>
              <button
                type="button"
                onClick={() => setShowEmpty(!showEmpty)}
                className="text-xs px-2.5 py-1.5 rounded border border-outline bg-surface-container font-medium hover:bg-surface min-h-[36px]"
              >
                {showEmpty ? "Show Data" : "Test Empty State"}
              </button>
            </div>
          </div>

          <FilterBar
            searchValue={searchVal}
            onSearchChange={setSearchVal}
            searchPlaceholder="Filter subscriptions..."
            tabs={[
              { id: "all", label: "All", count: SAMPLE_ROWS.length, active: activeTab === "all", onClick: () => setActiveTab("all") },
              { id: "active", label: "Active", count: 1, active: activeTab === "active", onClick: () => setActiveTab("active") },
              { id: "quotation", label: "Quotation", count: 1, active: activeTab === "quotation", onClick: () => setActiveTab("quotation") },
            ]}
            filterGroups={[
              {
                id: "plan",
                label: "Plan",
                options: [
                  { label: "Enterprise Core", value: "enterprise" },
                  { label: "Professional", value: "pro" },
                ],
              },
            ]}
            actions={
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-on-primary text-body-sm font-semibold hover:bg-primary-hover min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>New Contract</span>
              </button>
            }
          />

          <DataTable
            columns={columns}
            data={
              showEmpty
                ? []
                : SAMPLE_ROWS.filter((r) =>
                    searchVal ? r.customer.toLowerCase().includes(searchVal.toLowerCase()) || r.code.toLowerCase().includes(searchVal.toLowerCase()) : true
                  )
            }
            keyExtractor={(r) => r.id}
            isLoading={tableLoading}
            pageSize={4}
            onRowClick={(row) => {
              setIsDrawerOpen(true);
            }}
          />
        </section>

        {/* Section 6: Form Fields & Password Checklist */}
        <section className="bg-surface p-6 rounded-xl border border-outline space-y-6">
          <h2 className="text-xl font-bold text-on-surface">6. FormField & PasswordChecklist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                label="Work Email"
                required
                placeholder="name@company.com"
                leftIcon={<Mail className="w-4 h-4" />}
                description="Your corporate domain invoice email."
              />
              <FormField
                label="Billing Cadence"
                as="select"
                options={[
                  { label: "Monthly (Recurring)", value: "monthly" },
                  { label: "Yearly (15% Off)", value: "yearly" },
                  { label: "Weekly Special", value: "weekly" },
                ]}
              />
              <FormField
                label="Internal Audit Notes"
                as="textarea"
                placeholder="Add compliance notes or contract caveats..."
              />
            </div>

            <div className="space-y-4">
              <FormField
                label="Live Password Field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                placeholder="Enter password..."
              />
              <PasswordChecklist password={password} />
            </div>
          </div>
        </section>

        {/* Section 7: Dialogs, Drawers & Confirmation */}
        <section className="bg-surface p-6 rounded-xl border border-outline space-y-4">
          <h2 className="text-xl font-bold text-on-surface">7. Modals, Drawers & Confirm Dialogs</h2>
          <p className="text-body-sm text-on-surface-muted">
            Responsive full-screen sheets on mobile; elegant slide-overs & dialogs on desktop.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover min-h-[44px]"
            >
              Open Standard Modal
            </button>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-2.5 bg-secondary text-white font-semibold rounded-md hover:bg-secondary-hover min-h-[44px]"
            >
              Open Slide-over Drawer
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmOpen(true)}
              className="px-4 py-2.5 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 min-h-[44px]"
            >
              Open Danger Confirm Dialog
            </button>
          </div>
        </section>

        {/* Section 8: Empty & Error States */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface p-4 rounded-xl border border-outline">
            <h3 className="text-title-lg font-semibold mb-2">EmptyState Preview</h3>
            <EmptyState
              title="No Invoices Due"
              description="All billing cycles for March 2026 are fully reconciled."
              action={
                <button
                  type="button"
                  onClick={() => toast.info("Creating invoice")}
                  className="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-semibold"
                >
                  Generate Invoice
                </button>
              }
            />
          </div>

          <div className="bg-surface p-4 rounded-xl border border-outline">
            <h3 className="text-title-lg font-semibold mb-2">ErrorState Preview</h3>
            <ErrorState
              title="Payment Gateway Timeout"
              description="Unable to sync transaction ledger with HDFC bank gateway. Retrying will not double-bill."
              onRetry={() => toast.success("Gateway connection restored")}
            />
          </div>
        </section>

        {/* Modal Demo */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Subscription"
          description="Initiate a draft subscription contract for an existing customer."
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-outline rounded-md text-sm font-medium hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  toast.success("Subscription Draft Initiated");
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-semibold hover:bg-primary-hover"
              >
                Save Draft
              </button>
            </>
          }
        >
          <div className="space-y-4 py-2">
            <FormField label="Customer Name" placeholder="Bharat Technologies Private Limited" />
            <FormField
              label="Select Plan"
              as="select"
              options={[
                { label: "Enterprise Core Annual (₹2,40,300/yr)", value: "ent" },
                { label: "Professional Monthly (₹14,500/mo)", value: "pro" },
              ]}
            />
          </div>
        </Modal>

        {/* Drawer Demo */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Subscription Quick Preview (SUB-0042)"
          subtitle="Nexus Enterprises · Active Enterprise Scale"
          footer={
            <div className="flex gap-2 w-full justify-end">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 border border-outline rounded-md text-sm font-medium"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  toast.info("Opening full subscription detail page");
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-semibold"
              >
                View Full Record
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-surface-container-low border border-outline space-y-2">
              <div className="flex justify-between">
                <span className="text-body-sm text-on-surface-muted">Current Status</span>
                <StatusBadge status="Active" />
              </div>
              <div className="flex justify-between">
                <span className="text-body-sm text-on-surface-muted">Annual Billed Rate</span>
                <MoneyText amount={240300} className="font-bold text-lg" />
              </div>
              <div className="flex justify-between">
                <span className="text-body-sm text-on-surface-muted">Renewal Date</span>
                <DateText date="2026-12-31" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-body-md text-on-surface">Order Line Items</h4>
              <ul className="divide-y divide-outline border border-outline rounded-md overflow-hidden text-body-sm">
                <li className="p-3 bg-surface flex justify-between">
                  <span>Enterprise Core Platform × 1</span>
                  <MoneyText amount={190000} />
                </li>
                <li className="p-3 bg-surface flex justify-between">
                  <span>Dedicated Support Agreement × 1</span>
                  <MoneyText amount={50300} />
                </li>
              </ul>
            </div>
          </div>
        </Drawer>

        {/* Confirm Dialog Demo */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            setIsConfirmOpen(false);
            toast.warning("Subscription successfully cancelled");
          }}
          title="Cancel Subscription Contract?"
          description="Are you sure you want to cancel subscription SUB-0042? This will stop recurring automated billing and move status to Closed."
          confirmLabel="Cancel Subscription"
          variant="danger"
        />
      </div>
    </BackOfficeLayout>
  );
}
