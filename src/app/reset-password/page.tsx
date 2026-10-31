"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordChecklist } from "@/components/ui/password-checklist";
import { useToast } from "@/components/ui/toast";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ArrowLeft, ShieldAlert } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const toast = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isStrong = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStrong) {
      toast.error("Password too weak", "Please satisfy all password requirements.");
      return;
    }
    if (!passwordsMatch) {
      toast.error("Mismatch", "Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success("Password Updated", "You can now log in with your new credentials.");
    }, 700);
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
                <span className="font-caveat text-amber-900 text-lg font-bold -rotate-1 inline-block">
                  secure your workspace credentials ~
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface mt-1">
                  Set a new password
                </h1>
                <p className="text-body-sm text-on-surface-variant mt-1.5">
                  Create a strong, unique password for your Brightloop account.
                </p>
              </div>

              {!isSuccess ? (
                <form onSubmit={handleReset} className="space-y-4">
                  {/* New Password */}
                  <div>
                    <label className="block text-body-sm font-semibold text-on-surface mb-1.5">
                      New Password
                    </label>
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
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-muted hover:text-on-surface"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="mt-2">
                      <PasswordChecklist password={password} />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-body-sm font-semibold text-on-surface">
                        Confirm New Password
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
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-md bg-surface border border-outline text-base sm:text-body-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                      />
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !isStrong || !passwordsMatch}
                    className="w-full py-3 px-4 rounded-md bg-primary hover:bg-primary-hover disabled:opacity-50 text-on-primary font-bold text-body-md transition shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <span>{isLoading ? "Updating password..." : "Update password"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-950">Password successfully updated!</h3>
                    <p className="text-body-sm text-emerald-800 mt-1">
                      Your workspace password has been updated. You can now log in securely.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-hover transition"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-outline">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-body-sm text-primary font-semibold hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary via-primary-hover to-on-primary-container p-10 flex-col justify-between text-white">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider">
                Credential Security
              </span>
              <h2 className="text-2xl font-bold leading-snug">
                Protecting your billing operations.
              </h2>
              <p className="text-white/80 text-body-sm leading-relaxed">
                Choose a strong password that you do not reuse across other SaaS providers.
              </p>
            </div>

            <div className="text-xs text-white/60">
              © 2026 Brightloop Technologies Private Limited
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-xs text-on-surface-muted">
        Brightloop Platform · 256-bit SSL Encrypted
      </footer>
    </div>
  );
}
