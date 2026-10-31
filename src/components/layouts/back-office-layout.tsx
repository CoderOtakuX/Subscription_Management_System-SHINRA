"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentRole, setCurrentRole, Role } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  RefreshCw,
  Receipt,
  Users,
  Package,
  Layers,
  FileText,
  CreditCard,
  BarChart3,
  Zap,
  Percent,
  Tag,
  UserCheck,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
  Sliders,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, roles: ["admin", "staff"] },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: RefreshCw, roles: ["admin", "staff"] },
  { label: "Invoices", href: "/admin/invoices", icon: Receipt, roles: ["admin", "staff"] },
  { label: "Customers", href: "/admin/customers", icon: Users, roles: ["admin", "staff"] },
  { label: "Products", href: "/admin/products", icon: Package, roles: ["admin", "staff"] },
  { label: "Plans", href: "/admin/plans", icon: Layers, roles: ["admin", "staff"] },
  { label: "Quotation Templates", href: "/admin/quotation-templates", icon: FileText, roles: ["admin", "staff"] },
  { label: "Payments", href: "/admin/payments", icon: CreditCard, roles: ["admin", "staff"] },
  { label: "Reports", href: "/admin/reports", icon: BarChart3, roles: ["admin", "staff"] },
  { label: "Run Billing", href: "/admin/run-billing", icon: Zap, roles: ["admin", "staff"], badge: "Engine" },
  { label: "Taxes", href: "/admin/taxes", icon: Percent, roles: ["admin"], badge: "Admin" },
  { label: "Discounts", href: "/admin/discounts", icon: Tag, roles: ["admin"], badge: "Admin" },
  { label: "Staff", href: "/admin/staff", icon: UserCheck, roles: ["admin"], badge: "Admin" },
];

export function BackOfficeLayout({ children }: { children: React.ReactNode }) {
  const currentRole = useCurrentRole();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    if (currentRole === "unauthenticated") {
      router.replace("/login");
    }
  }, [currentRole, router]);

  // Filter items by current role
  const visibleNav = NAV_ITEMS.filter((item) => item.roles.includes(currentRole));

  // Customer cannot view back office, staff cannot view admin-only routes
  const isCustomerOnAdmin = currentRole === "customer";
  const currentItem = NAV_ITEMS.find((item) => pathname.startsWith(item.href) || pathname === item.href.replace("/admin", ""));
  const isUnauthorized = isCustomerOnAdmin || (currentItem && !currentItem.roles.includes(currentRole));

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col antialiased text-on-surface">
      {/* Mobile Header (below lg) */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-outline sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-md hover:bg-surface-container min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary text-white font-black text-lg flex items-center justify-center shadow-xs">
              B
            </span>
            <span className="font-bold text-lg text-primary tracking-tight">
              Brightloop
            </span>
          </Link>
        </div>

        {/* Quick Role Switcher Pill */}
        <div className="flex items-center gap-2">
          <select
            aria-label="Role switcher"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as Role)}
            className="text-xs font-semibold py-1.5 px-2.5 rounded-full bg-surface-container border border-outline text-on-surface min-h-[36px]"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </header>

      {/* Main Backoffice Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (lg and above) */}
        <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-outline shrink-0">
          {/* Logo & Brand */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-outline">
            <div className="w-9 h-9 rounded-lg bg-primary text-white font-black text-xl flex items-center justify-center shadow-sm">
              B
            </div>
            <div>
              <span className="font-bold text-lg text-primary tracking-tight block leading-tight">
                Brightloop
              </span>
              <span className="text-[11px] text-on-surface-muted font-medium">
                Billing & Subscriptions
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {visibleNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-body-sm font-medium transition min-h-[40px] group",
                    isActive
                      ? "bg-primary text-on-primary font-semibold shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-on-primary" : "text-on-surface-muted group-hover:text-on-surface"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-surface-container text-on-surface-variant"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Shortcuts & Role Pill */}
          <div className="p-4 border-t border-outline bg-surface-container-low space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface-variant">Active Role:</span>
              <select
                aria-label="Active workspace role"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as Role)}
                className="text-xs font-bold py-1 px-2 rounded bg-surface border border-outline text-primary min-h-[30px]"
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <div className="pt-2 border-t border-outline/60 flex flex-col gap-1.5 text-xs text-on-surface-variant">
              <Link
                href="/portal"
                className="flex items-center justify-between p-1.5 rounded hover:bg-surface hover:text-primary transition"
              >
                <span>Customer Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dev/components"
                className="flex items-center justify-between p-1.5 rounded hover:bg-surface hover:text-primary transition"
              >
                <span>Design Tokens & UI</span>
                <Sliders className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* User profile */}
            <div className="flex items-center gap-3 pt-2 border-t border-outline/60">
              <div className="w-8 h-8 rounded-full bg-primary-container text-primary font-bold text-xs flex items-center justify-center">
                AK
              </div>
              <div className="overflow-hidden">
                <p className="text-body-sm font-semibold truncate leading-none">Anand K.</p>
                <p className="text-[11px] text-on-surface-muted truncate mt-0.5 capitalize">
                  {currentRole} Account
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Slide-in Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-72 max-w-[80vw] bg-surface h-full shadow-2xl flex flex-col z-10 border-r border-outline">
              <div className="p-4 border-b border-outline flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-primary text-white font-black text-lg flex items-center justify-center">
                    B
                  </span>
                  <span className="font-bold text-lg text-primary">Brightloop</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {visibleNav.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-md text-body-md font-medium min-h-[44px]",
                        isActive
                          ? "bg-primary text-on-primary font-semibold"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant uppercase">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-outline bg-surface-container-low space-y-2">
                <Link
                  href="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-body-sm font-medium text-primary py-2"
                >
                  <span>Customer Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  href="/dev/components"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-body-sm font-medium text-primary py-2"
                >
                  <span>Design Components</span>
                  <Sliders className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {isUnauthorized ? (
            <div className="max-w-xl mx-auto my-12 p-8 bg-surface border border-red-200 rounded-xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-on-surface">Access Restricted (403)</h1>
              <p className="text-body-md text-on-surface-variant">
                This page is restricted to Admin role. Your current simulated role is{" "}
                <span className="font-semibold text-primary capitalize">{currentRole}</span>.
              </p>
              <button
                type="button"
                onClick={() => setCurrentRole("admin")}
                className="px-4 py-2 bg-primary text-on-primary rounded-md font-semibold text-sm hover:bg-primary-hover min-h-[44px]"
              >
                Switch to Admin Role
              </button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
