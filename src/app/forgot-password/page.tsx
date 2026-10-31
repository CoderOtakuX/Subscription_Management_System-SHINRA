"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Timer } from "lucide-react";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Reset link dispatched!", `Sent recovery link to ${email}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col justify-between antialiased text-on-surface">
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-primary text-white font-black text-lg flex items-center justify-center">
            B
          </span>
          <span className="font-bold text-xl text-primary tracking-tight">Brightloop</span>
        </Link>
        <Link
          href="/login"
          className="text-body-sm font-semibold text-on-surface-variant hover:text-on-surface transition"
        >
          ← Back to Sign In
        </Link>
      </header>

      <main className="w-full flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-surface border border-outline grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-surface">
            <div>
              <div className="mb-6">
                <span className="font-caveat text-secondary text-lg font-bold -rotate-1 inline-block">
                  account recovery made easy ~
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface mt-1">
                  Forgot your password?
                </h1>
                <p className="text-body-sm text-on-surface-variant mt-1.5">
                  Enter your registered work email and we&apos;ll send you a secure link to reset it.
                </p>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-body-sm font-semibold text-on-surface mb-1.5">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="claire@bharatbilling.in"
                        className="w-full pl-10 pr-4 py-2.5 rounded-md bg-surface border border-outline text-base sm:text-body-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted pointer-events-none" />
                    </div>
                    <p className="text-xs text-on-surface-muted mt-1.5">
                      Must match the email linked to your Brightloop organization workspace.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-md bg-primary hover:bg-primary-hover text-on-primary font-bold text-body-md transition shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <span>{isLoading ? "Sending link..." : "Send reset link"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="p-5 rounded-xl bg-secondary-container/40 border border-secondary/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-on-surface flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                      Check your inbox
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Dispatched
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">
                    We sent a secure password reset link to{" "}
                    <strong className="text-on-surface">{email}</strong>.
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-on-surface-muted">
                    <button
                      type="button"
                      onClick={() => toast.info("New reset link sent.")}
                      className="text-secondary font-semibold hover:underline"
                    >
                      Resend link
                    </button>
                    <span className="flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5" /> Link valid for 15 minutes
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-outline flex items-center justify-between text-body-sm">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </Link>
                <Link
                  href="/reset-password?token=demo-token-123"
                  className="text-xs text-on-surface-muted hover:text-primary underline"
                >
                  (Demo: Test Reset Form)
                </Link>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-on-surface-muted">
              <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
              <span>Links expire after initial redemption or 15 minutes of inactivity.</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary via-primary-hover to-on-primary-container p-10 flex-col justify-between text-white">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider">
                Enterprise Security
              </span>
              <h2 className="text-2xl font-bold leading-snug">
                Encrypted token dispatch with automatic brute-force prevention.
              </h2>
              <p className="text-white/80 text-body-sm leading-relaxed">
                If your account has SSO or SAML enabled, contact your workspace administrator directly.
              </p>
            </div>

            <div className="text-xs text-white/60">
              © 2026 Brightloop Technologies Private Limited
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-xs text-on-surface-muted">
        Brightloop Platform · Enterprise Account Protection
      </footer>
    </div>
  );
}
