"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { MoneyText } from "@/components/ui/money-text";
import { DataTable, Column } from "@/components/ui/data-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { useToast } from "@/components/ui/toast";
import { getProducts } from "@/lib/services/api";
import { Product } from "@/types/database";
import { Package, Plus, ChevronRight, Edit3 } from "lucide-react";

export default function ProductsListPage() {
  const toast = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchVal.toLowerCase())
  );

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Product / Service",
      isPrimary: true,
      cell: (p) => (
        <div>
          <Link
            href={`/admin/products/${p.id}/edit`}
            className="font-bold text-primary hover:underline block"
          >
            {p.name}
          </Link>
          <span className="font-mono text-xs text-on-surface-muted">{p.sku}</span>
        </div>
      ),
    },
    {
      key: "productType",
      header: "Type",
      cell: (p) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface capitalize">
          {p.productType}
        </span>
      ),
    },
    {
      key: "basePrice",
      header: "Standard Sales Rate",
      isPrimary: true,
      cell: (p) => <MoneyText amount={p.basePrice} className="font-bold text-on-surface" />,
    },
    {
      key: "variants",
      header: "Brand Variants",
      cell: (p) => (
        <span className="text-body-sm font-medium text-on-surface-variant">
          {p.variants.length > 0 ? `${p.variants.length} Brand Tiers` : "Standard Only"}
        </span>
      ),
    },
    {
      key: "activeSubscribers",
      header: "Subscribers",
      cell: (p) => <span className="font-medium text-on-surface">{p.activeSubscribers}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 capitalize">
          {p.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (p) => (
        <Link
          href={`/admin/products/${p.id}/edit`}
          className="p-1.5 text-on-surface-muted hover:text-primary rounded flex items-center gap-1 text-xs font-medium"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Configure</span>
        </Link>
      ),
    },
  ];

  return (
    <BackOfficeLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        <PageHeader
          title="Products Catalog"
          subtitle="Manage recurring billing services, SaaS modules, and brand variant price surcharges."
          breadcrumbs={[
            { label: "Catalog", href: "/admin/products" },
            { label: "Products" },
          ]}
          actions={
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-on-primary hover:bg-primary-hover font-bold text-body-sm shadow-xs min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Product</span>
            </Link>
          }
        />

        <FilterBar
          searchValue={searchVal}
          onSearchChange={setSearchVal}
          searchPlaceholder="Search products by title or SKU code..."
        />

        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(p) => p.id}
          isLoading={isLoading}
          pageSize={8}
        />
      </div>
    </BackOfficeLayout>
  );
}
