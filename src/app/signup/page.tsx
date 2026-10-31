"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordChecklist } from "@/components/ui/password-checklist";
import { useToast } from "@/components/ui/toast";
import { setCurrentRole } from "@/lib/auth";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const toast = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Existing registered emails list to demonstrate duplicate email error
  const existingEmails = [
    "anand.k@brightloop.in",
    "neha.s@brightloop.in",
    "marcus.doe@nexusenterprises.in",
    "claire@bharatbilling.in",
  ];

  const isDuplicateEmail = email.trim() !== "" && existingEmails.includes(email.trim().toLowerCase());
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setValidationError("Please fill in all required fields.");
      return;
    }

    if (isDuplicateEmail) {
      setValidationError("This email address is already registered in our system.");
      return;
    }

    if (password.length <= 8) {
      setValidationError("Password must be more than 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setValidationError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setValidationError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setValidationError("Password must contain at least one special character.");
      return;
    }

    if (!passwordsMatch) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setValidationError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setCurrentRole("admin");
      toast.success("Account Created!", "Welcome to Brightloop. Your 14-day trial is active.");
      router.push("/admin/dashboard");
    }, 700);
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
              <div className="mb-6">
                <span className="font-caveat text-amber-900 text-lg font-bold -rotate-1 inline-block">
                  simpler subscriptions, happier finance ~
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface mt-1">
                  Get started with Brightloop
                </h1>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Free 14-day trial. No credit card required.
                </p>
              </div>

              {validationError && (
                <div className="p-3 mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-body-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Vikram Sengupta"
                      className="w-full pl-10 pr-4 py-2.5 rounded-md bg-surface border border-outline text-base sm:text-body-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted pointer-events-none" />
                  </div>
                </div>

                {/* Work Email */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-body-sm font-semibold text-on-surface">
                      Work Email
                    </label>
                    {isDuplicateEmail && (
                      <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Already registered
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@company.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-md bg-surface border text-base sm:text-body-md focus:outline-none focus:ring-2 min-h-[44px] ${
                        isDuplicateEmail
                          ? "border-red-500 bg-red-50/40 focus:ring-red-500"
                          : "border-outline focus:ring-primary"
                      }`}
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted pointer-events-none" />
                  </div>

                  {isDuplicateEmail && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 leading-normal flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        This email is already in use.{" "}
                        <Link href="/login" className="font-bold underline hover:text-red-950">
                          Sign in instead
                        </Link>{" "}
                        or{" "}
                        <Link href="/forgot-password" className="font-bold underline hover:text-red-950">
                          reset password
                        </Link>
                        .
                      </div>
                    </div>
                  )}
                </div>

                {/* Password with Live Rules Checklist */}
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter a secure password..."
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

                  {/* Live Password Checklist */}
                  <div className="mt-2">
                    <PasswordChecklist password={password} />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-body-sm font-semibold text-on-surface">
                      Confirm Password
                    </label>
                    {passwordsMatch && (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Repeat password..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-md bg-surface border border-outline text-base sm:text-body-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted pointer-events-none" />
                  </div>
                </div>

                {/* Terms Consent */}
                <div className="pt-2 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-on-surface-variant leading-relaxed cursor-pointer">
                    I agree to the Brightloop Master Services Agreement, Privacy Policy, and automated GST compliance processing.
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading || isDuplicateEmail}
                  className="w-full py-3 px-4 rounded-md bg-primary hover:bg-primary-hover disabled:opacity-50 text-on-primary font-bold text-body-md transition shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <span>{isLoading ? "Setting up account..." : "Create Account & Start Trial"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="mt-8 pt-6 border-t border-outline text-center text-body-sm text-on-surface-variant">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          {/* Right Column: Information Panel */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary via-primary-hover to-on-primary-container p-10 flex-col justify-between text-white">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold tracking-wider uppercase">
                Zero Configuration
              </span>
              <h2 className="text-2xl font-bold leading-snug">
                Set up recurring subscriptions in under 4 minutes.
              </h2>
              <p className="text-white/80 text-body-sm leading-relaxed">
                Connect your business, import customers, configure daily or annual billing schedules, and let our engine handle dunning.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/20">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-body-sm">Indian GST Automation</h4>
                  <p className="text-xs text-white/70">Calculates CGST/SGST/IGST automatically based on customer state.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/20">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-body-sm">Quotation-to-Subscription</h4>
                  <p className="text-xs text-white/70">Send quotes with validity days. Automatically convert to live subscriptions upon acceptance.</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-white/60">
              © 2026 Brightloop Technologies Private Limited
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-xs text-on-surface-muted">
        Brightloop Billing Platform · 256-bit SSL Encrypted
      </footer>
    </div>
  );
}
