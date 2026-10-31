/* ── Subscription Management System – Database Types ── */

/** Payment methods accepted in the system */
export type PaymentMethod = "Card" | "UPI" | "Bank transfer" | "Cash";

/** Billing frequency cadences */
export type BillingCadence = "daily" | "weekly" | "monthly" | "yearly";

/** Subscription lifecycle statuses */
export type SubscriptionStatus =
  | "Draft"
  | "Quotation"
  | "Confirmed"
  | "Active"
  | "Closed";

export type InvoiceStatus =
  | "Draft"
  | "Confirmed"
  | "Paid"
  | "Cancelled"
  | "Outstanding"
  | "Overdue";

/** Discount types */
export type DiscountType = "percentage" | "fixed";

/** Discount duration */
export type DiscountDuration = "once" | "repeating" | "forever";

/** User roles */
export type UserRole = "admin" | "staff" | "customer";

/** Staff status */
export type StaffStatus = "Active" | "Invited";

/* ── Entity Interfaces ── */

export interface Customer {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  gstin: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  totalRevenue: number;
  dueBalance: number;
  activeSubscriptions: number;
  planTier: string;
  currency: string;
  defaultPaymentTerms: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  productType: "recurring" | "service" | "physical";
  basePrice: number;
  costPrice: number;
  description: string;
  status: "active" | "archived";
  activeSubscribers: number;
  variants: ProductVariant[];
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  attributeName: string;
  attributeValue: string;
  extraPrice: number;
  sku: string;
  status: "active" | "inactive";
}

export interface Plan {
  id: string;
  name: string;
  code: string;
  price: number;
  currency: string;
  cadence: BillingCadence;
  minQuantity: number;
  availabilityStart: string | null;
  availabilityEnd: string | null;
  neverExpire: boolean;
  autoClose: boolean;
  closableByCustomer: boolean;
  pausable: boolean;
  renewable: boolean;
  status: "active" | "archived";
  subscriberCount: number;
  mrrGenerated: number;
  linkedProducts: string[];
  createdAt: string;
}

export interface QuotationTemplate {
  id: string;
  name: string;
  validityDays: number;
  defaultPlanId: string;
  lineCount: number;
  estimatedMrr: number;
  status: "active" | "archived";
  lines: OrderLine[];
  createdAt: string;
}

export interface Subscription {
  id: string;
  number: string;
  subscriptionNumber?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  planId: string;
  planName: string;
  planPrice: number;
  cadence: BillingCadence;
  planCadence?: BillingCadence;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  nextInvoiceDate: string;
  nextBillingDate?: string;
  paymentTerms: string;
  mrr: number;
  recurringTotal?: number;
  billingCycle: number;
  lines: OrderLine[];
  createdAt: string;
}

export interface OrderLine {
  id: string;
  productId: string;
  productName: string;
  variant?: string;
  variantName?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountPercent: number;
  subtotal: number;
  lineTotal?: number;
}

export interface Invoice {
  id: string;
  number: string;
  subscriptionId: string;
  subscriptionNumber?: string;
  customerId: string;
  customerName: string;
  status: InvoiceStatus;
  issueDate: string;
  invoiceDate?: string;
  dueDate: string;
  amount: number;
  subtotal?: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  billingCycle: number;
  lines: OrderLine[];
  paymentTerms: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  method: PaymentMethod;
  amount: number;
  date: string;
  status: "Successful" | "Pending" | "Failed";
  referenceCode: string;
  notes: string;
  createdAt: string;
}

export interface Discount {
  id: string;
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  duration: DiscountDuration;
  repeatMonths?: number;
  applicableScope: "all" | "specific_plans" | "specific_products";
  applicableIds: string[];
  maxRedemptions: number;
  currentRedemptions: number;
  startDate: string;
  endDate: string | null;
  status: "active" | "expired" | "disabled";
  createdAt: string;
}

export interface TaxRule {
  id: string;
  name: string;
  code: string;
  rate: number;
  calculationType: "percentage" | "fixed";
  applicableTo: "products" | "services" | "all";
  jurisdiction: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: StaffStatus;
  twoFactorEnabled: boolean;
  lastActive: string;
  createdAt: string;
}

export interface BillingRun {
  id: string;
  runNumber: string;
  trigger: "auto" | "manual";
  processedSubscriptions: number;
  invoicesGenerated: number;
  totalBilled: number;
  succeeded: number;
  failed: number;
  status: "completed" | "running" | "failed";
  executedAt: string;
  executedBy: string;
}

/* ── Dashboard / KPI Types ── */

export interface DashboardKpi {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  trend: "up" | "down" | "neutral";
  iconName: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  target: number;
}

export interface AgingBucket {
  label: string;
  amount: number;
  count: number;
  percentage: number;
}
