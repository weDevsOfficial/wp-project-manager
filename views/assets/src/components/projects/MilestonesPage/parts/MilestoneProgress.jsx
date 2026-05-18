import { __ } from '@wordpress/i18n';
import React from "react";
import { Progress } from "@components/ui/progress";

export default function MilestoneProgress({ progress, taskCount }) {
  const total = taskCount?.total ?? 0;
  const completed = taskCount?.completed ?? 0;

  if (total === 0) {
    return (
      <span className="text-sm text-pm-text-muted italic">
        {__("No tasks linked", 'wedevs-project-manager')}
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
