"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { MoneyText } from "@/components/ui/money-text";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { getQuotationTemplates, getPlans, getProducts } from "@/lib/services/api";
import { QuotationTemplate, Plan, Product, OrderLine } from "@/types/database";
import { FileText, Plus, Trash2, ArrowRight, Save, Sparkles, Check } from "lucide-react";

export default function QuotationTemplatesPage() {
  const router = useRouter();
  const toast = useToast();

  const [templates, setTemplates] = useState<QuotationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<QuotationTemplate | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form edit states
  const [name, setName] = useState("");
  const [validityDays, setValidityDays] = useState(30);
  const [defaultPlanId, setDefaultPlanId] = useState("");
  const [lines, setLines] = useState<OrderLine[]>([]);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [tmpls, pList, prodList] = await Promise.all([
          getQuotationTemplates(),
          getPlans(),
          getProducts(),
        ]);
        setTemplates(tmpls);
        setPlans(pList);
        setProducts(prodList);
        if (tmpls.length > 0) {
          selectTemplate(tmpls[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const selectTemplate = (tmpl: QuotationTemplate) => {
    setSelectedTemplate(tmpl);
    setName(tmpl.name);
    setValidityDays(tmpl.validityDays);
    setDefaultPlanId(tmpl.defaultPlanId);
    setLines([...tmpl.lines]);
  };

  const handleAddLine = () => {
    const prod = products[0];
    const newLine: OrderLine = {
      id: `line-${Date.now()}`,
      productId: prod?.id || "prod-01",
      productName: prod?.name || "Product",
      description: prod?.description || "",
      quantity: 1,
      unitPrice: prod?.basePrice || 15000,
      taxRate: 18,
      discountPercent: 0,
      subtotal: prod?.basePrice || 15000,
    };
    setLines([...lines, newLine]);
  };

  const handleRemoveLine = (lineId: string) => {
    setLines(lines.filter((l) => l.id !== lineId));
  };

  const handleUpdateQty = (lineId: string, qty: number) => {
    setLines(
      lines.map((l) =>
        l.id === lineId ? { ...l, quantity: qty, subtotal: qty * l.unitPrice } : l
      )
    );
  };

  const handleSave = () => {
    if (!selectedTemplate) return;
    const updated = {
      ...selectedTemplate,
      name,
      validityDays,
      defaultPlanId,
      lines,
      lineCount: lines.length,
    };
    setSelectedTemplate(updated);
    setTemplates(templates.map((t) => (t.id === updated.id ? updated : t)));
    toast.success("Template Saved", `Updated template parameters for ${name}.`);
  };

  const subtotal = lines.reduce((acc, l) => acc + l.subtotal, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return (
    <BackOfficeLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        <PageHeader
          title="Quotation Templates"
          subtitle="Define quotation presets with validity duration (in days) and preconfigured order lines."
          breadcrumbs={[
            { label: "Sales & Quotes", href: "/admin/quotation-templates" },
            { label: "Templates" },
          ]}
          actions={
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-surface border border-outline hover:bg-surface-container font-semibold text-body-sm shadow-xs min-h-[44px]"
              >
                <Save className="w-4 h-4 text-on-surface-variant" />
                <span>Save Changes</span>
              </button>
              <Link
                href="/admin/subscriptions/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-on-primary hover:bg-primary-hover font-bold text-body-sm shadow-xs min-h-[44px]"
              >
                <span>Create Subscription from Template</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          }
        />

        {/* 2-Pane Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANE: Preset Templates List (4 cols) */}
          <div className="lg:col-span-4 bg-surface rounded-xl border border-outline p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline">
              <h3 className="font-bold text-on-surface flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span>Presets &amp; Blueprints</span>
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container font-bold text-on-surface-variant">
                {templates.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {templates.map((tmpl) => {
                const isSelected = selectedTemplate?.id === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => selectTemplate(tmpl)}
                    className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? "bg-primary-container/30 border-primary ring-1 ring-primary/40 shadow-xs"
                        : "bg-surface border-outline hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-body-md text-on-surface">
                        {tmpl.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-xs font-semibold text-on-surface-variant">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-on-surface-muted">
                      <span>⏱️ Validity: {tmpl.validityDays} Days</span>
                      <span>•</span>
                      <span>📋 {tmpl.lineCount} Items</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANE: Template Parameters Editor (8 cols) */}
          <div className="lg:col-span-8 bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <div>
                <h3 className="text-title-lg font-bold text-on-surface">
                  Template Parameters: {name}
                </h3>
                <p className="text-body-sm text-on-surface-muted">
                  Validity days determine how long before customer quote acceptance expires.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <FormField
                  label="Template Title"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <FormField
                label="Validity (Days)"
                type="number"
                min="1"
                required
                value={validityDays}
                onChange={(e) => setValidityDays(parseInt(e.target.value) || 30)}
              />
            </div>

            <FormField
              label="Default Billing Plan"
              as="select"
              value={defaultPlanId}
              onChange={(e) => setDefaultPlanId(e.target.value)}
              options={plans.map((p) => ({
                label: `${p.name} (₹${p.price.toLocaleString("en-IN")})`,
                value: p.id,
              }))}
            />

            {/* Order Lines Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-on-surface text-body-md">
                  Default Commercial Lines
                </h4>
                <button
                  type="button"
                  onClick={handleAddLine}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Product Line</span>
                </button>
              </div>

              <div className="space-y-2">
                {lines.map((line) => (
                  <div
                    key={line.id}
                    className="p-3.5 bg-surface-container-low rounded-lg border border-outline flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-body-sm"
                  >
                    <div>
                      <p className="font-semibold text-on-surface">{line.productName}</p>
                      {line.variant && (
                        <span className="text-xs text-primary font-medium">
                          Variant: {line.variant}
                        </span>
                      )}
                      <p className="text-xs text-on-surface-muted">{line.description}</p>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-on-surface-muted">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) =>
                            handleUpdateQty(line.id, parseInt(e.target.value) || 1)
                          }
                          className="w-14 px-2 py-1 bg-surface border border-outline rounded text-center font-bold text-xs"
                        />
                      </div>
                      <MoneyText amount={line.subtotal} className="font-bold w-24 text-right" />
                      {lines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(line.id)}
                          className="text-on-surface-muted hover:text-red-600 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-outline flex justify-between items-center text-body-sm">
                <span className="text-on-surface-muted">Estimated Preset MRR:</span>
                <MoneyText amount={total} className="font-bold text-lg text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackOfficeLayout>
  );
}
