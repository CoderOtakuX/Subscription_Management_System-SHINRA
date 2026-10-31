"use client";

import React, { useState, useEffect } from "react";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { getTaxes, saveTaxRule } from "@/lib/services/api";
import { TaxRule } from "@/types/database";
import {
  Percent,
  Globe,
  Plus,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
  Landmark,
} from "lucide-react";

export default function TaxesPage() {
  const { toast } = useToast();
  const [taxes, setTaxes] = useState<TaxRule[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTax, setNewTax] = useState({
    name: "GST Standard Services (18%)",
    code: "GST_18",
    rate: 18,
    calculationType: "percentage" as TaxRule["calculationType"],
    applicableTo: "all" as TaxRule["applicableTo"],
    jurisdiction: "India (Pan-India GST)",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getTaxes();
        setTaxes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreateTax = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await saveTaxRule({
        name: newTax.name,
        code: newTax.code.toUpperCase(),
        rate: Number(newTax.rate),
        calculationType: newTax.calculationType,
        applicableTo: newTax.applicableTo,
        jurisdiction: newTax.jurisdiction,
      });

      setTaxes([created, ...taxes]);
      setIsModalOpen(false);
      toast("Tax Rule Configured", {
        description: `Rule ${created.code} (${created.rate}%) has been added to active billing calculation rules.`,
        variant: "success",
      });
    } catch (err) {
      toast("Error", {
        description: "Failed to create tax rule.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<TaxRule>[] = [
    {
      header: "Rule Name & Code",
      accessorKey: "name",
      cell: (t) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface text-sm">{t.name}</span>
          <span className="font-mono text-xs text-primary">{t.code}</span>
        </div>
      ),
    },
    {
      header: "Tax Rate",
      accessorKey: "rate",
      cell: (t) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container font-mono text-xs font-bold text-on-surface">
          <Percent className="w-3 h-3 text-secondary" />
          {t.rate}% {t.calculationType}
        </span>
      ),
    },
    {
      header: "Jurisdiction & Scope",
      accessorKey: "jurisdiction",
      cell: (t) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-on-surface">{t.jurisdiction}</span>
          <span className="text-[11px] text-text-muted capitalize">Applies to: {t.applicableTo}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (t) => <StatusBadge status={t.status} />,
    },
  ];

  return (
    <BackOfficeLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Tax & GST Configuration"
          badge="Admin Only"
          subtitle="Manage statutory GST slabs (CGST, SGST, IGST), reverse-charge rules, and regional billing jurisdictions."
          breadcrumbs={[
            { label: "Settings" },
            { label: "Tax Configuration", href: "/admin/taxes" },
          ]}
          actions={
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-plum-hover text-sm font-semibold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tax Rule</span>
            </button>
          }
        />

        {/* Bento KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Active Tax Slabs"
            value={taxes.length}
            trend={{ value: "GST compliant", direction: "neutral" }}
            subtitle="Auto-applied to line items"
            icon={Landmark}
          />
          <KpiCard
            title="Primary Slab"
            value="18% GST"
            subtitle="IGST 18% / CGST 9% + SGST 9%"
            icon={Percent}
          />
          <KpiCard
            title="Jurisdictions"
            value="4 Regions"
            subtitle="Domestic Pan-India + Export"
            icon={Globe}
          />
          <KpiCard
            title="E-Invoicing Sync"
            value="NIC Portal"
            trend={{ value: "Live v1.04", direction: "up" }}
            subtitle="IRN Generation Active"
            icon={ShieldCheck}
          />
        </div>

        {/* Taxes Ledger Table */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-on-surface">Registered Statutory Slabs</h3>
              <p className="text-xs text-text-muted mt-0.5">
                Configured rates used by the recurring billing invoice engine.
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={taxes}
            loading={loading}
            keyExtractor={(t) => t.id}
            pageSize={10}
            emptyTitle="No tax rules configured"
            emptyDescription="Create your first GST or tax rule to calculate invoice taxes automatically."
          />
        </div>

        {/* Add Tax Rule Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Statutory Tax Rule"
          description="Define a new tax rule to be automatically applied to invoices and quotation templates."
        >
          <form onSubmit={handleCreateTax} className="space-y-4">
            <FormField label="Rule Name" required>
              <input
                type="text"
                value={newTax.name}
                onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Tax Code / Identifier" required>
                <input
                  type="text"
                  placeholder="e.g. GST_18"
                  value={newTax.code}
                  onChange={(e) => setNewTax({ ...newTax, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-mono"
                  required
                />
              </FormField>

              <FormField label="Tax Rate (%)" required>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={newTax.rate}
                  onChange={(e) => setNewTax({ ...newTax, rate: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  required
                />
              </FormField>
            </div>

            <FormField label="Jurisdiction Scope" required>
              <input
                type="text"
                value={newTax.jurisdiction}
                onChange={(e) => setNewTax({ ...newTax, jurisdiction: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Calculation Method">
                <select
                  value={newTax.calculationType}
                  onChange={(e) =>
                    setNewTax({
                      ...newTax,
                      calculationType: e.target.value as TaxRule["calculationType"],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount per Cycle</option>
                </select>
              </FormField>

              <FormField label="Applicability Scope">
                <select
                  value={newTax.applicableTo}
                  onChange={(e) =>
                    setNewTax({
                      ...newTax,
                      applicableTo: e.target.value as TaxRule["applicableTo"],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Products & Subscriptions</option>
                  <option value="services">Digital Services Only</option>
                  <option value="physical">Physical Hardware Goods</option>
                </select>
              </FormField>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-plum-hover text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Tax Rule"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </BackOfficeLayout>
  );
}
