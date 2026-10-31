"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentRole, Role } from "@/lib/auth";
import { useToast } from "@/components/ui/toast";
import {
  ShieldCheck,
  UserCheck,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("anand.k@brightloop.in");
  const [password, setPassword] = useState("Bright@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuickDemo = (role: Role, demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword("Bright@2026");
    setErrorMessage("");
    toast.info(`Loaded demo credentials for ${role.toUpperCase()}`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      setCurrentRole(selectedRole);

      if (selectedRole === "customer") {
        toast.success("Welcome back!", "Signed in to Customer Portal.");
        router.push("/portal");
      } else {
        toast.success("Authentication Successful", `Welcome back, ${selectedRole.toUpperCase()}.`);
        router.push("/admin/dashboard");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col justify-between antialiased text-on-surface">
      {/* Top Navbar */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-primary text-white font-black text-lg flex items-center justify-center">
            B
          </span>
          <span className="font-bold text-xl text-primary tracking-tight">Brightloop</span>
        </Link>
        <Link
          href="/"
          className="text-body-sm font-semibold text-on-surface-variant hover:text-on-surface transition"
        >
          ← Back to Website
        </Link>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-surface border border-outline grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-surface">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
                    Welcome back
                  </h1>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    Log in to orchestrate subscriptions, invoices, and billing runs.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary-container text-primary text-xs font-bold uppercase tracking-wider">
                  2026 Ready
                </span>
              </div>

              {/* Quick Demo Switcher */}
              <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-secondary" /> Quick Demo Role Switcher:
                  </span>
                  <span className="font-caveat text-secondary text-base font-bold -rotate-1">
                    one-click fill
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo("admin", "anand.k@brightloop.in")}
                    className={`py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition border ${
                      selectedRole === "admin"
                        ? "bg-primary text-on-primary border-primary shadow-xs"
                        : "bg-surface text-on-surface border-outline hover:bg-surface-container"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo("staff", "neha.s@brightloop.in")}
                    className={`py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition border ${
                      selectedRole === "staff"
                        ? "bg-primary text-on-primary border-primary shadow-xs"
                        : "bg-surface text-on-surface border-outline hover:bg-surface-container"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Staff</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo("customer", "marcus.doe@nexusenterprises.in")}
                    className={`py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition border ${
                      selectedRole === "customer"
                        ? "bg-primary text-on-primary border-primary shadow-xs"
                        : "bg-surface text-on-surface border-outline hover:bg-surface-container"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Customer</span>
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-body-sm font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-md bg-surface border border-outline text-base sm:text-body-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-body-sm font-semibold text-on-surface">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-body-sm text-primary hover:underline font-semibold"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-md bg-surface border border-outline text-base sm:text-body-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-muted hover:text-on-surface"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-primary accent-primary"
                    />
                    <span className="text-body-sm text-on-surface-variant">
                      Remember me on this browser
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-md bg-primary hover:bg-primary-hover text-on-primary font-bold text-body-md transition shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <span>{isLoading ? "Signing in..." : "Sign in"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="mt-8 pt-6 border-t border-outline text-center text-body-sm text-on-surface-variant">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Create a Brightloop account
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary via-primary-hover to-on-primary-container p-10 flex-col justify-between text-white relative">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold tracking-wider uppercase">
                Warm Pragmatic SaaS
              </span>
              <h2 className="text-2xl font-bold leading-snug">
                Designed for high-velocity finance teams and subscription founders.
              </h2>
              <p className="text-white/80 text-body-sm leading-relaxed">
                Centralized automated recurring billing, GST invoices, aging receivables, and customer self-serve contracts.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>GST Compliant Invoicing</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero-Latency Automated Recurring Sweeps</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Indian Rupee & Multi-Entity Ledger</span>
              </div>
            </div>

            <div className="text-xs text-white/60">
              © 2026 Brightloop Technologies Private Limited · Bangalore, India
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-xs text-on-surface-muted">
        Brightloop Billing Platform v2.8 · 256-bit SSL Encrypted
      </footer>
    </div>
  );
}
