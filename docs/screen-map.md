# Screen Map & Design Inventory

> Design System: **Warm Pragmatic SaaS** (`/design/warm_pragmatic_saas/DESIGN.md`)  
> Primary Palette: Plum (`#714B67`), Teal (`#017E84`), Marker Yellow (`#F5B335`), Surface Canvas (`#FFFFFF` / `#F4F5F6` / `#F7F9FF`), Neutral Text (`#212529` / `#181C20`), Border (`#DEE2E6`).  
> Typography: **Inter** (Primary UI/Data), **Caveat** (Contextual script highlights).

---

## 1. Inventory & Screen Mapping Table

| Folder | Screen Title | Proposed Route | Allowed Roles | Data It Needs | Modals or Drawers Inside It | Duplicate / Variant Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `brightloop_forgot_password` | Forgot your password? | `/forgot-password` | Public / Unauth | User email, CSRF token, reset email status | None (Inline status messages) | **No** (Unique public auth screen) |
| `brightloop_landing_page` | Run every subscription in one place | `/` | Public / All | Pricing tiers ($29/mo, $89/mo, Enterprise), feature highlights, customer testimonials, social proof metrics | None | **No** (Unique public marketing landing page) |
| `brightloop_login` | Welcome back | `/login` | Public / Unauth | Email, password, role toggle (Admin / Staff / Customer), remember-me state, session tokens | None | **No** (Unique public auth screen) |
| `brightloop_reset_password` | Set a new password | `/reset-password` | Public / Token Auth | Reset token from query param, new password, confirm password, live password strength checklist | None | **No** (Unique public auth screen) |
| `brightloop_signup` | Get started with Brightloop | `/signup` | Public / Unauth | Full name, work email, password, confirm password, terms consent; live password validation rules, duplicate-email error state | None (Inline duplicate email alert & live rule indicators) | **No** (Unique public auth screen) |
| `customer_profile` | Account & Security Profile | `/portal/profile` | Customer | Customer contact info (name, email, phone), company entity data (VAT/GSTIN ID, billing address), password update fields (current, new, confirm) | None | **No** (Unique customer self-serve profile screen; distinct from admin customer directory) |
| `customers` | Customers Directory | `/admin/customers` | Admin, Staff | Directory list of 184 customers (name, email, ARR, due balance, active subscriptions count, VAT ID), search/filter facets; selected customer master-detail pane (contact info, address, active subscription card, last 4 quarters invoices ledger) | None (Inline master-detail layout; lacks New Customer modal) | **No** (Canonical customer directory view for Admin/Staff) |
| `dashboard` | Revenue & Billing Health | `/admin/dashboard` | Admin, Staff | Top-line KPIs (MRR, ARR, active subscribers count, churn rate, ARPU), revenue time-series chart, subscription breakdown by status, overdue receivables ledger with aging breakdown | None | **No** (Unique executive analytics dashboard) |
| `discounts` | Discounts & Promo Rules | `/admin/discounts` | Admin *(Explicitly Admin Only)* | Active/expired promo rules (code, description, percentage or fixed discount, duration cadence, valid products/plans, redemptions count, status), search & scope filter | None (Lacks modal/drawer to create new rule) | **No** (Unique admin discount management screen) |
| `image.png` | Image Only Reference Artifact | N/A | N/A | None (PNG image only, 1600x858px) | None | **Residual Artifact** (Export residue from Stitch without `code.html`) |
| `invoice_detail` | Pay Invoice | `/portal/invoices/:id` or `/portal/pay/:id` | Customer | Invoice header (INV-2024-0102, amount due ₹2,40,300, due date, vendor GSTIN), line item breakdown, payment options (UPI, Credit/Debit card, Netbanking, Bank wire), billing address verification | None (Inline self-serve settlement form) | **Customer Variant** (Customer portal payment view; internal admin operations use `invoice_detail_inv_2024_0102`) |
| `invoice_detail_inv_2024_0102` | Invoice INV-2024-0102 | `/admin/invoices/:id` | Admin, Staff | Full invoice entity (number, subscription ID, customer details, billing cycle #11, currency), 3-step status stepper (`Draft` → `Confirmed` → `Paid`), line items (product, qty, unit price, taxes, subtotal), audit trail, action buttons (Confirm, Cancel invoice, Send by email, Print PDF) | `settlement-drawer` (Slide-over drawer for recording settlement: payment method, amount, date, reference code, receipt toggle) | **Canonical Admin Screen** (Supersedes `invoice_detail` for Admin/Staff invoice lifecycle management) |
| `invoices_list` | Invoices | `/admin/invoices` | Admin, Staff | Paginated invoice ledger (invoice #, customer, issue date, due date, amount, status: Draft, Confirmed, Paid, Overdue, PDF download link), search, status filters, summary metrics | None | **No** (Unique admin invoice ledger list) |
| `my_invoices` | My Invoices | `/portal/invoices` | Customer | Customer's invoices ledger (invoice #, billing period, amount, status: Unpaid / Due / Paid, issue/due dates, PDF download), summary tabs (All, Unpaid/Due, Paid) | `payment-modal` (Modal: "Immediate Settlement" with amount, payment method, submit) | **No** (Unique customer portal invoice listing) |
| `my_subscriptions` | My Subscriptions | `/portal/subscriptions` | Customer | Customer's active/expired subscriptions (SUB #, plan name, recurring amount, cadence, next renewal date, active add-ons, compliance badge), status filter tabs | `action-modal` (Modal: pause subscription confirmation with reason/resumption date; cancel subscription confirmation) | **No** (Unique customer portal subscriptions list) |
| `payments` | Payments | `/admin/payments` | Admin, Staff | Transaction ledger (TXN ID, invoice #, customer name, payment method, amount, timestamp, status: Successful, Pending, Failed, remittance notes), summary cards (Total Collected, Pending Settlement, Failed) | `record-payment-modal` (Modal: "Record Payment" with invoice lookup, method, date, amount, transaction code, audit notes, receipt toggle) | **No** (Unique payments & transaction reconciliation screen) |
| `plan_form_professional_monthly` | Professional Monthly (Plan Editor) | `/admin/plans/:id/edit` or `/admin/plans/new` | Admin, Staff | Plan specifications (name, code/SKU, base price, currency), billing cadence (Daily, Weekly, Monthly, Yearly), minimum quantity commitment counter, availability validity (Start Date, End Date, "Never Expire" toggle), contract policy rules (auto-close at end date, closable by customer, pausable subscription, renewable contract), linked catalog products, live billing cadence simulator | None | **No** (Canonical subscription plan configuration form) |
| `plans` | Subscription Plans | `/admin/plans` | Admin, Staff | Catalog of subscription plan tiers (name, SKU, price, frequency, active subscriber count, MRR generated, policy badges, active/archived status), search, cadence filters, "+ New Plan" action button | None | **No** (Unique admin plans directory) |
| `portal_home` | Welcome back, Marcus (Customer Portal Home) | `/portal` | Customer | Customer dashboard summary (greeting, active subscription snapshot, next billing date, monthly spend), Recent Invoices card (due invoices with "Pay Now", paid invoices with PDF download), quick support/advisor link, add seats trigger | None | **No** (Unique customer portal home screen) |
| `product_form_enterprise_core_platform` | Enterprise Core Platform (Product Editor) | `/admin/products/:id/edit` or `/admin/products/new` | Admin, Staff | Product baseline (name, product type: recurring SaaS / service / physical, SKU, standard sales price, unit cost, description / internal notes); configurable attributes section *(Partly designed; lacks variant matrix & brand extra price inputs)* | None | **No** (Canonical product configuration form) |
| `products` | Products | `/admin/products` | Admin, Staff | Product directory table (product name, SKU, product type, base price, unit cost, active subscriber count, status: active/archived), search by name/SKU/tag, batch selection, "+ New Product" action button | None | **No** (Unique admin product catalog list) |
| `quotation_templates` | Quotation Templates | `/admin/quotation-templates` | Admin, Staff | Left pane: Template presets list (name, validity period days, line item count, estimated MRR). Right pane: Template Parameters editor (name, validity days, default billing plan, automated email welcome pack, order lines table with product, qty, unit price, discount %, subtotal), "Create subscription from template" action button | None (Inline dual-pane split view) | **No** (Unique quotation templates builder & catalog) |
| `reports` | Financial & Billing Reports | `/admin/reports` | Admin, Staff | Receivables Aging Distribution summary cards (Current, 1-30, 31-60, 61-90, 90+ days overdue), Summary Charts vs Detailed Table switcher, Customer Aging Breakdown ledger table with inline dunning actions (Immediate Notice, Resend Reminder, Suspend Service), Export CSV / PDF schedule, Auto-Dunning Sweep trigger | None | **No** (Unique financial reporting & receivables aging screen) |
| `run_billing` | Run Recurring Billing | `/admin/run-billing` | Admin, Staff | Billing engine controls, Latest Execution Summary KPIs (invoices generated, total amount processed, succeeded transactions, failed/dunning count), Billing Execution History ledger (run ID, timestamp, trigger: auto/manual, processed subscriptions count, total billed, status, audit log link), "⚡ Run Billing Now" trigger button | None | **No** (Unique recurring billing execution & audit screen) |
| `staff_management` | Staff & Team Permissions | `/admin/staff` | Admin *(Explicitly Admin Access Only)* | Directory of staff accounts (name, email, assigned role: Admin / Billing Manager / Billing Analyst, status: Active / Invited, 2FA status, last active), search, role filter, Audit Log CSV export | `addStaffModal` (Modal: "Add New Staff Member" with Full Name, Work Email, Assigned RBAC Role dropdown, invite action) | **No** (Unique staff user management screen) |
| `subscription_detail` | Enterprise Scale Annual (SUB-0042) | `/portal/subscriptions/:id` | Customer | Contract terms & billing schedule (interval, billing date, auto-debit status, payment card), Order lines & breakdown table (product, qty, unit price, VAT rate, subtotal), billing history ledger, actions: Download Contract PDF, Pause, Request Plan Changes, Renew Plan | None | **Customer Variant** (Customer portal self-service contract view; internal admin operations use `subscription_detail_sub_0042`) |
| `subscription_detail_sub_0042` | Subscription SUB-0042 | `/admin/subscriptions/:id` | Admin, Staff | Comprehensive subscription record: SUB number, customer details, external sync reference, 5-stage status stepper (`Draft` → `Quotation` → `Confirmed` → `Active` → `Closed`), Customer & Contract card, Order Lines & Commercials table (products, qty, unit price, taxes, subtotal), Status History audit timeline, Generated Invoices ledger linking directly to `INV-2024-0102`, action buttons: Renew, Pause, Send by Email, Cancel | None | **Canonical Admin Screen** (Supersedes `subscription_detail` for internal subscription operations) |
| `subscriptions` | Subscriptions (Board & Quick Drawer) | `/admin/subscriptions` | Admin, Staff | Multi-entity switcher (Acme India / Acme Europe), Table vs Kanban view switcher, subscriptions list with health indicators (retention rate, MRR, renewal date, status badges), slide-over quick drawer preview | `quick-drawer` (Slide-over drawer showing quick summary of SUB-2024-001: customer name, email, plan title, price, status badge, action buttons) | **Enriched Variant** (Feature-rich counterpart to `subscriptions_list`, featuring Kanban view and slide-over preview drawer) |
| `subscriptions_list` | Subscriptions (Standard List) | `/admin/subscriptions/list` | Admin, Staff | Standard subscriptions data table (SUB number, customer, plan, billing cycle, MRR, start date, next invoice date, status pills), search, quick filter tabs (All 1,428, Active, Quotation, Expiring), Export CSV, "+ New subscription" button | None | **Baseline Variant** (Tabular list counterpart to `subscriptions`) |
| `taxes` | Tax Configuration | `/admin/taxes` | Admin, Staff | Tax rules directory table (tax name, tax code, rate %, calculation type: percentage/fixed, applicability: products/services/all, jurisdiction, status: active/inactive), search, audit trail | `tax-rule-modal` (Modal: "Configure Tax Rule" with tax code, name, rate %, application scope, calculation type, save button) | **No** (Unique tax configuration screen) |
| `warm_pragmatic_saas` | Warm Pragmatic SaaS Design System | N/A | Developer / Designer | Not a screen; contains `DESIGN.md` defining color tokens, typography scales, spacing, elevations, corner radiuses, and component standards | N/A | **Design System Definition** |

---

## 2. Duplicate & Overlapping Screens Analysis

1. **Invoices Detail**:
   - `invoice_detail_inv_2024_0102` is the **canonical internal admin/staff screen** with full lifecycle stepper (`Draft` → `Confirmed` → `Paid`), payment settlement drawer (`settlement-drawer`), invoice actions (`Confirm`, `Cancel`, `Send by email`, `Print PDF`), line item taxes/discounts, and audit logs.
   - `invoice_detail` is a **customer portal settlement view** focused on self-serve payment (`Pay ₹2,40,300 Now`, Razorpay/UPI/Card form, print invoice).
2. **Subscription Detail**:
   - `subscription_detail_sub_0042` is the **canonical internal admin/staff screen** featuring the 5-stage stepper (`Draft` → `Quotation` → `Confirmed` → `Active` → `Closed`), customer contract card, order lines with taxes, status history audit timeline, and linked generated invoices (`INV-2024-0102`).
   - `subscription_detail` is the **customer portal subscription view** with self-service customer options (`Pause`, `Request Plan Changes`, `Renew Plan`, `Download Contract PDF`).
3. **Subscriptions Directory**:
   - `subscriptions` contains the full interactive experience including Table / Kanban toggle, entity dropdown, and a slide-over preview drawer (`quick-drawer`).
   - `subscriptions_list` is the standard flat table view. They can be merged into a single route `/admin/subscriptions` with view toggles.
4. **`image.png`**:
   - Residual Stitch artifact containing only `screen.png` and no `code.html`. It should be archived.

---

## 3. Requirement Inventory & Gap Analysis

| Requirement Category | Specified Requirements | Current Inventory Status | Findings & Missing Elements |
| :--- | :--- | :--- | :--- |
| **Auth** | Signup with live password rules and duplicate-email error, login, forgot and reset password | **Partly Designed** | • `brightloop_signup`: Fully designed with live password checklist and duplicate-email error alert.<br>• `brightloop_forgot_password`: Fully designed.<br>• `brightloop_login`: Designed with role toggles, but **missing** explicit error state for invalid credentials/account locked.<br>• `brightloop_reset_password`: Designed with password rules, but **missing** "Expired/Invalid Token" state. |
| **Roles** | Admin, staff, customer portal; only admin can add staff | **Fully Designed** | • `staff_management` has strict "Admin Access Only" badge and `addStaffModal` to invite staff with RBAC roles (Admin, Billing Manager, Billing Analyst).<br>• Customer portal screens (`portal_home`, `my_subscriptions`, `my_invoices`, `customer_profile`, `invoice_detail`) are completely isolated. |
| **Products & Variants** | Products with variants (brand adds extra price), plans (daily/weekly/monthly/yearly, min quantity, availability dates, auto-close, closable, pausable, renewable) | **Partly Designed** *(Products)*<br>**Fully Designed** *(Plans)* | • `plan_form_professional_monthly`: 100% compliant with daily/weekly/monthly/yearly cadence, min quantity counter, availability dates, never-expire toggle, auto-close toggle, closable toggle, pausable toggle, renewable toggle.<br>• `product_form_enterprise_core_platform`: **Missing variant builder**. Has only a dummy "+ Add Attribute" button. Lacks the attribute definitions, the Brand selector with extra price adjustment (`+$X`), and the generated variant SKU/price matrix table. |
| **Quotation Templates & Subscriptions** | Quotation templates with validity days; subscriptions with number, customer, plan, dates, payment terms, lines; status Draft, Quotation, Confirmed, Active, Closed | **Partly Designed** | • `quotation_templates`: Fully designed with validity days, default billing plan, and line items.<br>• `subscription_detail_sub_0042`: Fully designed with SUB number, customer, plan, dates, payment terms, lines, and the 5-stage stepper (`Draft`, `Quotation`, `Confirmed`, `Active`, `Closed`).<br>• **Missing**: **Subscription & Quotation Create Form** (`/admin/subscriptions/new`) where staff/admin initiates a draft subscription or quotation with customer lookup, template picker, terms, and lines.<br>• **Missing**: **Customer Portal Quotation Review & Accept Screen** (`/portal/quotations/:id`) where customer reviews validity days remaining and clicks "Accept & Sign Quotation" or "Reject". |
| **Invoices, Discounts, Taxes, Payments** | Invoices (Draft, Confirmed, Paid; confirm, cancel, send, print), discounts (admin only), taxes, payments with method/amount/date/note | **Partly Designed** | • `invoice_detail_inv_2024_0102`: Fully designed with Draft, Confirmed, Paid stepper, confirm, cancel, send email, print PDF, and settlement drawer.<br>• `payments`: Fully designed with `record-payment-modal` (method, amount, date, notes).<br>• `taxes`: Fully designed with `tax-rule-modal`.<br>• `discounts`: Marked "Admin Only", but **missing** the "+ Create Discount Rule" modal/drawer form (fields: code, %/fixed value, duration, applicable plans, max redemptions). |
| **Finance Dashboard & Reports** | Finance dashboard and reports (active subscriptions, revenue, payments, overdue) with filters and summary view | **Fully Designed** | • `dashboard`: Real-time MRR, ARR, active subscribers, churn, revenue graph, overdue invoice ledger.<br>• `reports`: Receivables aging (0-30, 31-60, 61-90, 90+), Summary Charts vs Detailed Table switcher, customer aging ledger, inline dunning actions. |
| **Customers, Staff, Billing, Portal, System States** | Customers list and detail, staff management, run billing, portal pages, 403 and 404 pages, empty/loading/error states | **Partly Designed** | • `customers`: Master-detail view is designed, but **missing** "+ New Customer" modal/form.<br>• `staff_management`: Fully designed.<br>• `run_billing`: Fully designed.<br>• Portal pages: Fully designed.<br>• **Missing**: **403 Forbidden Page**.<br>• **Missing**: **404 Not Found Page**.<br>• **Missing**: **Empty States** (empty subscriptions, invoices, customers, payments, discounts).<br>• **Missing**: **Loading States / Skeletons** (table and metric shimmers).<br>• **Missing**: **Global Error States** (500 server error, network drop banner). |

---

## 4. Proposals for Missing & Partly Designed Screens

All proposed layouts strictly adhere to the **Warm Pragmatic SaaS** design system:
- Surfaces: `#F7F9FF` background, `#FFFFFF` cards, `#DEE2E6` subtle borders.
- Primary Accent: Plum `#714B67` (Buttons, key brand anchors).
- Secondary Accent: Deep Teal `#017E84` (Workflows, reconciliation, checkmarks).
- Marker Accent: Yellow `#F5B335` (Caveat script highlights, callouts).
- Badges: Pill-shaped (`border-radius: 9999px`) with lifecycle tints.
- Typography: **Inter** for data/labels, **Caveat** for operational notes.

---

### Screen 1: Product Variant & Brand Price Builder (`/admin/products/:id/variants` or embedded in `product_form`)
- **Purpose**: Allow Admin/Staff to define attributes (specifically "Brand") and assign incremental extra price markups per brand, generating the variant combination matrix.
- **Layout**:
  - **Header**: Breadcrumbs `Products / Enterprise Core Platform / Variants`, Title "Configurable Attributes & Variants", Save Changes button (Plum `#714B67`).
  - **Attribute Definition Card** (`#FFFFFF`, border `#DEE2E6`, 12px rounded):
    - Row for Attribute 1: Name = "Brand" (badge `Key Variant`), Type = Dropdown / Pill selector.
    - Attribute Values & Extra Price Table:
      - Line 1: Value `Brightloop Native` | Extra Price: `₹0.00` (Included) | Default radio = checked.
      - Line 2: Value `Enterprise Brand A` | Extra Price: `+₹15,000.00` | Surcharge type = `Recurring/mo`.
      - Line 3: Value `White-Label OEM Brand B` | Extra Price: `+₹35,000.00` | Surcharge type = `Recurring/mo`.
      - Button: `+ Add Brand Value`.
  - **Variant Matrix & Combination Table**:
    - Columns: Variant Name, Generated SKU, Base Price, Brand Extra Price, Final Recurring Price, Inventory/Status Toggle.
    - Example row: `Enterprise Core Platform (Enterprise Brand A)` | SKU `ECP-BR-A-01` | Base `₹80,000` | Brand Extra `+₹15,000` | Final `₹95,000 / mo` | Status pill `Active`.
  - **Editorial Marker Callout** (Caveat script in `#F5B335`): *"Brand surcharges automatically recalculate order lines in new quotations ✨"*

---

### Screen 2: Subscription & Quotation Creation Form (`/admin/subscriptions/new`)
- **Purpose**: Admin/Staff creates a new quotation or subscription from scratch or selects a quotation template to pre-fill terms and lines.
- **Layout**:
  - **Top Bar**: Breadcrumbs `Subscriptions / New`, Title "Create Subscription / Quotation", Actions: "Save as Draft" (Secondary `#F4F5F6`), "Generate Quotation" (Teal `#017E84`), "Confirm & Activate" (Plum `#714B67`).
  - **Status Stepper**: Horizontal 5-step stepper showing Step 1 `Draft (Active)` → `Quotation` → `Confirmed` → `Active` → `Closed`.
  - **Two-Column Form Grid (8 col / 4 col)**:
    - **Left Column (Primary Commercials)**:
      - **Card 1: Customer & Blueprint Selection**:
        - Customer Picker (Autocomplete search with avatar, email, VAT ID, and quick "+ New Customer" link).
        - Quotation Template Picker (Optional dropdown: "Enterprise SaaS Standard (30 days)", "Cloud Infrastructure Annual", or "None - Custom").
        - Payment Terms Dropdown: `Immediate Payment`, `Net 15`, `Net 30`, `Net 60`.
      - **Card 2: Dates & Cadence**:
        - Subscription Number (Auto-assigned: `SUB-2024-XXXX`).
        - Plan Selector & Billing Frequency (Daily, Weekly, Monthly, Yearly).
        - Start Date picker, End Date picker, "Auto-close on expiration" toggle.
      - **Card 3: Order Lines & Products Table**:
        - Columns: Product, Variant/Brand, Description, Qty, Unit Price, Tax Code (VAT 18%), Discount %, Subtotal, Remove.
        - Buttons: `+ Add Product Line`, `+ Add Section / Note`.
    - **Right Column (Commercial Summary & Validation)**:
      - **Summary Card**:
        - Subtotal (Recurring lines): `₹1,20,000.00`
        - Brand Variant Surcharges: `+₹15,000.00`
        - Discounts Applied: `-₹13,500.00` (Admin badge)
        - Tax Total (18% GST/VAT): `+₹21,870.00`
        - **Total Contract Commitment**: `₹1,43,370.00 / mo`
      - **Quotation Validity Card**:
        - Validity Days: Input field `30` days.
        - Expiration Notice: Calculated expiry date displayed in badge.
        - Send Email Pack checkbox (Checked by default: includes Terms PDF and customer portal sign-off link).

---

### Screen 3: Customer Portal Quotation Review & Acceptance (`/portal/quotations/:id`)
- **Purpose**: Customer reviews a quotation sent by sales/billing, views validity days left, inspects lines, and signs/accepts or requests changes.
- **Layout**:
  - **Banner Alert**: Amber warning container (`#FFF3CD`, border `#FFE69C`): `hourglass_top Quotation expires in 12 days (Nov 12, 2026)`.
  - **Header**: Title "Quotation QTE-2024-0089", Issuer: "Brightloop Technologies", Status Pill `Quotation (Pending Acceptance)`.
  - **Action Bar**: "Download PDF" (Secondary), "Request Modification" (Secondary), "Accept & Activate Subscription" (Primary Plum `#714B67` with lock icon).
  - **Content Body**:
    - Summary Card: Proposed Plan ("Enterprise Core Platform"), Frequency ("Billed Monthly"), Payment Terms ("Net 30 via Card/Wire").
    - Order Lines Table: Product name, selected Brand variant, seat count, unit price, tax, subtotal.
    - Terms & Conditions Accordion: Proration policies, SLA commitments, cancellation terms.
    - Digital Sign-off Modal / Drawer (when clicking Accept): Full name input, signature confirmation checkbox, payment method setup.

---

### Screen 4: Create Discount Rule Drawer (`/admin/discounts/new` or Drawer in `discounts`)
- **Purpose**: Admin-only modal/drawer to configure promo codes, percentage or fixed discounts, and validity scopes.
- **Layout**:
  - **Container**: Slide-over drawer on right (480px width) or centered modal (`#FFFFFF`, 12px rounded, Level 3 shadow).
  - **Header**: Icon `percent`, Title "Create Discount Rule", Subtitle "Configure promotional code and target cadence", Badge `Admin Access Only`.
  - **Fields**:
    - Discount Code (e.g., `GROWTH2024`, uppercase forced).
    - Description (Customer-facing invoice note).
    - Discount Type Segmented Control: `Percentage (%)` | `Fixed Amount (₹ / $)`.
    - Value Input (e.g., `15.00%` or `₹5,000.00`).
    - Duration Cadence: `Once (First Invoice)` | `Repeating (N months)` | `Forever (Subscription Lifetime)`.
    - Applicability Scope: `All Plans` | `Specific Plans (Multi-select)` | `Specific Products`.
    - Usage Limits: Maximum total redemptions, Never Expire checkbox, Start Date & End Date.
  - **Footer**: "Discard" button, "Save & Activate Rule" button (Plum `#714B67`).

---

### Screen 5: New Customer Creation Modal / Drawer (`/admin/customers/new` or Drawer in `customers`)
- **Purpose**: Admin/Staff creates a new customer record directly from the Customers screen.
- **Layout**:
  - **Container**: Slide-over drawer (560px width) or modal.
  - **Header**: Icon `person_add`, Title "Add New Customer Entity", Subtitle "Register company profile, billing contact, and tax credentials".
  - **Form Sections**:
    - **Company Information**: Company Legal Name *, Commercial Brand Name, Business Email *, Phone Number, Website.
    - **Tax & Compliance**: Tax Identification / VAT / GSTIN Number, VIES / Tax Auto-Validation button (Teal `#017E84`), Currency selector (`INR`, `USD`, `EUR`, `GBP`).
    - **Billing & Remittance Address**: Street Address, Suite/Floor, City, State/Province, Postal Code, Country dropdown.
    - **Commercial Defaults**: Default Payment Terms (`Immediate`, `Net 15`, `Net 30`), Primary Sales/Billing Advisor.
  - **Footer**: "Cancel" button, "Create Customer" button (Plum `#714B67`).

---

### Screen 6: 403 Forbidden Access Page (`/403`)
- **Purpose**: Displayed when a Staff user attempts to access Admin-only pages (e.g. Discounts or Staff Management), or when Customer attempts to access Admin routes.
- **Layout**:
  - **Center Container**: Clean surface card (`#FFFFFF`, border `#DEE2E6`, 16px padding, 12px rounded).
  - **Illustration / Icon**: Shield with lock icon in Plum-subtle container (`bg-[#EADCE6] text-[#714B67]`).
  - **Typography**:
    - `headline-lg`: "Access Restricted"
    - `body-md`: "You don't have permission to access this financial module. This section requires Administrator privileges."
    - `caption-script` (Caveat `#F5B335`): *"Need access? Contact your workspace admin (admin@brightloop.io) ✨"*
  - **Actions**:
    - Primary button: "Back to Dashboard" (Plum `#714B67`).
    - Secondary button: "Switch User / Re-login" (`#F4F5F6`).

---

### Screen 7: 404 Page Not Found (`/404`)
- **Purpose**: Displayed when navigating to an invalid URL or nonexistent subscription/invoice ID.
- **Layout**:
  - **Center Container**: Crisp minimalist card.
  - **Visual**: Subtle ledger graphic with broken link icon in soft utility gray (`#F4F5F6`).
  - **Typography**:
    - Large muted number: `404` in `headline-xl` (text `#80747A`).
    - `headline-md`: "Page or Record Not Found"
    - `body-md`: "The subscription, invoice, or route you are looking for does not exist or may have been archived."
  - **Search & Quick Links**:
    - Quick search bar: "Search subscriptions, invoices, or customers..."
    - Action buttons: "Go to Dashboard", "View Subscriptions List".

---

### Screen 8: Comprehensive Empty States System
- **Purpose**: Beautiful, actionable empty states across all ledger views when no records exist or search returns 0 results.
- **Layout Patterns**:
  - **Empty Subscriptions** (`/admin/subscriptions`):
    - Graphic: Contract document icon with yellow highlight marker.
    - Title: "No active subscriptions found"
    - Description: "Start your first recurring contract from a template or create a custom quotation for a customer."
    - Primary Action: `+ Create Subscription` (Plum `#714B67`).
    - Secondary Action: `Use Quotation Template` (Teal `#017E84`).
  - **Empty Invoices** (`/admin/invoices`):
    - Graphic: Invoice receipt icon.
    - Title: "No invoices generated yet"
    - Description: "Invoices will be auto-generated during the next recurring billing cycle, or you can trigger a billing run now."
    - Action: `⚡ Run Billing Now` (Teal `#017E84`).
  - **Empty Search / Filter Results**:
    - Graphic: Filter search icon.
    - Title: "No matching records found for '{query}'"
    - Description: "Try adjusting your search criteria or clearing active filters."
    - Action: `Clear All Filters` button.

---

### Screen 9: Loading States & Skeletons
- **Purpose**: Smooth visual transitions during async fetching of financial ledgers and metric cards.
- **Layout Specifications**:
  - **Metric Tiles**: Shimmer pulses on Level 1 cards with gray rectangles (`#E0E3E8`) matching metric figure dimensions.
  - **Data Tables**: 6 placeholder rows with light-gray pulse blocks for text cells, capsule shapes for status pills, and circular pulses for avatar icons.
  - **Chart Skeletons**: Soft gray wave area placeholder with pulsating axes in `#EBEFF3`.

---

### Screen 10: System Error & Network Banner
- **Purpose**: Non-intrusive yet prominent notifications for network issues, 500 API failures, or failed payment webhooks.
- **Layout Specifications**:
  - **Top Banner**: Error container (`#FFDAD6`, border `#BA1A1A`, text `#93000A`) with icon `error_outline` and button `Retry Connection`.
  - **Form Validation Banner**: High-contrast error summary card placed directly above submit buttons.

---

## 5. Next Steps & Approval Gate

This inventory and layout specification provides complete coverage for all functional and architectural requirements in the platform.

**Awaiting user approval before proceeding to implementation.**
