export interface RouteItem {
  path: string;
  role: "admin" | "staff" | "customer" | "public";
}

export const ALL_ROUTES: RouteItem[] = [
  // Public
  { path: "/", role: "public" },
  { path: "/login", role: "public" },
  { path: "/signup", role: "public" },
  { path: "/forgot-password", role: "public" },
  { path: "/reset-password", role: "public" },

  // Admin
  { path: "/admin/dashboard", role: "admin" },
  { path: "/admin/subscriptions", role: "admin" },
  { path: "/admin/subscriptions/sub-0042", role: "admin" },
  { path: "/admin/customers", role: "admin" },
  { path: "/admin/invoices", role: "admin" },
  { path: "/admin/invoices/inv-00102", role: "admin" },
  { path: "/admin/payments", role: "admin" },
  { path: "/admin/plans", role: "admin" },
  { path: "/admin/plans/new", role: "admin" },
  { path: "/admin/plans/plan-pro-m/edit", role: "admin" },
  { path: "/admin/products", role: "admin" },
  { path: "/admin/products/new", role: "admin" },
  { path: "/admin/products/prod-01/edit", role: "admin" },
  { path: "/admin/quotation-templates", role: "admin" },
  { path: "/admin/reports", role: "admin" },
  { path: "/admin/run-billing", role: "admin" },
  { path: "/admin/staff", role: "admin" },
  { path: "/admin/discounts", role: "admin" },
  { path: "/admin/taxes", role: "admin" },

  // Customer Portal
  { path: "/portal", role: "customer" },
  { path: "/portal/subscriptions", role: "customer" },
  { path: "/portal/subscriptions/sub-0042", role: "customer" },
  { path: "/portal/invoices", role: "customer" },
  { path: "/portal/invoices/inv-00102", role: "customer" },
  { path: "/portal/profile", role: "customer" },
];
