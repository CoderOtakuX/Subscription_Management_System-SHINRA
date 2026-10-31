"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { FormField } from "@/components/ui/form-field";
import { MoneyText } from "@/components/ui/money-text";
import { useToast } from "@/components/ui/toast";
import { getPlanById, savePlan } from "@/lib/services/api";
import { Plan, BillingCadence } from "@/types/database";
import { Layers, Check, ArrowLeft, Calendar, ShieldCheck, Zap } from "lucide-react";

export default function PlanFormPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const id = params?.id as string;
  const isNew = !id || id === "new";

  const [name, setName] = useState(isNew ? "" : "Professional Monthly");
  const [code, setCode] = useState(isNew ? "" : "PRO-M-2026");
  const [price, setPrice] = useState<number>(isNew ? 10000 : 14500);
  const [cadence, setCadence] = useState<BillingCadence | "">(isNew ? "" : "monthly");
  const [cadenceError, setCadenceError] = useState("");
  const [minQuantity, setMinQuantity] = useState<number>(1);
  const [neverExpire, setNeverExpire] = useState(true);
  const [availabilityStart, setAvailabilityStart] = useState("2026-01-01");
  const [availabilityEnd, setAvailabilityEnd] = useState("");

  // Policy Rules
  const [autoClose, setAutoClose] = useState(false);
  const [closableByCustomer, setClosableByCustomer] = useState(true);
  const [pausable, setPausable] = useState(true);
  const [renewable, setRenewable] = useState(true);

  const [isLoading, setIsLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      getPlanById(id).then((p) => {
        if (p) {
          setName(p.name);
          setCode(p.code);
          setPrice(p.price);
          setCadence(p.cadence);
          setMinQuantity(p.minQuantity);
          setNeverExpire(p.neverExpire);
          setAvailabilityStart(p.availabilityStart || "");
          setAvailabilityEnd(p.availabilityEnd || "");
          setAutoClose(p.autoClose);
          setClosableByCustomer(p.closableByCustomer);
          setPausable(p.pausable);
          setRenewable(p.renewable);
        }
        setIsLoading(false);
      });
    }
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCadenceError("");
    if (!cadence) {
      setCadenceError("Billing period is required.");
      toast.error("Validation Error", "Please select a billing period for this plan.");
      return;
    }
    await savePlan({
      id: isNew ? undefined : id,
      name,
      code,
      price,
      cadence,
      minQuantity,
      neverExpire,
      availabilityStart: availabilityStart || null,
      availabilityEnd: neverExpire ? null : availabilityEnd || null,
      autoClose,
      closableByCustomer,
      pausable,
      renewable,
    });

    toast.success("Plan Saved", `Successfully updated subscription plan ${name}.`);
    router.push("/admin/plans");
  };

  return (
    <BackOfficeLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title={isNew ? "New Subscription Plan" : `Edit Plan: ${name}`}
          subtitle="Configure recurrence frequency, commitments, validity windows, and policy constraints."
          breadcrumbs={[
            { label: "Plans", href: "/admin/plans" },
            { label: isNew ? "New Plan" : name },
          ]}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Core Parameters */}
          <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-title-lg text-on-surface">1. Plan Specifications</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Plan Title"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Professional Monthly"
              />
              <FormField
                label="Plan Code / SKU"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PRO-M-2026"
              />
              <FormField
                label="Recurring Price (INR)"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              />
              <FormField
                label="Billing Period"
                as="select"
                required
                value={cadence}
                onChange={(e) => {
                  setCadence(e.target.value as any);
                  if (e.target.value) setCadenceError("");
                }}
                error={cadenceError}
                options={[
                  { label: "Select a billing period...", value: "" },
                  { label: "Daily (Sandbox / Micro-billing)", value: "daily" },
                  { label: "Weekly (Agile Sprints)", value: "weekly" },
                  { label: "Monthly (Standard SaaS)", value: "monthly" },
                  { label: "Yearly (Enterprise Annual)", value: "yearly" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="minQuantity" className="block text-body-sm font-semibold text-on-surface mb-1.5">
                  Minimum Quantity Commitment
                </label>
                <input
                  id="minQuantity"
                  aria-label="Minimum Quantity Commitment"
                  type="number"
                  min="1"
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-outline font-medium text-base sm:text-body-md focus:ring-2 focus:ring-primary min-h-[44px]"
                />
                <span className="text-xs text-on-surface-muted mt-1 block">
                  Subscribers must commit to at least this quantity of licenses.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Availability & Expiration Dates */}
          <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-title-lg text-on-surface flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              <span>2. Availability Dates &amp; Lifespan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Availability Start Date"
                type="date"
                value={availabilityStart}
                onChange={(e) => setAvailabilityStart(e.target.value)}
              />

              {!neverExpire && (
                <FormField
                  label="Availability End Date"
                  type="date"
                  value={availabilityEnd}
                  onChange={(e) => setAvailabilityEnd(e.target.value)}
                />
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="neverExpire"
                checked={neverExpire}
                onChange={(e) => setNeverExpire(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
              <label htmlFor="neverExpire" className="text-body-sm text-on-surface cursor-pointer font-medium">
                Never Expire (Continuous recurring catalog tier)
              </label>
            </div>
          </div>

          {/* Section 3: Contract Lifecycle Policies */}
          <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-title-lg text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>3. Contract Lifecycle Policy Rules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
              <label className="p-4 bg-surface-container-low rounded-lg border border-outline flex items-start gap-3 cursor-pointer hover:bg-surface-container/60 transition">
                <input
                  type="checkbox"
                  checked={autoClose}
                  onChange={(e) => setAutoClose(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary mt-1"
                />
                <div>
                  <span className="font-bold text-on-surface block">Auto-close at end date</span>
                  <p className="text-xs text-on-surface-muted mt-0.5">
                    Automatically transition subscription status to Closed when end date is reached.
                  </p>
                </div>
              </label>

              <label className="p-4 bg-surface-container-low rounded-lg border border-outline flex items-start gap-3 cursor-pointer hover:bg-surface-container/60 transition">
                <input
                  type="checkbox"
                  checked={closableByCustomer}
                  onChange={(e) => setClosableByCustomer(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary mt-1"
                />
                <div>
                  <span className="font-bold text-on-surface block">Closable by customer</span>
                  <p className="text-xs text-on-surface-muted mt-0.5">
                    Allow customers to initiate cancellation directly through the self-serve portal.
                  </p>
                </div>
              </label>

              <label className="p-4 bg-surface-container-low rounded-lg border border-outline flex items-start gap-3 cursor-pointer hover:bg-surface-container/60 transition">
                <input
                  type="checkbox"
                  checked={pausable}
                  onChange={(e) => setPausable(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary mt-1"
                />
                <div>
                  <span className="font-bold text-on-surface block">Pausable subscription</span>
                  <p className="text-xs text-on-surface-muted mt-0.5">
                    Permit customer or staff to pause billing cycles without terminating the contract.
                  </p>
                </div>
              </label>

              <label className="p-4 bg-surface-container-low rounded-lg border border-outline flex items-start gap-3 cursor-pointer hover:bg-surface-container/60 transition">
                <input
                  type="checkbox"
                  checked={renewable}
                  onChange={(e) => setRenewable(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary mt-1"
                />
                <div>
                  <span className="font-bold text-on-surface block">Renewable contract</span>
                  <p className="text-xs text-on-surface-muted mt-0.5">
                    Enables automated term extension and renewal notifications before expiration.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/admin/plans"
              className="px-5 py-2.5 border border-outline rounded-md text-body-md font-semibold text-on-surface hover:bg-surface-container min-h-[44px]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-primary text-on-primary font-bold hover:bg-primary-hover shadow-md min-h-[44px]"
            >
              <Check className="w-4 h-4" />
              <span>Save Subscription Plan</span>
            </button>
          </div>
        </form>
      </div>
    </BackOfficeLayout>
  );
}
