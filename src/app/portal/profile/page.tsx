"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layouts/portal-layout";
import { FormField } from "@/components/ui/form-field";
import { PasswordChecklist } from "@/components/ui/password-checklist";
import { useToast } from "@/components/ui/toast";
import {
  User,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Save,
  CheckCircle2,
  KeyRound,
  CreditCard,
  MapPin,
} from "lucide-react";

export default function CustomerProfilePage() {
  const { toast } = useToast();

  // Profile Information
  const [profile, setProfile] = useState({
    fullName: "Marcus Vance",
    email: "marcus.vance@bharattech.in",
    phone: "+91 98200 12345",
    companyName: "Bharat Technologies Private Limited",
    gstin: "27AAAAA0000A1Z5",
    street: "Unit 402, Trade World B, Kamla Mills",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400013",
    country: "India",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Update
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      toast("Profile Updated", {
        description: "Company details and GSTIN registered on active tax invoice profile.",
        variant: "success",
      });
    }, 600);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast("Password Mismatch", {
        description: "New password and confirmation do not match.",
        variant: "error",
      });
      return;
    }
    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast("Password Changed", {
        description: "Your portal credentials have been updated securely.",
        variant: "success",
      });
    }, 800);
  };

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-secondary mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="uppercase tracking-wider">Workspace Settings</span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">
              Account & Security Profile
            </h1>
            <p className="text-sm text-text-muted mt-1 max-w-xl">
              Manage your company information, GST credentials, billing address, and portal security.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-surface border border-outline px-4 py-2 rounded-xl shadow-xs self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-xs font-bold text-on-surface">Account Status: Enterprise Priority</span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Personal & Company Info (7 Cols) */}
          <section className="lg:col-span-7 space-y-6">
            <div className="bg-surface border border-outline rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-6 border-b border-outline">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-on-surface">
                      Company & Statutory Information
                    </h2>
                    <p className="text-xs text-text-muted">
                      Invoicing metadata formatted for statutory Indian GST e-Invoicing compliance.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-badge-active-bg text-secondary text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> GSTIN Verified
                </span>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Full Name" required>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface-container text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </FormField>

                  <FormField label="Business Email" required>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface-container text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Phone Number" required>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface-container text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </FormField>

                  <FormField label="Company Legal Name" required>
                    <input
                      type="text"
                      value={profile.companyName}
                      onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface-container text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </FormField>
                </div>

                <FormField label="GSTIN (Goods and Services Tax Number)" description="15-digit Pan-India GST registration number." required>
                  <input
                    type="text"
                    value={profile.gstin}
                    onChange={(e) => setProfile({ ...profile, gstin: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface-container text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-mono uppercase"
                    required
                  />
                </FormField>

                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                    Registered Billing Address
                  </h3>
                  <div className="space-y-4">
                    <FormField label="Street Address" required>
                      <input
                        type="text"
                        value={profile.street}
                        onChange={(e) => setProfile({ ...profile, street: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface-container text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </FormField>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <FormField label="City" required>
                        <input
                          type="text"
                          value={profile.city}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface-container text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </FormField>

                      <FormField label="State" required>
                        <input
                          type="text"
                          value={profile.state}
                          onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface-container text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </FormField>

                      <FormField label="Postal Code" required>
                        <input
                          type="text"
                          value={profile.postalCode}
                          onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface-container text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-mono"
                          required
                        />
                      </FormField>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-plum-hover font-semibold text-xs transition-colors shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingProfile ? "Saving Details..." : "Save Company Details"}</span>
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Right Column: Security & Credentials (5 Cols) */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-surface border border-outline rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 pb-6 border-b border-outline">
                <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-on-surface">Security & Password</h2>
                  <p className="text-xs text-text-muted">
                    Update your account authentication credentials.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePassword} className="space-y-4 pt-6">
                <FormField label="Current Password" required>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface-container text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </FormField>

                <FormField label="New Password" required>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface-container text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </FormField>

                <PasswordChecklist password={newPassword} />

                <FormField label="Confirm New Password" required>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface-container text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </FormField>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-secondary text-white hover:bg-secondary-hover font-semibold text-xs transition-colors shadow-xs"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{savingPassword ? "Updating Password..." : "Update Password"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Session Security Card */}
            <div className="p-5 rounded-2xl bg-surface-container border border-outline/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>Multi-Factor Authentication</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Your enterprise account has Hardware Key / Authenticator App MFA enabled for login verification.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </PortalLayout>
  );
}
