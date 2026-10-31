"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { FormField } from "@/components/ui/form-field";
import { MoneyText } from "@/components/ui/money-text";
import { useToast } from "@/components/ui/toast";
import { getProductById, saveProduct } from "@/lib/services/api";
import { Product, ProductVariant } from "@/types/database";
import { Plus, Trash2, ArrowLeft, Check, Layers, Tag, DollarSign } from "lucide-react";

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const id = params?.id as string;
  const isNew = !id || id === "new";

  const [name, setName] = useState(isNew ? "" : "Enterprise Core Platform");
  const [sku, setSku] = useState(isNew ? "" : "ECP-SaaS-2026");
  const [productType, setProductType] = useState<"recurring" | "service" | "physical">("recurring");
  const [basePrice, setBasePrice] = useState<number>(isNew ? 50000 : 190000);
  const [costPrice, setCostPrice] = useState<number>(isNew ? 10000 : 45000);
  const [description, setDescription] = useState(
    isNew ? "" : "Multi-tenant cloud billing orchestration platform with real-time dunning."
  );

  // Brand Variants List
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      id: "var-1",
      productId: id || "prod-01",
      attributeName: "Brand",
      attributeValue: "Brightloop Native",
      extraPrice: 0,
      sku: "ECP-NAT-01",
      status: "active",
    },
    {
      id: "var-2",
      productId: id || "prod-01",
      attributeName: "Brand",
      attributeValue: "Enterprise Brand Tier A",
      extraPrice: 15000,
      sku: "ECP-BRANDA-02",
      status: "active",
    },
    {
      id: "var-3",
      productId: id || "prod-01",
      attributeName: "Brand",
      attributeValue: "White-Label OEM Brand B",
      extraPrice: 35000,
      sku: "ECP-OEM-03",
      status: "active",
    },
  ]);

  const [isLoading, setIsLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      getProductById(id).then((p) => {
        if (p) {
          setName(p.name);
          setSku(p.sku);
          setProductType(p.productType);
          setBasePrice(p.basePrice);
          setCostPrice(p.costPrice);
          setDescription(p.description);
          if (p.variants.length > 0) {
            setVariants(p.variants);
          }
        }
        setIsLoading(false);
      });
    }
  }, [id, isNew]);

  const addBrandVariant = () => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      productId: id || "prod-new",
      attributeName: "Brand",
      attributeValue: "New Custom Brand",
      extraPrice: 10000,
      sku: `${sku || "SKU"}-VAR-${variants.length + 1}`,
      status: "active",
    };
    setVariants([...variants, newVar]);
  };

  const removeVariant = (varId: string) => {
    setVariants(variants.filter((v) => v.id !== varId));
  };

  const updateVariant = (varId: string, field: keyof ProductVariant, val: any) => {
    setVariants(
      variants.map((v) => (v.id === varId ? { ...v, [field]: val } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProduct({
      id: isNew ? undefined : id,
      name,
      sku,
      productType,
      basePrice,
      costPrice,
      description,
      variants,
    });

    toast.success("Product Saved", `Configured ${name} with ${variants.length} brand variants.`);
    router.push("/admin/products");
  };

  if (isLoading) {
    return (
      <BackOfficeLayout>
        <div className="max-w-4xl mx-auto py-12 space-y-4">
          <div className="h-8 bg-surface-container rounded w-1/3 animate-pulse" />
          <div className="h-64 bg-surface rounded-xl border border-outline animate-pulse" />
        </div>
      </BackOfficeLayout>
    );
  }

  return (
    <BackOfficeLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title={isNew ? "New Product or Service" : `Edit Product: ${name}`}
          subtitle="Configure base commercial rates and brand tier variant price additions."
          breadcrumbs={[
            { label: "Products", href: "/admin/products" },
            { label: isNew ? "New Product" : name },
          ]}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Baseline Specifications */}
          <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-title-lg text-on-surface">1. Baseline Specifications</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Product / Module Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enterprise Core Platform"
              />
              <FormField
                label="SKU Identifier"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="ECP-SaaS-2026"
              />
              <FormField
                label="Product Type"
                as="select"
                value={productType}
                onChange={(e) => setProductType(e.target.value as any)}
                options={[
                  { label: "Recurring Subscription SaaS", value: "recurring" },
                  { label: "Professional Service / Support Agreement", value: "service" },
                  { label: "Physical Terminal Hardware", value: "physical" },
                ]}
              />
              <FormField
                label="Standard Sales Base Rate (INR)"
                type="number"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
              />
              <FormField
                label="Cost of Goods / Unit Cost (INR)"
                type="number"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
              />
            </div>

            <FormField
              label="Internal Description & Scope"
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline functional scope, deliverables, and billing parameters..."
            />
          </div>

          {/* Section 2: Product Variant & Brand Price Builder */}
          <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline">
              <div>
                <h3 className="font-bold text-title-lg text-on-surface flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <span>Configurable Brand Variants &amp; Price Markups</span>
                </h3>
                <p className="text-body-sm text-on-surface-muted">
                  Brand attributes add an extra price on top of the standard base rate (₹{basePrice.toLocaleString("en-IN")}).
                </p>
              </div>
              <button
                type="button"
                onClick={addBrandVariant}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-outline hover:bg-surface-container text-body-sm font-semibold text-primary self-start sm:self-auto min-h-[36px]"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Brand Tier</span>
              </button>
            </div>

            {/* Brand Values & Price Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-body-sm">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                    <th className="px-3 py-2.5">Attribute</th>
                    <th className="px-3 py-2.5">Brand Tier Value</th>
                    <th className="px-3 py-2.5">Extra Price Markup</th>
                    <th className="px-3 py-2.5">Effective Total Price</th>
                    <th className="px-3 py-2.5">Variant SKU</th>
                    <th className="px-3 py-2.5 text-center">Status</th>
                    <th className="px-3 py-2.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  {variants.map((v) => {
                    const finalRate = basePrice + v.extraPrice;
                    return (
                      <tr key={v.id} className="hover:bg-surface-container-low/50">
                        <td className="px-3 py-3 font-semibold text-on-surface-muted">
                          Brand
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="text"
                            aria-label="Brand Tier Value"
                            value={v.attributeValue}
                            onChange={(e) => updateVariant(v.id, "attributeValue", e.target.value)}
                            className="w-full max-w-xs px-2.5 py-1.5 rounded bg-surface border border-outline font-medium text-sm"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-secondary">+₹</span>
                            <input
                              type="number"
                              aria-label="Extra Price Markup"
                              value={v.extraPrice}
                              onChange={(e) =>
                                updateVariant(v.id, "extraPrice", parseFloat(e.target.value) || 0)
                              }
                              className="w-28 px-2.5 py-1.5 rounded bg-surface border border-outline font-bold text-sm text-secondary"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-3 font-bold text-on-surface">
                          <MoneyText amount={finalRate} />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="text"
                            aria-label="Variant SKU"
                            value={v.sku}
                            onChange={(e) => updateVariant(v.id, "sku", e.target.value)}
                            className="w-28 px-2 py-1 rounded bg-surface border border-outline font-mono text-xs"
                          />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            aria-label="Remove variant tier"
                            onClick={() => removeVariant(v.id)}
                            className="p-1 text-on-surface-muted hover:text-red-600 rounded min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-marker-yellow-container rounded-lg border border-marker-yellow/40 text-xs">
              <span className="font-caveat text-amber-800 font-bold text-base -rotate-1 inline-block">
                ✍️ Note: When drafting a customer subscription, choosing a brand variant automatically updates the line item unit price to Base + Brand Markup!
              </span>
            </div>
          </div>

          {/* Form CTAs */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/admin/products"
              className="px-5 py-2.5 border border-outline rounded-md text-body-md font-semibold text-on-surface hover:bg-surface-container min-h-[44px]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-primary text-on-primary font-bold hover:bg-primary-hover shadow-md min-h-[44px]"
            >
              <Check className="w-4 h-4" />
              <span>Save Product Specifications</span>
            </button>
          </div>
        </form>
      </div>
    </BackOfficeLayout>
  );
}
