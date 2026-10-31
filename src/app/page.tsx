"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Layers,
  BarChart3,
  Check,
  Building2,
  Lock,
} from "lucide-react";
import { formatINR } from "@/lib/format";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-bright flex flex-col antialiased text-on-surface">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-outline shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary text-white font-black text-lg flex items-center justify-center shadow-xs">
                B
              </span>
              <span className="font-bold text-xl text-primary tracking-tight">
                Brightloop
              </span>
            </Link>
            <span className="hidden sm:inline-block font-caveat text-xl text-amber-900 font-bold -rotate-3 select-none ml-2">
              billing made delightful
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-body-sm font-semibold text-on-surface-variant">
            <a href="#features" className="hover:text-primary transition">
              Platform Features
            </a>
            <a href="#pricing" className="hover:text-primary transition">
              Pricing Plans
            </a>
            <Link href="/admin/dashboard" className="text-secondary hover:text-secondary-hover transition">
              Back Office Demo
            </Link>
            <Link href="/portal" className="hover:text-primary transition">
              Customer Portal
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-body-sm font-semibold text-on-surface-variant hover:text-on-surface transition px-3 py-2 min-h-[44px] flex items-center"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-on-primary font-semibold text-body-sm hover:bg-primary-hover shadow-xs transition min-h-[44px]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 pt-24 pb-16">
        <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12 lg:py-20 max-w-7xl mx-auto">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-container text-primary text-body-sm font-semibold shadow-xs mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Modern SaaS Subscription Workspace for 2026</span>
            </div>

            {/* Headline with Yellow Highlight */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tight leading-tight sm:leading-none mb-6">
              Run every subscription in{" "}
              <span className="relative inline-block px-2 text-on-surface whitespace-nowrap">
                <span className="relative z-10">one place</span>
                <span className="absolute inset-x-0 bottom-1.5 h-4 bg-marker-yellow/60 -rotate-1 rounded -z-0" />
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
              Simple, automated, yet delightfully powerful recurring billing, GST-compliant invoicing, and quotation workflows for modern businesses.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-on-primary hover:bg-primary-hover font-bold text-base transition shadow-md group min-h-[48px]"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admin/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white border border-outline text-on-surface hover:bg-surface-container font-semibold text-base transition shadow-xs min-h-[48px]"
              >
                <Calendar className="w-4 h-4 text-on-surface-variant" />
                <span>Explore Live Back Office</span>
              </Link>
            </div>

            {/* Trust Mini-bar */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-body-sm text-on-surface-variant font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-secondary" /> Instant Razorpay & Mandate Sync
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-secondary" /> Automated GST & E-Invoicing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-secondary" /> Open REST APIs & Webhooks
              </span>
            </div>

            {/* Live Interactive Hero Dashboard Mockup */}
            <div className="mt-12 w-full rounded-2xl bg-surface border border-outline shadow-xl overflow-hidden p-2 sm:p-4 text-left">
              <div className="bg-surface-container-low rounded-lg p-3 flex items-center justify-between border-b border-outline mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  <span className="ml-2 text-xs font-mono text-on-surface-muted">
                    app.brightloop.io/admin/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Live Engine Pipeline
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface p-4 rounded-xl border border-outline">
                  <div className="text-xs font-semibold text-on-surface-muted uppercase">
                    Monthly Recurring Revenue
                  </div>
                  <div className="text-2xl font-bold text-on-surface mt-1">
                    {formatINR(8640000)}
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs last month
                  </div>
                </div>

                <div className="bg-surface p-4 rounded-xl border border-outline">
                  <div className="text-xs font-semibold text-on-surface-muted uppercase">
                    Active Contracts
                  </div>
                  <div className="text-2xl font-bold text-on-surface mt-1">
                    1,428 Subscribers
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 98.4% Retention
                  </div>
                </div>

                <div className="bg-surface p-4 rounded-xl border border-outline">
                  <div className="text-xs font-semibold text-on-surface-muted uppercase">
                    Overdue Receivables
                  </div>
                  <div className="text-2xl font-bold text-red-600 mt-1">
                    {formatINR(240300)}
                  </div>
                  <div className="font-caveat text-amber-700 font-bold text-sm mt-0.5">
                    Auto-dunning active for 4 accounts ⚡
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section id="features" className="py-16 bg-white border-y border-outline">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Powerful Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">
                Everything required to bill, collect, and scale
              </h2>
              <p className="text-body-md text-on-surface-variant">
                From quotation templates and automated recurring billing runs to customer self-service portals and staff RBAC.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl border border-outline bg-surface-bright space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary-container text-primary flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-on-surface">Automated Billing Runs</h3>
                <p className="text-body-sm text-on-surface-variant">
                  Execute recurring invoice batches across daily, weekly, monthly, and yearly cycles. Complete audit histories and failure retry mechanisms.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-outline bg-surface-bright space-y-3">
                <div className="w-12 h-12 rounded-lg bg-secondary-container text-secondary flex items-center justify-center font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-on-surface">Product & Brand Variants</h3>
                <p className="text-body-sm text-on-surface-variant">
                  Configure recurring subscription plans, minimum quantities, availability windows, and brand variant price surcharges effortlessly.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-outline bg-surface-bright space-y-3">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-on-surface">Receivables Aging & Reports</h3>
                <p className="text-body-sm text-on-surface-variant">
                  Categorize outstanding debt across 30, 60, 90+ day aging buckets with one-click dunning reminders and automated statement generation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers Section */}
        <section id="pricing" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Clear Indian Rupee Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">
              Predictable plans that grow with your volume
            </h2>
            <p className="text-body-md text-on-surface-variant">
              No hidden gateway surcharges. All plans include automated GST e-invoicing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="p-8 rounded-2xl border border-outline bg-surface flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <span className="text-body-sm font-bold text-on-surface-muted uppercase">Starter</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-on-surface">{formatINR(2400)}</span>
                  <span className="text-body-sm text-on-surface-muted">/month</span>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  For growing startups with up to 100 active subscriptions.
                </p>
                <ul className="space-y-2.5 pt-4 border-t border-outline text-body-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" /> Up to 100 Active Subscriptions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" /> GST Invoice Generation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" /> UPI & Card Payment Gateway
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="mt-8 w-full py-3 rounded-md border border-outline bg-surface font-semibold text-center hover:bg-surface-container transition min-h-[44px]"
              >
                Choose Starter
              </Link>
            </div>

            {/* Professional Plan (Highlighted) */}
            <div className="p-8 rounded-2xl border-2 border-primary bg-surface relative flex flex-col justify-between shadow-lg ring-4 ring-primary-container/40">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div className="space-y-4">
                <span className="text-body-sm font-bold text-primary uppercase">Professional</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-on-surface">{formatINR(7200)}</span>
                  <span className="text-body-sm text-on-surface-muted">/month</span>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  Full billing automation for expanding software companies.
                </p>
                <ul className="space-y-2.5 pt-4 border-t border-outline text-body-sm">
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-primary" /> Up to 1,000 Active Contracts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Automated Dunning & Retries
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Quotation Template Presets
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Customer Self-Serve Portal
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="mt-8 w-full py-3 rounded-md bg-primary text-on-primary font-bold text-center hover:bg-primary-hover shadow-xs transition min-h-[44px]"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-2xl border border-outline bg-surface flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <span className="text-body-sm font-bold text-on-surface-muted uppercase">Enterprise</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-on-surface">Custom</span>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  High-volume enterprises, custom integrations, and dedicated Enterprise Support.
                </p>
                <ul className="space-y-2.5 pt-4 border-t border-outline text-body-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" /> Unlimited Subscriptions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" /> Dedicated Database & VPC Peering
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" /> Multi-Entity Indian GSTIN Support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" /> 24/7 Dedicated Support Engineer
                  </li>
                </ul>
              </div>
              <Link
                href="/login"
                className="mt-8 w-full py-3 rounded-md border border-outline bg-surface font-semibold text-center hover:bg-surface-container transition min-h-[44px]"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline py-12 text-on-surface-variant text-body-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-primary text-white font-black text-sm flex items-center justify-center">
              B
            </span>
            <span className="font-bold text-lg text-primary">Brightloop</span>
            <span className="text-xs text-on-surface-muted">© 2026 Brightloop Technologies Private Limited</span>
          </div>

          <div className="flex items-center gap-6 text-body-sm">
            <Link href="/login" className="hover:text-primary transition">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-primary transition">
              Sign Up
            </Link>
            <Link href="/admin/dashboard" className="hover:text-primary transition">
              Back Office
            </Link>
            <Link href="/portal" className="hover:text-primary transition">
              Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
