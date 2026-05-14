import { __ } from '@wordpress/i18n';
import React, { useMemo } from "react";
import {
  Sparkles,
  Calendar,
  BarChart3,
  TrendingUp,
  Repeat,
  Users2,
  BarChart,
  Columns3,
  ShoppingCart,
  GitBranch,
  Clock,
  Receipt,
  CreditCard,
  MessageSquare,
  CalendarRange,
  Upload,
  FolderOpen,
  Link2,
  Shield,
  Bell,
  Filter,
  Zap,
  Check,
  ExternalLink,
  Crown,
  ArrowRight,
  Globe,
} from "lucide-react";

const UPGRADE_URL =
  "https://wedevs.com/wp-project-manager-pro/pricing/?utm_source=wpdashboard&utm_medium=premium-page";

const getFeatures = () => [
  {
    title: __("Calendar", 'wedevs-project-manager'),
    desc: __("Get the birdseye view of all tasks from an interactive calendar.", 'wedevs-project-manager'),
    icon: Calendar,
    bg: "#E5E7FD",
    fg: "text-indigo-500",
    url: "https://wedevs.com/wp-project-manager-pro/features/",
  },
  {
    title: __("Report", 'wedevs-project-manager'),
    desc: __("Generate actionable insights with built-in reporting system.", 'wedevs-project-manager'),
    icon: BarChart3,
    bg: "#E7DAF3",
    fg: "text-purple-500",
    url: "https://wedevs.com/wp-project-manager-pro/features/",
  },
  {
    title: __("Progress", 'wedevs-project-manager'),
    desc: __("Stay updated with the live progress of your projects. Plan ahead of deadline.", 'wedevs-project-manager'),
    icon: TrendingUp,
    bg: "#DAEEF0",
    fg: "text-teal-500",
    url: "https://wedevs.com/wp-project-manager-pro/features/",
  },
];

const getModules = () => [
  {
    title: __("Recurring Task", 'wedevs-project-manager'),
    desc: __("Automate routine tasks with this super handy module. Just set the patterns & parameters and the tasks will repeat itself accordingly.", 'wedevs-project-manager'),
    icon: Repeat,
    url: "https://wedevs.com/products/plugins/wp-project-manager-pro/recurring-task/",
  },
  {
    title: __("BuddyPress", 'wedevs-project-manager'),
    desc: __("Need to bring team networking in your project manager? You're good to go.", 'wedevs-project-manager'),
    icon: Users2,
    url: "https://wedevs.com/products/plugins/wp-project-manager-pro/buddypress/",
  },
  {
    title: __("Gantt Chart", 'wedevs-project-manager'),
    desc: __("Get a graphical overview of task progress, deadline, sub-tasks, project dependencies - everything in one place.", 'wedevs-project-manager'),
    icon: BarChart,
    url: "https://wedevs.com/products/plugins/wp-project-manager-pro/gantt-chart/",
  },
  {
    title: __("Kanban Board", 'wedevs-project-manager'),
    desc: __("Organize your tasks in Kanban style to keep team-mates updated about task status.", 'wedevs-project-manager'),
    icon: Columns3,
    url: "https://wedevs.com/products/plugins/wp-project-manager-pro/kanban-board/",
  },
  {
    title: __("WooCommerce Order", 'wedevs-project-manager'),
    desc: __("Integrate task management with your WooCommerce store and automate the workflow.", 'wedevs-project-manager'),
    icon: ShoppingCart,
    url: "https://wedevs.com/products/plugins/wp-project-manager-pro/woocommerce-order/",
  },
  {
    title: __("Sub Task", 'wedevs-project-manager'),
    desc: __("Break down your tasks into smaller ones to work more effectively. Keep track of every detail.", 'wedevs-project-manager'),
    icon: GitBranch,
    url: "https://wedevs.com/products/plugins/wp-project-manager-pro/sub-task/",
  },
  {
    title: __("Time Tracker", 'wedevs-project-manager'),
    desc: __("Track the exact time you spend on specific tasks. With Interval option of course.", 'wedevs-project-manager'),
    icon: Clock,
    url: "https://wedevs.com/products/plugins/wp-project-manager-pro/time-tracker/",
  },
  {
    title: __("Invoice", 'wedevs-project-manager'),
    desc: __("Invoice creation, payment collection have never been easier before.", 'wedevs-project-manager'),
    icon: Receipt,
    url: "https://wedevs.com/products/plugins/wp-project-manager-pro/invoice/",
  },
  {
    title: __("Stripe Gateway", 'wedevs-project-manager'),
    desc: __("Enable the hassle-free and popular payment system with the minimum cost possible.", 'wedevs-project-manager'),
    icon: CreditCard,
    url: "https://wedevs.com/products/plugins/wp-project-manager-pro/invoice-stripe-gateway/",
  },
];

const getMoreFeatures = () => [
  { text: __("Built-in private messenger",              'wedevs-project-manager'), icon: MessageSquare },
  { text: __("Set the start & end date of the project", 'wedevs-project-manager'), icon: CalendarRange },
  { text: __("Upload all files in one place",           'wedevs-project-manager'), icon: Upload },
  { text: __("Create folders for files",                'wedevs-project-manager'), icon: FolderOpen },
  { text: __("Link messages & task lists with files",   'wedevs-project-manager'), icon: Link2 },
  { text: __("Project user permission",                 'wedevs-project-manager'), icon: Shield },
  { text: __("Team category permission",                'wedevs-project-manager'), icon: Users2 },
  { text: __("Frontend projects and discussions",       'wedevs-project-manager'), icon: Globe },
  { text: __("Automatic daily digest emails",           'wedevs-project-manager'), icon: Bell },
  { text: __("Advanced filters for reports",            'wedevs-project-manager'), icon: Filter },
  { text: __("Real-time updates",                       'wedevs-project-manager'), icon: Zap },
];

export default function PremiumPage() {
  const FEATURES = useMemo(() => getFeatures(), []);
  const MODULES = useMemo(() => getModules(), []);
  const MORE_FEATURES = useMemo(() => getMoreFeatures(), []);

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-8">
      {/* ── Hero Banner ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 px-8 py-10 md:px-12 md:py-14 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full mb-3">
            <Sparkles className="h-4 w-4" />
            {__("Project Manager Pro", 'wedevs-project-manager')}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">
            {__("Premium Features", 'wedevs-project-manager')}
          </h1>
          <p className="text-white/80 text-sm max-w-lg mx-auto leading-relaxed">
            {__(
              "Advanced project management tools to ensure your efficiency and productivity reach the peak.", 'wedevs-project-manager',
            )}
          </p>
          <a
            href={UPGRADE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 rounded-lg font-semibold text-sm no-underline transition-colors"
            style={{ background: "#ff9000", color: "#fff" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#d07805")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ff9000")}
          >
            <Crown className="h-5 w-5" />
            {__("Upgrade to Pro", 'wedevs-project-manager')}
          </a>
        </div>
      </div>

      {/* ── 3 Featured Features — overlapping cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-6 relative z-10">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border bg-card p-5 hover:shadow-lg transition-shadow group"
          >
            <div
              className="inline-flex items-center justify-center h-11 w-11 rounded-xl mb-3"
              style={{ background: f.bg }}
            >
              <f.icon className={`h-5 w-5 ${f.fg}`} />
            </div>
            <h3 className="text-sm font-semibold text-pm-text-primary mb-1">
              {f.title}
            </h3>
            <p className="text-sm text-pm-text-muted leading-relaxed mb-2">
              {f.desc}
            </p>
            <a
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[15px] font-medium text-pm-accent hover:underline no-underline"
            >
              {__("Learn More", 'wedevs-project-manager')} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ))}
      </div>

      {/* ── Modules Grid ── */}
      <div>
        <h2 className="text-lg font-bold text-pm-text-primary mb-1">
          {__("Premium Modules", 'wedevs-project-manager')}
        </h2>
        <p className="text-sm text-pm-text-muted mb-4">
          {__(
            "Give your team & projects additional pace with 9+ premium modules", 'wedevs-project-manager',
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {MODULES.map((m) => (
            <div
              key={m.title}
              className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted/50 shrink-0 group-hover:scale-110 transition-transform">
                  <m.icon className="h-5 w-5 text-pm-accent" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-pm-text-primary mb-0.5">
                    {m.title}
                  </h4>
                  <p className="text-[15px] text-pm-text-muted leading-relaxed">
                    {m.desc}
                  </p>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[14px] font-medium text-pm-accent mt-1.5 hover:underline no-underline"
                  >
                    {__("See More", 'wedevs-project-manager')} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── More Features + CTA ── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Feature list */}
        <div className="md:col-span-3">
          <h2 className="text-lg font-bold text-pm-text-primary">
            {__("More features to unveil while", 'wedevs-project-manager')}
          </h2>
          <h2 className="text-lg font-bold text-pm-accent mb-1">
            {__("Managing Your Project", 'wedevs-project-manager')}
          </h2>
          <p className="text-sm text-pm-text-muted mb-4">
            {__(
              "Useful & fascinating features for WP Project Manager that can be unlocked with the Pro Version.", 'wedevs-project-manager',
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {MORE_FEATURES.map((f) => (
              <div
                key={f.text}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded hover:bg-muted/30 transition-colors"
              >
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-emerald-50 shrink-0">
                  <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                </span>
                <span className="text-sm text-pm-text-primary">
                  {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="md:col-span-2 flex items-start">
          <div
            className="w-full rounded-2xl p-6 text-center text-white"
            style={{
              background: "linear-gradient(-147deg, #C444FB 0%, #5B56D7 100%)",
            }}
          >
            <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-80" />
            <h3 className="text-xl font-bold mb-1 text-white">{__("Go Pro Today", 'wedevs-project-manager')}</h3>
            <p className="text-white/70 text-sm mb-4">
              {__(
                "Unlock all premium features and take your project management to the next level.", 'wedevs-project-manager',
              )}
            </p>
            <a
              href={UPGRADE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors no-underline"
            >
              {__("Get Started Now", 'wedevs-project-manager')} <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
