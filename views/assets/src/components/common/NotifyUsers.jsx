import React, { useMemo } from "react";
import { Checkbox } from "@components/ui/checkbox";
import { UserAvatar } from "@components/common/UserAvatar";
import { useI18n } from "@hooks/useI18n";
import { usePermissions } from "@hooks/usePermissions";

export default function NotifyUsers({ users = [], value = [], onChange, className = "" }) {
  const { __ } = useI18n();
  const { currentUserId } = usePermissions();

  const assainUsers = useMemo(
    () => (users || []).filter((u) => String(u.id) !== String(currentUserId)),
    [users, currentUserId]
  );

  if (assainUsers.length === 0) return null;

  const allSelected = value.length === assainUsers.length && assainUsers.length > 0;

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

  return (
    <div className={`rounded-lg border bg-card p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-pm-text-primary">
          {__("Notify users")}
        </h4>
        <label className="flex items-center gap-1.5 text-xs text-pm-text-muted cursor-pointer">
          <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
          {__("Select all")}
        </label>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {assainUsers.map((u) => {
          const sid = String(u.id);
          const checked = value.includes(sid);
          return (
            <li key={u.id}>
              <label className="flex items-center gap-2 text-sm text-pm-text-primary cursor-pointer py-0.5">
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
    </div>
  );
}
