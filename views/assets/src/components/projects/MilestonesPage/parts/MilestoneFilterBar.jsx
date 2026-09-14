import { __ } from '@wordpress/i18n';
import React, { useMemo } from "react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { getFilterTabs, getSortOptions } from "../constants";

export default function MilestoneFilterBar({ filter, sort, counts, onFilterChange, onSortChange }) {
  const filterTabs = useMemo(() => getFilterTabs(), []);
  const sortOptions = useMemo(() => getSortOptions(), []);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="inline-flex max-w-full items-center rounded-lg border border-pm-border bg-muted/60 p-1 gap-0.5 overflow-x-auto scrollbar-none">
        {filterTabs.map((tab) => {
          const count = counts[tab.key] ?? 0;
          const isActive = filter === tab.key;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange(tab.key)}
              className={cn(
                "relative inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-background text-pm-accent shadow-sm"
                  : "text-pm-text-muted hover:text-pm-text-primary",
              )}
            >
              {TabIcon && <TabIcon className="h-4 w-4" />}
              {tab.label}
              <span
                className="inline-flex items-center justify-center rounded-md px-1.5 min-w-[18px] h-[18px] text-[14px] font-medium tabular-nums transition-colors"
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
          <Button variant="outline" size="sm" className="h-11 gap-1.5 text-sm">
            <ArrowUpDown className="h-4 w-4" />
            {sortOptions.find((s) => s.value === sort)?.label ?? __("Sort", 'wedevs-project-manager')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={cn(sort === opt.value && "font-medium text-primary")}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
