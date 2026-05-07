import React from "react";
import { cn } from "@lib/utils";
import { Badge } from "@components/ui/badge";
import { groupConfig } from "../constants";

export default function GroupHeader({ label, count, groupKey }) {
  const cfg = groupConfig[groupKey] || groupConfig.upcoming;
  const Icon = cfg.icon;

  return (
    <h3
      className={cn(
        "text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5",
        cfg.color,
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      <Badge variant="secondary" className="text-[11px] px-1.5 font-normal">
        {count}
      </Badge>
    </h3>
  );
}
