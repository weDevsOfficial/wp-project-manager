import { __, sprintf, _n } from '@wordpress/i18n';
import React, { useMemo } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Checkbox } from "@components/ui/checkbox";
import { Button } from "@components/ui/button";
import { UserAvatar } from "@components/common/UserAvatar";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { usePermissions } from "@hooks/usePermissions";

export default function NotifyUsers({ users = [], value = [], onChange, className = "" }) {
  const { currentUserId } = usePermissions();

  const assainUsers = useMemo(
    () => (users || []).filter((u) => String(u.id) !== String(currentUserId)),
    [users, currentUserId]
  );

  if (assainUsers.length === 0) return null;

  const allSelected = value.length === assainUsers.length && assainUsers.length > 0;
  const count = value.length;

  const toggleAll = (checked) => {
    if (checked) onChange(assainUsers.map((u) => String(u.id)));
    else onChange([]);
  };

  const toggleOne = (id, checked) => {
    const sid = String(id);
    if (checked) {
      if (!value.includes(sid)) onChange([...value, sid]);
    } else {
      onChange(value.filter((v) => v !== sid));
    }
  };

  const label = count > 0
    ? sprintf(/* translators: %d is the number of users who will be notified. */ _n('Notify %d user', 'Notify %d users', count, 'wedevs-project-manager'), count)
    : __('Notify users', 'wedevs-project-manager');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={`h-11 px-4 gap-1.5 text-sm ${count > 0 ? 'border-pm-accent/40 text-pm-accent' : 'text-pm-text-muted'} ${className}`}
        >
          <Bell className="h-4 w-4" />
          {label}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 max-w-[calc(100vw-1rem)] p-0 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-pm-border">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-pm-text-primary">
            <Bell className="h-4 w-4 text-pm-text-muted" />
            {__("Notify users", 'wedevs-project-manager')}
          </span>
          <label className="flex items-center gap-1.5 text-xs font-medium text-pm-text-muted cursor-pointer select-none hover:text-pm-text-primary transition-colors">
            <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
            {__("Select all", 'wedevs-project-manager')}
          </label>
        </div>
        <ul className="max-h-64 overflow-y-auto p-1">
          {assainUsers.map((u) => {
            const sid = String(u.id);
            const checked = value.includes(sid);
            return (
              <li key={u.id}>
                <label
                  className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-pm-text-primary cursor-pointer select-none transition-colors ${
                    checked ? "bg-pm-accent/5" : "hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(c) => toggleOne(u.id, c)}
                  />
                  <UserAvatar user={u} size="sm" />
                  <span className="truncate">{u.display_name || u.name}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
