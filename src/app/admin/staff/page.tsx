"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { useCurrentRole, setCurrentRole } from "@/lib/auth";
import { getStaffMembers, inviteStaffMember } from "@/lib/services/api";
import { StaffMember } from "@/types/database";
import {
  Users,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Download,
  Mail,
  MoreVertical,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export default function StaffManagementPage() {
  const role = useCurrentRole();
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    role: "staff" as "admin" | "staff",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getStaffMembers();
        setStaff(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    setSaving(true);
    try {
      const created = await inviteStaffMember({
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
      });

      setStaff([created, ...staff]);
      setIsModalOpen(false);
      setNewStaff({ name: "", email: "", role: "staff" });
      toast("Invitation Dispatched", {
        description: `Invitation link sent to ${created.email} with ${created.role.toUpperCase()} privileges.`,
        variant: "success",
      });
    } catch (err) {
      toast("Invitation Failed", {
        description: "Could not send invitation email. Please check address format.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // If role is not admin, show RBAC Guard
  if (role !== "admin") {
    return (
      <BackOfficeLayout>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-badge-overdue-bg text-badge-overdue-text flex items-center justify-center mb-6 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 rounded-full bg-badge-overdue-bg text-badge-overdue-text font-bold text-xs uppercase tracking-wider mb-2">
            Admin Access Only
          </span>
          <h1 className="text-2xl font-bold text-on-surface">Staff Management Restricted</h1>
          <p className="text-sm text-text-muted mt-2 leading-relaxed">
            Only workspace administrators have security clearance to invite staff, assign RBAC permissions, or revoke workspace credentials.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                setCurrentRole("admin");
                toast("Role Switched to Admin", {
                  description: "You now have full administrative privileges.",
                  variant: "success",
                });
              }}
              className="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-plum-hover font-semibold text-xs transition-colors shadow-sm"
            >
              Switch to Admin Role
            </button>
            <Link
              href="/admin/dashboard"
              className="px-5 py-2.5 rounded-lg border border-outline text-on-surface hover:bg-surface-container font-medium text-xs transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </BackOfficeLayout>
    );
  }

  const columns: Column<StaffMember>[] = [
    {
      header: "Team Member",
      accessorKey: "name",
      cell: (member) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-container text-primary font-bold text-xs flex items-center justify-center">
            {member.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-on-surface text-sm">{member.name}</span>
            <span className="text-xs text-text-muted">{member.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Role Permission",
      accessorKey: "role",
      cell: (member) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            member.role === "admin"
              ? "bg-badge-confirmed-bg text-badge-confirmed-text"
              : "bg-surface-container text-on-surface"
          }`}
        >
          {member.role === "admin" && <ShieldCheck className="w-3 h-3" />}
          {member.role}
        </span>
      ),
    },
    {
      header: "MFA Status",
      accessorKey: "twoFactorEnabled",
      cell: (member) => (
        <span
          className={`text-xs font-semibold ${
            member.twoFactorEnabled ? "text-secondary" : "text-text-muted"
          }`}
        >
          {member.twoFactorEnabled ? "✓ Enforced" : "Pending Setup"}
        </span>
      ),
    },
    {
      header: "Last Active",
      accessorKey: "lastActive",
      cell: (member) => (
        <span className="text-xs text-text-muted">{member.lastActive}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (member) => <StatusBadge status={member.status} />,
    },
    {
      header: "Action",
      accessorKey: "id",
      className: "text-right",
      cell: (member) => (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setStaff(staff.filter((s) => s.id !== member.id));
              toast("Access Revoked", {
                description: `Workspace privileges revoked for ${member.name}.`,
                variant: "info",
              });
            }}
            title="Revoke Access"
            className="p-1.5 rounded-lg text-text-muted hover:text-rose-600 hover:bg-surface-container transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <BackOfficeLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Staff & Team Permissions"
          badge="Admin Access Only"
          subtitle="Manage billing workspace collaborators, role assignments, and security audit credentials."
          breadcrumbs={[
            { label: "Settings" },
            { label: "Staff & Permissions", href: "/admin/staff" },
          ]}
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  toast("Audit Log Exported", {
                    description: "Security credentials audit log exported as CSV.",
                    variant: "info",
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-outline hover:bg-surface-container text-on-surface text-sm font-medium transition-colors shadow-xs"
              >
                <Download className="w-4 h-4 text-text-muted" />
                <span>Audit Log (.CSV)</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-plum-hover text-sm font-semibold transition-all shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Staff Member</span>
              </button>
            </div>
          }
        />

        {/* Security Locked Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-surface border border-outline p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-on-surface">
                    Workspace Security Policy & RBAC Active
                  </h3>
                  <span className="text-[11px] text-secondary font-medium">
                    Strict RBAC security enforced across billing ledgers
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1 max-w-2xl leading-relaxed">
                  Only workspace administrators can invite staff, modify billing roles, or revoke API access. Non-admin team members operate in strictly scoped staff mode.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-outline/50">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="text-xs font-semibold text-on-surface">
                  Session: Claire L. (Root Admin)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-on-surface">Workspace Collaborators</h3>
              <p className="text-xs text-text-muted mt-0.5">
                {staff.length} active seats authorized for financial operations.
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={staff}
            loading={loading}
            keyExtractor={(s) => s.id}
            pageSize={10}
            emptyTitle="No staff members registered"
            emptyDescription="Invite your team members to collaborate on billing operations."
          />
        </div>

        {/* Invite Staff Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Invite Workspace Collaborator"
          description="Grant administrative or operational staff privileges to a team member."
        >
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <FormField label="Full Name" required>
              <input
                type="text"
                placeholder="e.g. Vikramaditya Sen"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                required
              />
            </FormField>

            <FormField label="Corporate Work Email" required>
              <input
                type="email"
                placeholder="v.sen@enterprise.in"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                required
              />
            </FormField>

            <FormField label="Assigned Role & Privilege Level" required>
              <select
                value={newStaff.role}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, role: e.target.value as "admin" | "staff" })
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline bg-surface text-on-surface text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-semibold"
              >
                <option value="staff">Staff Operator (Subscriptions, Invoices, Customers)</option>
                <option value="admin">Administrator (Full Access + Discounts + Staff Management)</option>
              </select>
            </FormField>

            <div className="p-3 rounded-lg bg-surface-container border border-outline/50 text-xs text-text-muted">
              Note: Staff members cannot modify statutory GST tax slabs, invite new members, or manage discount vouchers.
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-plum-hover text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? "Sending Invitation..." : "Send Invitation"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </BackOfficeLayout>
  );
}
