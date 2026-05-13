import { __ } from '@wordpress/i18n';
import React from "react";
import { usePermissions } from "@hooks/usePermissions";
import { useLicenseGuard } from "@components/common/LicenseGuard";
import { useProModal } from "@components/common/ProUpgradeModal";
import ProBadge from "@components/common/ProBadge";
import { Switch } from "@components/ui/switch";
import {
  Columns3,
  GitBranch,
  Settings2,
  ShoppingCart,
  Repeat,
  BarChart,
  Users2,
  Clock,
  CreditCard,
  Receipt,
  Timer,
  Crown,
  Lock,
} from "lucide-react";

const getModules = () => [
  {
    id: "kanbanboard",
    name: __("Kanban Board", 'wedevs-project-manager'),
    desc: __("Turn your projects into Trello like boards and organize them using drag and drop feature.", 'wedevs-project-manager'),
    icon: Columns3,
    color: "text-blue-500 bg-blue-50",
  },
  {
    id: "subtask",
    name: __("Sub Task", 'wedevs-project-manager'),
    desc: __("Break down your to-dos into smaller tasks for better management and project tracking.", 'wedevs-project-manager'),
    icon: GitBranch,
    color: "text-orange-500 bg-orange-50",
  },
  {
    id: "customfields",
    name: __("Custom Fields", 'wedevs-project-manager'),
    desc: __("Generate custom fields for your project tasks to capture specific information.", 'wedevs-project-manager'),
    icon: Settings2,
    color: "text-purple-500 bg-purple-50",
  },
  {
    id: "woocommerceorder",
    name: __("WooCommerce Order", 'wedevs-project-manager'),
    desc: __("Create projects instantly for each of the orders placed on your WooCommerce store.", 'wedevs-project-manager'),
    icon: ShoppingCart,
    color: "text-violet-500 bg-violet-50",
  },
  {
    id: "recurringtask",
    name: __("Recurring Task", 'wedevs-project-manager'),
    desc: __("Repeatedly creates tasks if you set recurrence patterns and parameters.", 'wedevs-project-manager'),
    icon: Repeat,
    color: "text-cyan-500 bg-cyan-50",
  },
  {
    id: "ganttchart",
    name: __("Gantt Chart", 'wedevs-project-manager'),
    desc: __("Create detailed Gantt charts for your projects and become a professional project manager.", 'wedevs-project-manager'),
    icon: BarChart,
    color: "text-indigo-500 bg-indigo-50",
  },
  {
    id: "buddypressintegration",
    name: __("BuddyPress Integration", 'wedevs-project-manager'),
    desc: __("Manage your projects group wise directly from the frontend using this premium integration.", 'wedevs-project-manager'),
    icon: Users2,
    color: "text-amber-500 bg-amber-50",
  },
  {
    id: "sprint",
    name: __("Sprint", 'wedevs-project-manager'),
    desc: __("Plan and track work in time-boxed iterations to improve team velocity and delivery.", 'wedevs-project-manager'),
    icon: Timer,
    color: "text-green-500 bg-green-50",
  },
  {
    id: "timetracker",
    name: __("Time Tracker", 'wedevs-project-manager'),
    desc: __("Track time for each of your project tasks for increasing overall team productivity.", 'wedevs-project-manager'),
    icon: Clock,
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    id: "invoicestripe",
    name: __("Stripe Payment Gateway", 'wedevs-project-manager'),
    desc: __("Get payment with Stripe account for your invoices.", 'wedevs-project-manager'),
    icon: CreditCard,
    color: "text-pink-500 bg-pink-50",
  },
  {
    id: "projectinvoice",
    name: __("Project Invoice", 'wedevs-project-manager'),
    desc: __("Generate invoice for your projects anytime; print, download and send emails to your client.", 'wedevs-project-manager'),
    icon: Receipt,
    color: "text-red-500 bg-red-50",
  },
];

export default function ModulesPage() {
  const { isPro, isProLicensed } = usePermissions();
  const { setOpen } = useProModal();

  const licenseGuard = useLicenseGuard();
  if (licenseGuard) return licenseGuard;

  const modules = getModules();

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-pm-text-primary">
            {__("Modules", 'wedevs-project-manager')}
          </h1>
          <p className="text-sm text-pm-text-muted mt-0.5">
            {__("Enable or disable project manager modules", 'wedevs-project-manager')}
          </p>
        </div>
        {!isPro && <ProBadge label={__("Pro Required", 'wedevs-project-manager')} />}
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((m) => {
          const [fg, bg] = m.color.split(" ");
          return (
            <div
              key={m.id}
              className="group relative rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                {/* Header: icon + toggle */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-3 rounded-xl ${bg} group-hover:scale-110 transition-transform`}
                  >
                    <m.icon className={`h-6 w-6 ${fg}`} />
                  </div>
                  {isPro ? (
                    <Switch disabled className="opacity-60" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOpen(true)}
                      className="p-1.5 rounded-md hover:bg-muted text-pm-text-muted/50 hover:text-pm-accent transition-colors"
                      title={__("Upgrade to Pro", 'wedevs-project-manager')}
                    >
                      <Lock className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Title + description */}
                <h3 className="text-sm font-semibold text-pm-text-primary mb-1.5">
                  {m.name}
                </h3>
                <p className="text-sm text-pm-text-muted leading-relaxed">
                  {m.desc}
                </p>
              </div>

              {/* Hover overlay for free users */}
              {!isPro && (
                <div
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl"
                  onClick={() => setOpen(true)}
                >
                  <div className="flex items-center gap-2 bg-pm-surface rounded-full px-4 py-2 shadow-lg">
                    <Crown className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-semibold text-pm-text-primary">
                      {__("Upgrade to Pro", 'wedevs-project-manager')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
