"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BackOfficeLayout } from "@/components/layouts/back-office-layout";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { MoneyText } from "@/components/ui/money-text";
import { DateText } from "@/components/ui/date-text";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { getCustomers, createCustomer, getInvoices, getSubscriptions } from "@/lib/services/api";
import { Customer, Invoice, Subscription } from "@/types/database";
import {
  Users,
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  CreditCard,
  Receipt,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function CustomersPage() {
  const toast = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [isNewCustModalOpen, setIsNewCustModalOpen] = useState(false);

  // New Customer Form State
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstin, setGstin] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [postalCode, setPostalCode] = useState("400051");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [custList, invList, subList] = await Promise.all([
          getCustomers(),
          getInvoices(),
          getSubscriptions(),
        ]);
        setCustomers(custList);
        setInvoices(invList);
        setSubscriptions(subList);
        if (custList.length > 0) {
          setSelectedCustomer(custList[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchVal.toLowerCase()) ||
      c.contactName.toLowerCase().includes(searchVal.toLowerCase()) ||
      c.email.toLowerCase().includes(searchVal.toLowerCase())
  );

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCust = await createCustomer({
      companyName,
      contactName,
      email,
      phone,
      gstin,
      billingAddress: {
        street,
        city,
        state,
        postalCode,
        country: "India",
      },
      planTier: "Professional Monthly",
    });

    setCustomers([newCust, ...customers]);
    setSelectedCustomer(newCust);
    setIsNewCustModalOpen(false);
    toast.success("Customer Created", `Added ${newCust.companyName} to directory.`);

    // Reset Form
    setCompanyName("");
    setContactName("");
    setEmail("");
    setPhone("");
    setGstin("");
    setStreet("");
  };

  const customerInvoices = selectedCustomer
    ? invoices.filter((i) => i.customerId === selectedCustomer.id)
    : [];

  const customerSubs = selectedCustomer
    ? subscriptions.filter((s) => s.customerId === selectedCustomer.id)
    : [];

  return (
    <BackOfficeLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        <PageHeader
          title="Customer Accounts Directory"
          subtitle="Directory of Indian corporate accounts, GSTIN profiles, contract status, and invoice ledger."
          breadcrumbs={[
            { label: "Accounts", href: "/admin/customers" },
            { label: "Directory" },
          ]}
          actions={
            <button
              type="button"
              onClick={() => setIsNewCustModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-on-primary hover:bg-primary-hover font-bold text-body-sm shadow-xs min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Customer</span>
            </button>
          }
        />

        {/* 2-Pane Master-Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANE: Customer Master List (5 cols on lg) */}
          <div className="lg:col-span-5 bg-surface rounded-xl border border-outline p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-on-surface">Accounts List</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container font-bold text-on-surface-variant">
                  {filteredCustomers.length}
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted pointer-events-none" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search by company, contact, email..."
                className="w-full pl-9 pr-4 py-2 bg-surface border border-outline rounded-md text-base sm:text-body-md focus:ring-2 focus:ring-primary min-h-[44px]"
              />
            </div>

            {/* List Rows */}
            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {filteredCustomers.map((c) => {
                const isSelected = selectedCustomer?.id === c.id;
                const initials = c.companyName
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className={`p-3.5 rounded-lg border transition cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-primary-container/30 border-primary ring-1 ring-primary/40 shadow-xs"
                        : "bg-surface border-outline hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary-container text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {initials}
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-body-md text-on-surface truncate">
                          {c.companyName}
                        </p>
                        <p className="text-xs text-on-surface-muted truncate">{c.email}</p>
                        <span className="text-[11px] text-on-surface-variant font-mono mt-0.5 block">
                          GSTIN: {c.gstin}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <MoneyText amount={c.totalRevenue} className="font-bold text-body-sm block" />
                      {c.dueBalance > 0 ? (
                        <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                          ₹{c.dueBalance.toLocaleString("en-IN")} Due
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                          Settled
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANE: Selected Customer Details & Ledger (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {selectedCustomer ? (
              <>
                {/* Header Profile Card */}
                <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary text-white font-bold text-lg flex items-center justify-center shadow-xs">
                        {selectedCustomer.companyName.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-on-surface">
                          {selectedCustomer.companyName}
                        </h2>
                        <p className="text-xs text-on-surface-muted">
                          Primary Contact: {selectedCustomer.contactName} · {selectedCustomer.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/admin/subscriptions/new`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-on-primary font-semibold text-xs hover:bg-primary-hover self-start sm:self-auto min-h-[36px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Subscription</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-body-sm">
                    <div>
                      <span className="text-xs text-on-surface-muted uppercase font-semibold">
                        Phone &amp; Contact
                      </span>
                      <p className="font-medium text-on-surface mt-0.5">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-muted uppercase font-semibold">
                        GSTIN / Tax ID
                      </span>
                      <p className="font-mono font-medium text-on-surface mt-0.5">
                        {selectedCustomer.gstin}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-muted uppercase font-semibold">
                        Payment Terms
                      </span>
                      <p className="font-medium text-on-surface mt-0.5">
                        {selectedCustomer.defaultPaymentTerms}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-outline text-body-sm">
                    <span className="text-xs text-on-surface-muted uppercase font-semibold block mb-0.5">
                      Billing Address
                    </span>
                    <p className="text-on-surface-variant">
                      {selectedCustomer.billingAddress.street}, {selectedCustomer.billingAddress.city},{" "}
                      {selectedCustomer.billingAddress.state} – {selectedCustomer.billingAddress.postalCode},{" "}
                      {selectedCustomer.billingAddress.country}
                    </p>
                  </div>
                </div>

                {/* Active Subscriptions Card */}
                <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-outline">
                    <h3 className="font-bold text-on-surface flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-primary" />
                      <span>Active Subscriptions ({customerSubs.length})</span>
                    </h3>
                  </div>

                  {customerSubs.length === 0 ? (
                    <p className="text-body-sm text-on-surface-muted py-2">
                      No active recurring subscriptions linked to this customer account.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {customerSubs.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-4 bg-surface-container-low rounded-lg border border-outline flex items-center justify-between gap-3"
                        >
                          <div>
                            <Link
                              href={`/admin/subscriptions/${sub.id}`}
                              className="font-bold text-primary hover:underline"
                            >
                              {sub.number} – {sub.planName}
                            </Link>
                            <p className="text-xs text-on-surface-muted capitalize mt-0.5">
                              {sub.cadence} cycle · Next invoice: <DateText date={sub.nextInvoiceDate} />
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <MoneyText amount={sub.planPrice} className="font-bold text-base" />
                            <StatusBadge status={sub.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ledger of Invoices */}
                <div className="bg-surface rounded-xl border border-outline p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-on-surface flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-secondary" />
                    <span>Invoices Ledger ({customerInvoices.length})</span>
                  </h3>

                  {customerInvoices.length === 0 ? (
                    <p className="text-body-sm text-on-surface-muted py-2">
                      No invoice records found for this customer.
                    </p>
                  ) : (
                    <div className="divide-y divide-outline border border-outline rounded-lg overflow-hidden text-body-sm">
                      {customerInvoices.map((inv) => (
                        <div
                          key={inv.id}
                          className="p-3.5 bg-surface hover:bg-surface-container-low transition flex items-center justify-between gap-3"
                        >
                          <div>
                            <Link
                              href={`/admin/invoices/${inv.id}`}
                              className="font-bold text-primary hover:underline"
                            >
                              {inv.number}
                            </Link>
                            <p className="text-xs text-on-surface-muted">
                              Due: <DateText date={inv.dueDate} />
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <MoneyText amount={inv.totalAmount} className="font-bold" />
                            <StatusBadge status={inv.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 bg-surface rounded-xl border border-outline text-center text-on-surface-muted">
                Select an account from the left directory pane to view details.
              </div>
            )}
          </div>
        </div>

        {/* Modal: New Customer */}
        <Modal
          isOpen={isNewCustModalOpen}
          onClose={() => setIsNewCustModalOpen(false)}
          title="Add New Customer Account"
          description="Create a new Indian corporate client record with GSTIN compliance details."
        >
          <form onSubmit={handleCreateCustomer} className="space-y-4 py-2">
            <FormField
              label="Company Name"
              required
              placeholder="e.g. Bharat Tech Solutions"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Primary Contact Person"
                required
                placeholder="Priya Sharma"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
              <FormField
                label="Work Email Address"
                type="email"
                required
                placeholder="priya.sharma@bharattech.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Phone Number"
                required
                placeholder="+91 98111 78901"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <FormField
                label="GSTIN (15 Digits)"
                required
                placeholder="27AABCA9876G1Z2"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
              />
            </div>

            <FormField
              label="Street Address"
              required
              placeholder="Tower B, Outer Ring Road"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-3">
              <FormField
                label="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <FormField
                label="State"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <FormField
                label="PIN Code"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-outline flex gap-3">
              <button
                type="button"
                onClick={() => setIsNewCustModalOpen(false)}
                className="flex-1 py-2.5 px-4 border border-outline rounded-md font-semibold text-sm hover:bg-surface-container min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-hover shadow-md min-h-[44px]"
              >
                Create Account
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </BackOfficeLayout>
  );
}
