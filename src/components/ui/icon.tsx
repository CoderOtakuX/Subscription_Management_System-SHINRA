/**
 * Icon wrapper that maps Material Symbols names to Lucide React equivalents.
 * Usage: <Icon name="dashboard" /> or <Icon name="autorenew" className="text-primary" size={20} />
 */
import React from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  FileText,
  RefreshCw,
  Receipt,
  CreditCard,
  Tags,
  Percent,
  BarChart3,
  ShieldCheck,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronsUpDown,
  Plus,
  X,
  Check,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  Mail,
  Printer,
  Calendar,
  Clock,
  Settings,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  MoreVertical,
  MoreHorizontal,
  Menu,
  Filter,
  Star,
  Heart,
  Lock,
  Unlock,
  Key,
  Save,
  Send,
  Pause,
  Play,
  RotateCw,
  History,
  Zap,
  DollarSign,
  Building2,
  UserPlus,
  UserCog,
  LogOut,
  Home,
  Bookmark,
  Tag,
  Globe,
  Phone,
  MapPin,
  Hash,
  Coins,
  Wallet,
  ListFilter,
  Table,
  LayoutGrid,
  FileDown,
  Archive,
  CircleDot,
  SlidersHorizontal,
  Lightbulb,
  Sparkles,
  BadgeCheck,
  Shield,
  Headphones,
  PanelLeft,
  type LucideIcon,
} from "lucide-react";

/** Map of Material Symbols icon names → Lucide React components */
const iconMap: Record<string, LucideIcon> = {
  // Navigation
  dashboard: LayoutDashboard,
  grid_view: LayoutDashboard,
  group: Users,
  groups: Users,
  inventory_2: Package,
  layers: Layers,
  loyalty: Layers,
  description: FileText,
  request_quote: FileText,
  autorenew: RefreshCw,
  receipt_long: Receipt,
  credit_card: CreditCard,
  sell: Tags,
  percent: Percent,
  bar_chart: BarChart3,
  admin_panel_settings: ShieldCheck,
  settings: Settings,

  // Actions
  search: Search,
  notifications: Bell,
  help: HelpCircle,
  add: Plus,
  add_circle: Plus,
  close: X,
  check: Check,
  check_circle: CheckCircle,
  done: Check,
  done_all: CheckCircle,
  cancel: XCircle,
  error: AlertCircle,
  error_outline: AlertCircle,
  warning: AlertTriangle,
  info: Info,

  // Arrows & Navigation
  arrow_back: ArrowLeft,
  arrow_forward: ArrowRight,
  arrow_upward: ArrowUp,
  arrow_downward: ArrowDown,
  keyboard_backspace: ArrowLeft,
  chevron_right: ChevronRight,
  chevron_left: ChevronLeft,
  expand_more: ChevronDown,
  arrow_drop_down: ChevronDown,
  expand_less: ChevronUp,
  unfold_more: ChevronsUpDown,

  // Trending
  trending_up: TrendingUp,
  trending_down: TrendingDown,

  // File operations
  download: Download,
  file_download: Download,
  download_for_offline: Download,
  upload: Upload,
  file_upload: Upload,
  ios_share: Download,

  // Communication
  mail: Mail,
  send: Send,
  outgoing_mail: Send,

  // Display
  print: Printer,
  visibility: Eye,
  visibility_off: EyeOff,
  content_copy: Copy,
  open_in_new: ExternalLink,
  more_vert: MoreVertical,
  more_horiz: MoreHorizontal,
  menu: Menu,

  // Date & Time
  calendar_today: Calendar,
  event_busy: Calendar,
  schedule: Clock,
  schedule_send: Clock,
  history: History,
  timelapse: Clock,

  // Edit
  edit: Edit,
  delete: Trash2,
  save: Save,

  // Filters & Views
  filter_list: Filter,
  tune: SlidersHorizontal,
  table_rows: Table,
  view_kanban: LayoutGrid,
  view_column: Table,
  format_list_bulleted: ListFilter,

  // Security
  lock: Lock,
  lock_clock: Lock,
  lock_open: Unlock,
  key: Key,
  shield: Shield,
  shield_person: Shield,
  verified: BadgeCheck,
  verified_user: BadgeCheck,

  // Status
  pause_circle: Pause,
  play_circle: Play,
  cached: RotateCw,
  published_with_changes: RotateCw,
  sync: RefreshCw,
  sync_alt: RefreshCw,
  refresh: RefreshCw,
  bolt: Zap,

  // Finance
  finance_mode: DollarSign,
  account_balance_wallet: Wallet,
  equalizer: BarChart3,
  attach_money: DollarSign,
  payments: Coins,
  add_card: CreditCard,
  currency_rupee: DollarSign,

  // Business
  business: Building2,
  person_add: UserPlus,
  group_add: UserPlus,
  person: Users,
  person_cancel: UserCog,
  logout: LogOut,
  home: Home,
  storefront: Building2,

  // Misc
  star: Star,
  favorite: Heart,
  bookmark: Bookmark,
  tag: Tag,
  label: Tag,
  language: Globe,
  phone: Phone,
  location_on: MapPin,
  category: Hash,
  lightbulb: Lightbulb,
  auto_awesome: Sparkles,
  support_agent: Headphones,
  pending_actions: Clock,

  // File types
  picture_as_pdf: FileDown,
  archive: Archive,

  // Indicators
  circle: CircleDot,
  radio_button_checked: CircleDot,
  panel_left: PanelLeft,
};

export interface IconProps {
  /** Material Symbols icon name or lucide icon name */
  name: string;
  /** CSS class names */
  className?: string;
  /** Size in pixels (default: 20) */
  size?: number;
  /** Stroke width (default: 2) */
  strokeWidth?: number;
}

export function Icon({
  name,
  className = "",
  size = 20,
  strokeWidth = 2,
}: IconProps) {
  const LucideComponent = iconMap[name];
  if (!LucideComponent) {
    // Fallback: render the name as text for unmapped icons
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.6 }}
        title={name}
      >
        ?
      </span>
    );
  }
  return (
    <LucideComponent
      className={className}
      size={size}
      strokeWidth={strokeWidth}
    />
  );
}

export default Icon;
