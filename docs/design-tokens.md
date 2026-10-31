# Design Tokens & Styling Reference

> **System**: Warm Pragmatic SaaS  
> **Source**: `/design/warm_pragmatic_saas/DESIGN.md` + Inline Tailwind configurations across all `/design` screens.  
> **Font Families**: `Inter` (sans-serif primary), `Caveat` (cursive / handwritten highlights).

---

## 1. Color Palette

### 1.1 Brand & Action Colors
| Token Name | Hex Code | Tailwind Utility | Role / Purpose |
| :--- | :--- | :--- | :--- |
| `primary` | `#714B67` | `bg-primary`, `text-primary` | Deep Plum - Primary brand identity, primary CTA buttons, active sidebar links |
| `primary-hover` | `#5C3C53` | `hover:bg-primary-hover` | Plum Hover - Button hover & active interaction states |
| `primary-active` | `#4B2F44` | `active:bg-primary-active` | Plum Pressed / Focused |
| `primary-container` | `#F5EEF3` | `bg-primary-container` | Soft Plum Tint - Highlighting selection cards, badge backgrounds |
| `on-primary` | `#FFFFFF` | `text-on-primary` | Pure White - Text and icons on primary plum buttons |
| `on-primary-container`| `#3B2034` | `text-on-primary-container` | High-contrast deep plum text on primary-container backgrounds |
| `secondary` | `#017E84` | `bg-secondary`, `text-secondary` | Deep Teal - Verification, workflow checkpoints, success, metrics |
| `secondary-hover` | `#016368` | `hover:bg-secondary-hover` | Darkened teal for hover interactions |
| `secondary-container`| `#E0F4F5` | `bg-secondary-container` | Soft teal container background |
| `on-secondary` | `#FFFFFF` | `text-on-secondary` | White text on secondary teal backgrounds |
| `marker-yellow` | `#F5B335` | `text-marker-yellow`, `bg-marker-yellow` | Marker Yellow - Hand-drawn script notes, badges, Caveat highlights |
| `marker-yellow-container` | `#FEF6E4` | `bg-marker-yellow-container` | Soft yellow tint container |

---

### 1.2 Surface & Canvas Architecture
| Token Name | Hex Code | Tailwind Utility | Role / Purpose |
| :--- | :--- | :--- | :--- |
| `surface` | `#FFFFFF` | `bg-surface` | Pure White - Primary surface for content cards, data tables, modals |
| `surface-dim` | `#F4F5F6` | `bg-surface-dim` | Cool Off-White - Page backgrounds, back-office canvases |
| `surface-bright` | `#F7F9FF` | `bg-surface-bright` | Crisp modern back-office canvas background |
| `surface-container-low` | `#F8F9FA` | `bg-surface-container-low` | Slightly shaded card sections, table header bars |
| `surface-container` | `#ECEEF0` | `bg-surface-container` | Subtle separators, chip containers |
| `surface-container-high` | `#E4E7EB` | `bg-surface-container-high` | Active tab headers, input borders |
| `surface-variant` | `#E1E2E4` | `bg-surface-variant` | Neutral boundary dividers |

---

### 1.3 Text & Content Colors
| Token Name | Hex Code | Tailwind Utility | Role / Purpose |
| :--- | :--- | :--- | :--- |
| `on-surface` | `#181C20` | `text-on-surface` | Primary deep ink text for headings, numbers, and primary labels |
| `on-surface-variant` | `#49454F` | `text-on-surface-variant` | Secondary neutral text for table headers, metadata, field descriptions |
| `on-surface-muted` | `#6C757D` | `text-on-surface-muted` | Muted captions, breadcrumbs, placeholder text |
| `outline` | `#DEE2E6` | `border-outline` | Standard 1px structural container & card borders |
| `outline-variant` | `#C4C7C5` | `border-outline-variant` | Active input borders, divider bars |

---

### 1.4 Semantic & Status Lifecycle Tokens
| Status / Semantic Token | Background | Text Color | Border Color | Lifecycle States |
| :--- | :--- | :--- | :--- | :--- |
| **Draft** | `#F8F9FA` | `#495057` | `#DEE2E6` | Invoices / Subscriptions newly initiated |
| **Quotation** | `#EFF6FF` | `#1D4ED8` | `#BFDBFE` | Quotation pending customer review |
| **Confirmed** | `#ECFDF5` | `#047857` | `#A7F3D0` | Approved and locked quotation/invoice |
| **Active** | `#EDFDF8` | `#017E84` | `#B2ECEE` | Live active recurring subscription |
| **Closed / Inactive**| `#F3F4F6` | `#6B7280` | `#E5E7EB` | Terminated or completed contract |
| **Paid / Success** | `#DEF7EC` | `#03543F` | `#BCF0DA` | Fully settled transaction / invoice |
| **Outstanding** | `#FEF3C7` | `#92400E` | `#FDE68A` | Invoice generated, pending payment |
| **Overdue / Danger** | `#FDE8E8` | `#9B1C1C` | `#F8B4B4` | Past payment terms, dunning required |
| **Info / Pending** | `#E1EFFE` | `#1E429F` | `#B3CEFB` | Processing async transaction or run |

---

## 2. Typography

| Role | Font Family | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | Inter | 36px (2.25rem) | 700 Bold | 44px (1.2) | Landing hero headlines |
| `headline-lg` | Inter | 28px (1.75rem) | 700 Bold | 36px (1.3) | Main dashboard titles, invoice numbers |
| `headline-md` | Inter | 22px (1.375rem) | 600 SemiBold | 28px (1.3) | Card group headers, section titles |
| `title-lg` | Inter | 18px (1.125rem) | 600 SemiBold | 24px (1.35) | Modal headers, table group captions |
| `body-lg` | Inter | 16px (1.0rem) | 400 Regular / 500 Medium | 24px (1.5) | Primary inputs, main readable paragraphs |
| `body-md` | Inter | 14px (0.875rem) | 400 Regular / 500 Medium | 20px (1.45) | Standard table cell data, form labels |
| `body-sm` | Inter | 12px (0.75rem) | 400 Regular / 600 SemiBold | 16px (1.35) | Badges, metadata stamps, helper text |
| `script-highlight` | Caveat | 20px (1.25rem) | 700 Bold | 24px (1.2) | Contextual notes, quick stickers, hand-annotations |

---

## 3. Radii, Shadows & Elevation

### 3.1 Border Radius
- `rounded-xs`: `4px` (Small tags, tiny badges)
- `rounded-sm`: `6px` (Input fields, table action buttons)
- `rounded-md`: `8px` (Standard buttons, dropdown menus, cards)
- `rounded-lg`: `12px` (Primary cards, modal dialogs, drawers)
- `rounded-xl`: `16px` (Large container cards, preview panels)
- `rounded-full`: `9999px` (Status badges, pill tabs, avatar circles)

### 3.2 Elevation / Shadows
- `shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` (Subtle card border support)
- `shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)` (Floating cards, hover states)
- `shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)` (Modals, dropdown popovers)
- `shadow-xl`: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)` (Slide-over drawers, command palettes)

---

## 4. Responsive Layout Rules
- **Breakpoints**: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`
- **Mobile First**:
  - Touch targets must be at least `44px` in height/width.
  - Form input font sizes must be at least `16px` (`text-base`) on mobile to prevent iOS auto-zoom.
  - Sidebars collapse into a slide-over sheet drawer toggled by hamburger menu below `lg`.
  - Data tables transform into stacked responsive summary cards below `md`.
  - Steppers adapt from horizontal timeline to vertical progress nodes below `md`.
  - Modals and drawers expand to full-screen responsive sheets on mobile devices.
