"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentRole } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  RefreshCw,
  Receipt,
  User,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const PORTAL_LINKS = [
  { label: "Overview", href: "/portal", icon: LayoutDashboard },
  { label: "My Subscriptions", href: "/portal/subscriptions", icon: RefreshCw },
  { label: "My Invoices", href: "/portal/invoices", icon: Receipt },
  { label: "Account Profile", href: "/portal/profile", icon: User },
];

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentRole = useCurrentRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    if (currentRole === "unauthenticated") {
      router.replace("/login");
    }
  }, [currentRole, router]);

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col antialiased text-on-surface">
      {/* Customer Portal Top Nav */}
      <header className="bg-surface border-b border-outline sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand */}
            <div className="flex items-center gap-8">
              <Link href="/portal" className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary text-white font-black text-lg flex items-center justify-center shadow-xs">
                  B
                </span>
                <span className="font-bold text-lg text-primary tracking-tight">
                  Brightloop
                </span>
                <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-container text-primary">
                  Customer Portal
                </span>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1">
                {PORTAL_LINKS.map((link) => {
                  const isActive =
                    link.href === "/portal"
                      ? pathname === "/portal"
                      : pathname.startsWith(link.href);
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2 rounded-md text-body-sm font-semibold transition min-h-[40px]",
                        isActive
                          ? "bg-primary text-on-primary shadow-xs"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: User info & Switch to Admin Backoffice */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-surface-container border border-outline text-on-surface-variant hover:text-primary transition min-h-[36px]"
              >
                <span>Switch to Back Office</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-outline">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-secondary font-bold text-xs flex items-center justify-center">
                  MD
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-body-sm font-semibold leading-none">Marcus Doe</p>
                  <p className="text-[11px] text-on-surface-muted mt-0.5">Nexus Enterprises</p>
                </div>
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md hover:bg-surface-container text-on-surface min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Open portal menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down / Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-outline bg-surface px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <div className="flex items-center justify-between py-2 border-b border-outline mb-2">
              <span className="text-body-sm font-bold text-on-surface">Customer Navigation</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {PORTAL_LINKS.map((link) => {
              const isActive =
                link.href === "/portal"
                  ? pathname === "/portal"
                  : pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-body-md font-medium min-h-[44px]",
                    isActive
                      ? "bg-primary text-on-primary font-semibold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-outline flex flex-col gap-2">
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-between text-body-sm font-semibold text-primary py-2"
              >
                <span>Switch to Back Office</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline py-6 text-center text-body-sm text-on-surface-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Brightloop Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-secondary font-medium">
              <ShieldCheck className="w-4 h-4" /> 256-Bit Encrypted & GST Compliant
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
