"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { FormField } from "@/components/ui/form-field";
import { MoneyText } from "@/components/ui/money-text";
import { useToast } from "@/components/ui/toast";
import {
  getCustomers,
  getPlans,
  getProducts,
  getQuotationTemplates,
  createSubscription,
} from "@/lib/services/api";
import { Customer, Plan, Product, QuotationTemplate, OrderLine } from "@/types/database";
import { Plus, Trash2, ArrowLeft, Check, Sparkles } from "lucide-react";

export default function NewSubscriptionPage() {
  const router = useRouter();
  const toast = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [templates, setTemplates] = useState<QuotationTemplate[]>([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [cadence, setCadence] = useState<"daily" | "weekly" | "monthly" | "yearly">("yearly");
  const [paymentTerms, setPaymentTerms] = useState("Net 30 Days");
  const [startDate, setStartDate] = useState("2026-04-01");
  const [asQuotation, setAsQuotation] = useState(false);

  const [lines, setLines] = useState<OrderLine[]>([
    {
      id: "l-1",
      productId: "prod-01",
      productName: "Enterprise Core Platform",
      variant: "Brightloop Native",
      description: "Annual SaaS subscription core",
      quantity: 1,
      unitPrice: 190000,
      taxRate: 18,
      discountPercent: 0,
      subtotal: 190000,
    },
  ]);

  useEffect(() => {
    async function load() {
      const [c, p, prod, tmpl] = await Promise.all([
        getCustomers(),
        getPlans(),
        getProducts(),
        getQuotationTemplates(),
      ]);
      setCustomers(c);
      setPlans(p);
      setProducts(prod);
      setTemplates(tmpl);
      if (c[0]) setSelectedCustomerId(c[0].id);
      if (p[0]) setSelectedPlanId(p[0].id);
    }
    load();
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      setLines(
        tmpl.lines.map((l) => ({
          ...l,
          id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        }))
      );
      if (tmpl.defaultPlanId) {
        setSelectedPlanId(tmpl.defaultPlanId);
      }
      toast.info(`Applied template: ${tmpl.name}`);
    }
  };

  const addLine = () => {
    const prod = products[0];
    const newLine: OrderLine = {
      id: `line-${Date.now()}`,
      productId: prod?.id || "prod-01",
      productName: prod?.name || "Product",
      description: prod?.description || "",
      quantity: 1,
      unitPrice: prod?.basePrice || 10000,
      taxRate: 18,
      discountPercent: 0,
      subtotal: prod?.basePrice || 10000,
    };
    setLines([...lines, newLine]);
  };

  const removeLine = (id: string) => {
    setLines(lines.filter((l) => l.id !== id));
  };

  const updateLineQty = (id: string, qty: number) => {
    setLines(
      lines.map((l) =>
        l.id === id ? { ...l, quantity: qty, subtotal: qty * l.unitPrice } : l
      )
    );
  };

  const calculateSubtotal = () => lines.reduce((acc, l) => acc + l.subtotal, 0);
  const subtotal = calculateSubtotal();
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === selectedCustomerId);
    const plan = plans.find((p) => p.id === selectedPlanId);

    const newSub = await createSubscription({
      customerId: selectedCustomerId,
      customerName: cust?.companyName || "Enterprise Customer",
      customerEmail: cust?.email || "billing@enterprise.in",
      planId: selectedPlanId,
      planName: plan?.name || "Custom Plan",
      planPrice: total,
      cadence,
      paymentTerms,
      startDate,
      status: asQuotation ? "Quotation" : "Draft",
      mrr: Math.round(cadence === "yearly" ? total / 12 : total),
      lines,
    });

    toast.success(
      asQuotation ? "Quotation Initiated" : "Draft Subscription Created",
      `Created ${newSub.number}`
    );
    router.push(`/admin/subscriptions/${newSub.id}`);
  };

  return (
    <BackOfficeLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Create New Subscription or Quotation"
          subtitle="Initiate a recurring subscription contract or formal quotation with commercial order lines."
          breadcrumbs={[
            { label: "Subscriptions", href: "/admin/subscriptions" },
            { label: "New Contract" },
          ]}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preset Template Selector Card */}
          <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body-sm font-bold text-on-surface flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>Quick Preset: Load from Quotation Template</span>
              </span>
              <span className="font-caveat text-secondary text-base font-bold -rotate-1">
                autofills products &amp; validity terms
              </span>
            </div>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full py-2.5 px-3 rounded-md bg-surface border border-outline text-body-md focus:ring-2 focus:ring-primary min-h-[44px]"
            >
              <option value="">-- Choose a Quotation Template Preset --</option>
              {templates.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name} ({tmpl.validityDays} Days Validity · {tmpl.lineCount} Lines)
                </option>
              ))}
            </select>
          </div>

          {/* Customer & Plan Details */}
          <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-title-lg text-on-surface">1. Contract Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Customer Organization"
                as="select"
                required
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                options={customers.map((c) => ({
                  label: `${c.companyName} (${c.email})`,
                  value: c.id,
                }))}
              />

              <FormField
                label="Subscription Plan Tier"
                as="select"
                required
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                options={plans.map((p) => ({
                  label: `${p.name} (Base: ₹${p.price})`,
                  value: p.id,
                }))}
              />

              <FormField
                label="Billing Cadence"
                as="select"
                required
                value={cadence}
                onChange={(e) => setCadence(e.target.value as any)}
                options={[
                  { label: "Daily Sandbox", value: "daily" },
                  { label: "Weekly Sprint", value: "weekly" },
                  { label: "Monthly Recurring", value: "monthly" },
                  { label: "Yearly Enterprise", value: "yearly" },
                ]}
              />

              <FormField
                label="Payment Terms"
                as="select"
                required
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                options={[
                  { label: "Due on Receipt / Immediate", value: "Due on Receipt" },
                  { label: "Net 15 Days", value: "Net 15 Days" },
                  { label: "Net 30 Days (Standard Enterprise)", value: "Net 30 Days" },
                  { label: "Net 45 Days", value: "Net 45 Days" },
                ]}
              />

              <FormField
                label="Effective Start Date"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="text-body-sm font-semibold text-on-surface">
                  Contract Initial Status
                </label>
                <div className="flex items-center gap-4 py-2">
                  <label className="flex items-center gap-2 cursor-pointer text-body-sm">
                    <input
                      type="radio"
                      name="initStatus"
                      checked={!asQuotation}
                      onChange={() => setAsQuotation(false)}
                      className="accent-primary"
                    />
                    <span>Draft Subscription</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-body-sm">
                    <input
                      type="radio"
                      name="initStatus"
                      checked={asQuotation}
                      onChange={() => setAsQuotation(true)}
                      className="accent-primary"
                    />
                    <span>Formal Quotation (Pending Customer)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Lines */}
          <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-title-lg text-on-surface">2. Commercial Order Lines</h3>
              <button
                type="button"
                onClick={addLine}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-outline hover:bg-surface-container text-body-sm font-semibold text-primary"
              >
                <Plus className="w-4 h-4" />
                <span>Add Line Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {lines.map((line, idx) => (
                <div
                  key={line.id}
                  className="p-4 bg-surface-container-low rounded-lg border border-outline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 space-y-1">
                    <p className="font-bold text-on-surface">{line.productName}</p>
                    <p className="text-xs text-on-surface-muted">{line.description}</p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-on-surface-muted">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => updateLineQty(line.id, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 bg-surface border border-outline rounded text-center font-bold text-sm"
                      />
                    </div>
                    <div className="w-28 text-right font-bold text-on-surface">
                      <MoneyText amount={line.subtotal} />
                    </div>
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="p-1.5 text-on-surface-muted hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="pt-4 border-t border-outline flex flex-col items-end gap-1.5 text-body-sm">
              <div className="flex justify-between w-64 text-on-surface-muted">
                <span>Subtotal:</span>
                <MoneyText amount={subtotal} className="font-semibold" />
              </div>
              <div className="flex justify-between w-64 text-on-surface-muted">
                <span>GST (18%):</span>
                <MoneyText amount={tax} className="font-semibold" />
              </div>
              <div className="flex justify-between w-64 text-base font-bold text-on-surface pt-1 border-t border-outline">
                <span>Total Contract Rate:</span>
                <MoneyText amount={total} className="text-xl font-bold text-primary" />
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/admin/subscriptions"
              className="px-5 py-2.5 border border-outline rounded-md text-body-md font-semibold text-on-surface hover:bg-surface-container min-h-[44px]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-primary text-on-primary font-bold hover:bg-primary-hover shadow-md min-h-[44px]"
            >
              <Check className="w-4 h-4" />
              <span>{asQuotation ? "Issue Quotation" : "Save Draft Contract"}</span>
            </button>
          </div>
        </form>
      </div>
    </BackOfficeLayout>
  );
}
