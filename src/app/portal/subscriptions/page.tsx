"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layouts/portal-layout";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { getSubscriptions, updateSubscriptionStatus } from "@/lib/services/api";
import { Subscription } from "@/types/database";
import {
  RefreshCw,
  Calendar,
  Layers,
  PauseCircle,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Plus,
  Users,
} from "lucide-react";

export default function MySubscriptionsPage() {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [pauseSub, setPauseSub] = useState<Subscription | null>(null);
  const [cancelSub, setCancelSub] = useState<Subscription | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getSubscriptions();
        setSubscriptions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleConfirmPause = async () => {
    if (!pauseSub) return;
    setActionLoading(true);
    try {
      await updateSubscriptionStatus(pauseSub.id, "Closed");
      setSubscriptions(
        subscriptions.map((s) => (s.id === pauseSub.id ? { ...s, status: "Closed" } : s))
      );
      toast("Subscription Paused", {
        description: `Contract ${pauseSub.subscriptionNumber} has been temporarily paused. Recurring billing is suspended.`,
        variant: "info",
      });
      setPauseSub(null);
    } catch (err) {
      toast("Error", { description: "Failed to pause subscription.", variant: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelSub) return;
    setActionLoading(true);
    try {
      await updateSubscriptionStatus(cancelSub.id, "Closed");
      setSubscriptions(
        subscriptions.map((s) => (s.id === cancelSub.id ? { ...s, status: "Closed" } : s))
      );
      toast("Subscription Cancelled", {
        description: `Contract ${cancelSub.subscriptionNumber} cancelled. Access will remain active until end of billing cycle.`,
        variant: "error",
      });
      setCancelSub(null);
    } catch (err) {
      toast("Error", { description: "Failed to cancel subscription.", variant: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-1">
              <span>Account Portal</span>
              <span>/</span>
              <span className="text-primary">Billing Lifecycle</span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">
              My Subscriptions
            </h1>
            <p className="text-sm text-text-muted mt-1 max-w-xl">
              View and manage active contracts, renew terms, add seats, or configure payment cadences.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <div className="bg-surface border border-outline px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-xs font-bold text-on-surface">Auto-Renewal Active</span>
              <span className="text-text-muted text-xs">·</span>
              <span className="text-xs text-text-muted">{subscriptions.length} Contracts</span>
            </div>
          </div>
        </div>

        {/* Bento Metric Strips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface border border-outline shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Annual Recurring
              </p>
              <MoneyText amount={12883600} className="text-xl font-bold text-on-surface mt-1" />
              <span className="text-[11px] text-secondary font-medium block mt-1">
                ✓ Next cycle Nov 2026
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-outline shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Monthly Add-ons
              </p>
              <MoneyText amount={18900} className="text-xl font-bold text-on-surface mt-1" />
              <span className="text-[11px] text-text-muted block mt-1">
                Renews 01 Nov 2026
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-outline shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Seat Allocation
              </p>
              <p className="text-xl font-bold text-on-surface mt-1">15 / 20 Active</p>
              <span className="text-[11px] text-secondary font-medium block mt-1">
                5 seats ready to assign
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-outline shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Contract Health
              </p>
              <p className="text-xl font-bold text-secondary mt-1">Compliant</p>
              <span className="text-[11px] text-text-muted block mt-1">
                SOC2 Type II & GST Verified
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-badge-active-bg text-secondary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Subscription Cards List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-on-surface">Active Subscriptions & Licenses</h2>

          <div className="grid grid-cols-1 gap-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-surface border border-outline rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-primary">
                      {sub.subscriptionNumber}
                    </span>
                    <StatusBadge status={sub.status} />
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-surface-container text-on-surface capitalize">
                      {sub.planCadence} Plan
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-on-surface">{sub.planName}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                    <span>
                      Term: <DateText date={sub.startDate} /> —{" "}
                      <DateText date={sub.endDate || "Ongoing"} />
                    </span>
                    <span>·</span>
                    <span>Payment Terms: {sub.paymentTerms}</span>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3 shrink-0">
                  <div className="flex md:flex-col items-baseline md:items-end justify-between gap-1">
                    <MoneyText amount={sub.recurringTotal} className="text-2xl font-extrabold text-on-surface" />
                    <span className="text-xs text-text-muted">/ {sub.planCadence} (GST incl)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPauseSub(sub)}
                      className="px-3 py-1.5 rounded-lg border border-outline hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                    >
                      <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pause</span>
                    </button>
                    <button
                      onClick={() => setCancelSub(sub)}
                      className="px-3 py-1.5 rounded-lg border border-outline hover:bg-surface-container text-rose-600 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                    <Link
                      href={`/portal/subscriptions/${sub.id}`}
                      className="px-4 py-1.5 rounded-lg bg-primary text-white hover:bg-plum-hover text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Manage Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pause Confirmation Modal */}
        <Modal
          isOpen={Boolean(pauseSub)}
          onClose={() => setPauseSub(null)}
          title={`Pause Subscription — ${pauseSub?.subscriptionNumber || ""}`}
          description="Temporarily suspend your subscription. While paused, recurring billing is halted and licenses are preserved."
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-container space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">Plan</span>
                <span className="font-semibold text-on-surface">{pauseSub?.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Pause Duration</span>
                <span className="font-semibold text-on-surface">Up to 90 Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Auto-Resume Date</span>
                <span className="font-semibold text-secondary">01 Feb 2027</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline">
              <button
                type="button"
                onClick={() => setPauseSub(null)}
                className="px-4 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container text-xs font-medium transition-colors"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={handleConfirmPause}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 text-xs font-semibold transition-colors"
              >
                {actionLoading ? "Pausing..." : "Confirm Pause"}
              </button>
            </div>
          </div>
        </Modal>

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={Boolean(cancelSub)}
          onClose={() => setCancelSub(null)}
          title={`Cancel Subscription — ${cancelSub?.subscriptionNumber || ""}`}
          description="Are you sure you want to cancel this subscription? You will continue to have access until the end of your current paid billing period."
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-badge-overdue-bg/50 border border-badge-overdue-text/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-badge-overdue-text">
                <AlertTriangle className="w-4 h-4" />
                <span>Notice of Termination</span>
              </div>
              <p className="text-badge-overdue-text/90">
                Cancellation takes effect on the next billing date. Your historical invoices and GST receipts will remain accessible in your customer portal.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline">
              <button
                type="button"
                onClick={() => setCancelSub(null)}
                className="px-4 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container text-xs font-medium transition-colors"
              >
                Keep Subscription
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold transition-colors"
              >
                {actionLoading ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </PortalLayout>
  );
}
