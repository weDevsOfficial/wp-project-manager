import React from "react";
import { Navigate } from "react-router-dom";
import { useI18n } from "@hooks/useI18n";
import { usePermissions } from "@hooks/usePermissions";
import { useProModal } from "@components/common/ProUpgradeModal";
import ProBadge from "@components/common/ProBadge";
import { Button } from "@components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  Users,
  Milestone,
  UserX,
  BarChart3,
  Crown,
  Lock,
  Eye,
} from "lucide-react";

const REPORTS = [
  {
    id: "overdue",
    title: "Overdue Task(s)",
    desc: "Generate a report based on tasks which are pending beyond due dates.",
    icon: AlertTriangle,
    color: "text-red-500 bg-red-50",
  },
  {
    id: "completed",
    title: "Complete Task(s)",
    desc: "Generate a report from tasks which were completed.",
    icon: CheckCircle,
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    id: "user-activities",
    title: "User Activities",
    desc: "Create a report based on an employee or all employee activity on tasks.",
    icon: Users,
    color: "text-blue-500 bg-blue-50",
  },
  {
    id: "milestone",
    title: "Task by Milestone",
    desc: "Browse tasks reports according to Milestones (CSV exportable).",
    icon: Milestone,
    color: "text-purple-500 bg-purple-50",
  },
  {
    id: "unassigned",
    title: "Unassigned Task",
    desc: "Find out all tasks which were not assigned to any employee.",
    icon: UserX,
    color: "text-amber-500 bg-amber-50",
  },
  {
    id: "summary",
    title: "Summary",
    desc: "Browse summary reports with charts and estimation data (CSV exportable).",
    icon: BarChart3,
    color: "text-indigo-500 bg-indigo-50",
  },
];

export default function ReportsPage() {
  const { __ } = useI18n();
  const { isPro, isProLicensed } = usePermissions();
  const { setOpen } = useProModal();

  if (isPro && !isProLicensed) return <Navigate to="/license" replace />;

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-pm-text-primary">
            {__("Reports")}
          </h1>
          <p className="text-sm text-pm-text-muted mt-0.5">
            {__("Generate actionable insights from your project data")}
          </p>
        </div>
        {!isPro && <ProBadge label={__("Pro Required")} />}
      </div>

      {/* Report cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPORTS.map((r) => {
          const [fg, bg] = r.color.split(" ");
          return (
            <div
              key={r.id}
              className="group relative rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5 text-center space-y-3">
                {/* Icon */}
                <div className="inline-flex">
                  <div
                    className={`p-3 rounded-xl ${bg} group-hover:scale-110 transition-transform`}
                  >
                    <r.icon className={`h-6 w-6 ${fg}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-pm-text-primary">
                  {__(r.title)}
                  {!isPro && <ProBadge className="ml-2 align-middle" />}
                </h3>

                {/* Description */}
                <p className="text-sm text-pm-text-muted leading-relaxed min-h-[40px]">
                  {__(r.desc)}
                </p>

                {/* Action button */}
                {isPro ? (
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Eye className="h-4 w-4" />
                    {__("View Full Report")}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setOpen(true)}
                  >
                    <Lock className="h-4 w-4" />
                    {__("View Full Report")}
                  </Button>
                )}
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
                      {__("Upgrade to Pro")}
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
