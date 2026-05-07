import React from "react";
import { useI18n } from "@hooks/useI18n";
import { Progress } from "@components/ui/progress";

export default function MilestoneProgress({ progress, taskCount }) {
  const { __ } = useI18n();
  const total = taskCount?.total ?? 0;
  const completed = taskCount?.completed ?? 0;

  if (total === 0) {
    return (
      <span className="text-sm text-pm-text-muted italic">
        {__("No tasks linked")}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 min-w-0">
      <Progress value={progress} className="h-1.5 flex-1 max-w-[120px]" />
      <span className="text-sm text-pm-text-muted tabular-nums whitespace-nowrap">
        {progress}% ({completed}/{total})
      </span>
    </div>
  );
}
