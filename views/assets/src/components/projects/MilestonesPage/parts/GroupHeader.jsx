import React from "react";
import { cn } from "@lib/utils";
import { Badge } from "@components/ui/badge";
import { groupConfig } from "../constants";

export default function GroupHeader({ label, count, groupKey }) {
  const cfg = groupConfig[groupKey] || groupConfig.upcoming;
  const Icon = cfg.icon;

  return (
    <h3
      className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground/70 flex items-center gap-1.5"
    >
      <Icon className="h-4 w-4" />
      {label}
      <Badge variant="secondary" className="text-[12px] bg-muted px-1.5 py-0.5 rounded-md font-medium">
        {count}
      </Badge>
    </h3>
  );
}
