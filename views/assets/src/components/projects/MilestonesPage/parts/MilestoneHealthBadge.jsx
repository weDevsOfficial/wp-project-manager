import { __ } from '@wordpress/i18n';
import React from "react";
import { cn } from "@lib/utils";
import { healthConfig } from "../constants";

export default function MilestoneHealthBadge({ health }) {
  const cfg = healthConfig[health] || healthConfig["no-date"];
  const Icon = cfg.icon;

  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full border", cfg.className)}>
      <Icon className="h-3 w-3" />
      {__(cfg.label, 'wedevs-project-manager')}
    </span>
  );
}
