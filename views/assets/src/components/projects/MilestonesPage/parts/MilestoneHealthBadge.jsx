import React, { useMemo } from "react";
import { cn } from "@lib/utils";
import { getHealthConfig } from "../constants";

export default function MilestoneHealthBadge({ health }) {
  const healthConfig = useMemo(() => getHealthConfig(), []);
  const cfg = healthConfig[health] || healthConfig["no-date"];
  const Icon = cfg.icon;

  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full border", cfg.className)}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}
