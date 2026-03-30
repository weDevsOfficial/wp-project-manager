import React from "react";
import { Navigate } from "react-router-dom";
import { useI18n } from "@hooks/useI18n";
import { usePermissions } from "@hooks/usePermissions";
import { useProModal } from "@components/common/ProUpgradeModal";
import ProBadge from "@components/common/ProBadge";
import { Calendar, Crown, Lock } from "lucide-react";

export default function CalendarPage() {
  const { __ } = useI18n();
  const { isPro, isProLicensed } = usePermissions();
  const { setOpen } = useProModal();

  // Pro installed but not licensed — redirect to license page
  if (isPro && !isProLicensed) return <Navigate to="/license" replace />;

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-pm-text-primary">
            {__("Calendar")}
          </h1>
          <p className="text-sm text-pm-text-muted mt-0.5">
            {__(
              "Get the birdseye view of all tasks from an interactive calendar",
            )}
          </p>
        </div>
        {!isPro && <ProBadge label={__("Pro Required")} />}
      </div>

      {/* Calendar preview card */}
      <div className="group relative rounded-xl border bg-card overflow-hidden">
        <div className="p-6">
          {/* Calendar mockup */}
          <div className="space-y-4">
            {/* Month header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-pm-text-primary">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <div className="flex gap-1">
                <div className="h-7 w-16 rounded bg-muted/50" />
                <div className="h-7 w-16 rounded bg-muted/50" />
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="text-center text-[15px] font-semibold text-pm-text-muted py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => {
                const day =
                  i -
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1,
                  ).getDay() +
                  1;
                const maxDay = new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  0,
                ).getDate();
                const isValid = day > 0 && day <= maxDay;
                const isToday = day === new Date().getDate();
                const hasTask =
                  isValid && [3, 7, 12, 15, 18, 22, 25, 28].includes(day);

                return (
                  <div
                    key={i}
                    className={`relative rounded-lg p-2 min-h-[60px] ${
                      isToday
                        ? "bg-pm-accent/10 border border-pm-accent/30"
                        : isValid
                        ? "bg-muted/20"
                        : ""
                    }`}
                  >
                    {isValid && (
                      <>
                        <span
                          className={`text-sm ${
                            isToday
                              ? "font-bold text-pm-accent"
                              : "text-pm-text-muted"
                          }`}
                        >
                          {day}
                        </span>
                        {hasTask && (
                          <div className="mt-1 space-y-0.5">
                            <div className="h-1.5 rounded-full bg-pm-accent/40 w-full" />
                            {day % 5 === 0 && (
                              <div className="h-1.5 rounded-full bg-emerald-400/40 w-3/4" />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pro overlay */}
        {!isPro && (
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setOpen(true)}
          >
            <div className="bg-white rounded-2xl px-8 py-6 shadow-xl text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-pm-accent/10 mb-4">
                <Calendar className="h-7 w-7 text-pm-accent" />
              </div>
              <h3 className="text-lg font-bold text-pm-text-primary mb-1">
                {__("Interactive Calendar")}
              </h3>
              <p className="text-sm text-pm-text-muted mb-4 max-w-[250px]">
                {__(
                  "View all your tasks, milestones, and deadlines in a beautiful calendar view.",
                )}
              </p>
              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
                style={{ background: "#ff9000" }}
              >
                <Crown className="h-5 w-5" />
                {__("Upgrade to Pro")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
