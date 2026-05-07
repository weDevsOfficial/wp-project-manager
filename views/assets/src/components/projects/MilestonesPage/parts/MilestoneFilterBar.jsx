import React from "react";
import { useI18n } from "@hooks/useI18n";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { filterTabs, sortOptions } from "../constants";

export default function MilestoneFilterBar({ filter, sort, counts, onFilterChange, onSortChange }) {
  const { __ } = useI18n();

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="inline-flex items-center rounded-lg bg-muted/60 p-1 gap-0.5">
        {filterTabs.map((tab) => {
          const count = counts[tab.key] ?? 0;
          const isActive = filter === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange(tab.key)}
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-background text-pm-text-primary shadow-sm"
                  : "text-pm-text-muted hover:text-pm-text-primary",
              )}
            >
              {__(tab.label)}
              <span
                className="inline-flex items-center justify-center rounded-full px-1.5 min-w-[18px] h-[18px] text-[14px] font-semibold tabular-nums transition-colors"
                style={isActive ? { backgroundColor: tab.color + '15', color: tab.color } : { color: 'var(--pm-text-muted)' }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm">
            <ArrowUpDown className="h-3.5 w-3.5" />
            {__(sortOptions.find((s) => s.value === sort)?.label ?? "Sort")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={cn(sort === opt.value && "font-medium text-primary")}
            >
              {__(opt.label)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
