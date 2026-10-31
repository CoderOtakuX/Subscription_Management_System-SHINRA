import {
  MOCK_SUBSCRIPTIONS,
  MOCK_INVOICES,
  MOCK_CUSTOMERS,
  MOCK_PRODUCTS,
  MOCK_PLANS,
  MOCK_TEMPLATES,
  MOCK_PAYMENTS,
  MOCK_DISCOUNTS,
  MOCK_TAXES,
  MOCK_STAFF,
  MOCK_BILLING_RUNS,
  MOCK_DASHBOARD_KPIS,
  MOCK_REVENUE_CHART,
  MOCK_AGING_REPORT,
} from "@/lib/mock/fixtures";
import {
  Subscription,
  Invoice,
  Customer,
  Product,
  Plan,
  QuotationTemplate,
  Payment,
  Discount,
  TaxRule,
  StaffMember,
  BillingRun,
  DashboardKpi,
  RevenueDataPoint,
  AgingBucket,
} from "@/types/database";

/* ── Subscription Service ── */
export async function getSubscriptions(): Promise<Subscription[]> {
  return [...MOCK_SUBSCRIPTIONS];
}

export async function getSubscriptionById(id: string): Promise<Subscription | null> {
  const found = MOCK_SUBSCRIPTIONS.find(
    (s) => s.id === id || s.number.toLowerCase() === id.toLowerCase()
  );
  return found ? { ...found } : null;
}

export async function createSubscription(data: Partial<Subscription>): Promise<Subscription> {
  // TODO(service): Replace with Supabase insert
  const newSub: Subscription = {
    id: `sub-${Date.now()}`,
    number: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: data.customerId || "cust-01",
    customerName: data.customerName || "Nexus Enterprises India Private Limited",
    customerEmail: data.customerEmail || "contact@nexusenterprises.in",
    planId: data.planId || "plan-01",
    planName: data.planName || "Enterprise Core Annual",
    planPrice: data.planPrice || 240300,
    cadence: data.cadence || "yearly",
    status: data.status || "Draft",
    startDate: data.startDate || new Date().toISOString().split("T")[0],
    endDate: data.endDate || null,
    nextInvoiceDate: data.nextInvoiceDate || new Date().toISOString().split("T")[0],
    paymentTerms: data.paymentTerms || "Net 30 Days",
    mrr: data.mrr || 20025,
    billingCycle: 1,
    lines: data.lines || [],
    createdAt: new Date().toISOString().split("T")[0],
  };
  MOCK_SUBSCRIPTIONS.unshift(newSub);
  return newSub;
}

export async function updateSubscriptionStatus(
  id: string,
  status: Subscription["status"]
): Promise<Subscription | null> {
  // TODO(service): Replace with Supabase update
  const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === id || s.number === id);
  if (sub) {
    sub.status = status;
    return { ...sub };
  }
  return null;
}

/* ── Invoice Service ── */
export async function getInvoices(): Promise<Invoice[]> {
  return [...MOCK_INVOICES];
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const found = MOCK_INVOICES.find(
    (inv) => inv.id === id || inv.number.toLowerCase() === id.toLowerCase()
  );
  return found ? { ...found } : null;
}

export async function updateInvoiceStatus(
  id: string,
  status: Invoice["status"]
): Promise<Invoice | null> {
  // TODO(service): Replace with Supabase update
  const inv = MOCK_INVOICES.find((i) => i.id === id || i.number === id);
  if (inv) {
    inv.status = status;
    return { ...inv };
  }
  return null;
}

/* ── Customer Service ── */
export async function getCustomers(): Promise<Customer[]> {
  return [...MOCK_CUSTOMERS];
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const found = MOCK_CUSTOMERS.find((c) => c.id === id);
  return found ? { ...found } : null;
}

export async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  // TODO(service): Replace with Supabase insert
  const newCust: Customer = {
    id: `cust-${Date.now()}`,
    companyName: data.companyName || "New Enterprise Customer",
    contactName: data.contactName || "Contact Officer",
    email: data.email || "billing@enterprise.in",
    phone: data.phone || "+91 90000 00000",
    gstin: data.gstin || "27AAAAA0000A1Z5",
    billingAddress: data.billingAddress || {
      street: "Main Corporate Park",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    totalRevenue: 0,
    dueBalance: 0,
    activeSubscriptions: 0,
    planTier: "Professional Monthly",
    currency: "INR",
    defaultPaymentTerms: "Net 30 Days",
    createdAt: new Date().toISOString().split("T")[0],
  };
  MOCK_CUSTOMERS.unshift(newCust);
  return newCust;
}

/* ── Product & Variant Service ── */
export async function getProducts(): Promise<Product[]> {
  return [...MOCK_PRODUCTS];
}

export async function getProductById(id: string): Promise<Product | null> {
  const found = MOCK_PRODUCTS.find((p) => p.id === id);
  return found ? { ...found } : null;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  // TODO(service): Replace with Supabase upsert
  const existingIndex = MOCK_PRODUCTS.findIndex((p) => p.id === product.id);
  if (existingIndex >= 0) {
    MOCK_PRODUCTS[existingIndex] = { ...MOCK_PRODUCTS[existingIndex], ...product } as Product;
    return MOCK_PRODUCTS[existingIndex];
  }
  const newProd: Product = {
    id: `prod-${Date.now()}`,
    name: product.name || "New SaaS Product",
    sku: product.sku || `SKU-${Date.now()}`,
    productType: product.productType || "recurring",
    basePrice: product.basePrice || 10000,
    costPrice: product.costPrice || 2000,
    description: product.description || "",
    status: "active",
    activeSubscribers: 0,
    variants: product.variants || [],
    createdAt: new Date().toISOString().split("T")[0],
  };
  MOCK_PRODUCTS.unshift(newProd);
  return newProd;
}

/* ── Plan Service ── */
export async function getPlans(): Promise<Plan[]> {
  return [...MOCK_PLANS];
}

export async function getPlanById(id: string): Promise<Plan | null> {
  const found = MOCK_PLANS.find((p) => p.id === id);
  return found ? { ...found } : null;
}

export async function savePlan(plan: Partial<Plan>): Promise<Plan> {
  // TODO(service): Replace with Supabase upsert
  const existingIndex = MOCK_PLANS.findIndex((p) => p.id === plan.id);
  if (existingIndex >= 0) {
    MOCK_PLANS[existingIndex] = { ...MOCK_PLANS[existingIndex], ...plan } as Plan;
    return MOCK_PLANS[existingIndex];
  }
  const newPlan: Plan = {
    id: `plan-${Date.now()}`,
    name: plan.name || "New Subscription Plan",
    code: plan.code || `PLAN-${Date.now()}`,
    price: plan.price || 15000,
    currency: "INR",
    cadence: plan.cadence || "monthly",
    minQuantity: plan.minQuantity || 1,
    availabilityStart: plan.availabilityStart || null,
    availabilityEnd: plan.availabilityEnd || null,
    neverExpire: plan.neverExpire ?? true,
    autoClose: plan.autoClose ?? false,
    closableByCustomer: plan.closableByCustomer ?? true,
    pausable: plan.pausable ?? true,
    renewable: plan.renewable ?? true,
    status: "active",
    subscriberCount: 0,
    mrrGenerated: 0,
    linkedProducts: plan.linkedProducts || [],
    createdAt: new Date().toISOString().split("T")[0],
  };
  MOCK_PLANS.unshift(newPlan);
  return newPlan;
}

/* ── Quotation Template Service ── */
export async function getQuotationTemplates(): Promise<QuotationTemplate[]> {
  return [...MOCK_TEMPLATES];
}

export async function getQuotationTemplateById(id: string): Promise<QuotationTemplate | null> {
  const found = MOCK_TEMPLATES.find((t) => t.id === id);
  return found ? { ...found } : null;
}

/* ── Payments Service ── */
export async function getPayments(): Promise<Payment[]> {
  return [...MOCK_PAYMENTS];
}

export async function recordPayment(payment: Partial<Payment>): Promise<Payment> {
  // TODO(service): Replace with Supabase payment record
  const newPayment: Payment = {
    id: `pay-${Date.now()}`,
    transactionId: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    invoiceId: payment.invoiceId || "inv-00102",
    invoiceNumber: payment.invoiceNumber || "INV-00102",
    customerId: payment.customerId || "cust-01",
    customerName: payment.customerName || "Nexus Enterprises India Private Limited",
    method: payment.method || "UPI",
    amount: payment.amount || 283554,
    date: payment.date || new Date().toISOString().split("T")[0],
    status: "Successful",
    referenceCode: payment.referenceCode || `REF-${Date.now()}`,
    notes: payment.notes || "Recorded via Admin Console",
    createdAt: new Date().toISOString().split("T")[0],
  };
  MOCK_PAYMENTS.unshift(newPayment);
  return newPayment;
}

/* ── Discounts Service ── */
export async function getDiscounts(): Promise<Discount[]> {
  return [...MOCK_DISCOUNTS];
}

export async function createDiscount(discount: Partial<Discount>): Promise<Discount> {
  // TODO(service): Replace with Supabase insert
  const newDisc: Discount = {
    id: `disc-${Date.now()}`,
    code: (discount.code || "DISC26").toUpperCase(),
    description: discount.description || "Promotional Discount Rule",
    type: discount.type || "percentage",
    value: discount.value || 10,
    duration: discount.duration || "once",
    applicableScope: discount.applicableScope || "all",
    applicableIds: discount.applicableIds || [],
    maxRedemptions: discount.maxRedemptions || 100,
    currentRedemptions: 0,
    startDate: discount.startDate || new Date().toISOString().split("T")[0],
    endDate: discount.endDate || null,
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
  };
  MOCK_DISCOUNTS.unshift(newDisc);
  return newDisc;
}

/* ── Taxes Service ── */
export async function getTaxes(): Promise<TaxRule[]> {
  return [...MOCK_TAXES];
}

export async function saveTaxRule(tax: Partial<TaxRule>): Promise<TaxRule> {
  // TODO(service): Replace with Supabase insert
  const newTax: TaxRule = {
    id: `tax-${Date.now()}`,
    name: tax.name || "GST Rule",
    code: (tax.code || "GST_CUSTOM").toUpperCase(),
    rate: tax.rate || 18,
    calculationType: tax.calculationType || "percentage",
    applicableTo: tax.applicableTo || "all",
    jurisdiction: tax.jurisdiction || "India",
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
  };
  MOCK_TAXES.unshift(newTax);
  return newTax;
}

/* ── Staff Service ── */
export async function getStaffMembers(): Promise<StaffMember[]> {
  return [...MOCK_STAFF];
}

export async function inviteStaffMember(data: { name: string; email: string; role: "admin" | "staff" }): Promise<StaffMember> {
  // TODO(service): Replace with Supabase auth invitation
  const newStaff: StaffMember = {
    id: `staff-${Date.now()}`,
    name: data.name,
    email: data.email,
    role: data.role,
    status: "Invited",
    twoFactorEnabled: false,
    lastActive: "Never",
    createdAt: new Date().toISOString().split("T")[0],
  };
  MOCK_STAFF.unshift(newStaff);
  return newStaff;
}

/* ── Billing Engine Service ── */
export async function getBillingRuns(): Promise<BillingRun[]> {
  return [...MOCK_BILLING_RUNS];
}

export async function triggerManualBillingRun(): Promise<BillingRun> {
  // TODO(service): Replace with Supabase billing engine trigger
  const newRun: BillingRun = {
    id: `run-${Date.now()}`,
    runNumber: `RUN-${Date.now()}-MANUAL`,
    trigger: "manual",
    processedSubscriptions: 1428,
    invoicesGenerated: 1428,
    totalBilled: 8640000,
    succeeded: 1428,
    failed: 0,
    status: "completed",
    executedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    executedBy: "Admin Operator",
  };
  MOCK_BILLING_RUNS.unshift(newRun);
  return newRun;
}

/* ── Analytics & Dashboard Service ── */
export async function getDashboardKpis(): Promise<DashboardKpi[]> {
  return [...MOCK_DASHBOARD_KPIS];
}

export async function getRevenueTimeSeries(): Promise<RevenueDataPoint[]> {
  return [...MOCK_REVENUE_CHART];
}

export async function getAgingReport(): Promise<AgingBucket[]> {
  return [...MOCK_AGING_REPORT];
}
