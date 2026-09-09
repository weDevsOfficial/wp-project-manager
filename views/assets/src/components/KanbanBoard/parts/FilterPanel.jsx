import { __ } from '@wordpress/i18n';
import React, { useEffect, useMemo, useState } from "react";
import { useApi } from "@hooks/useApi";
import { UserAvatar } from "@components/common/UserAvatar";
import { Button } from "@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Filter, X, Search } from "lucide-react";

const api = useApi();

const getDueDateOptions = () => [
  { id: "", title: __("Any", 'wedevs-project-manager') },
  { id: "overdue", title: __("Overdue", 'wedevs-project-manager') },
  { id: "today", title: __("Today", 'wedevs-project-manager') },
  { id: "week", title: __("This Week", 'wedevs-project-manager') },
  { id: "no_due_date", title: __("No Due Date", 'wedevs-project-manager') },
];

export default function FilterPanel({
  open,
  onClose,
  projectId,
  users,
  onFilter,
  onClear,
  onActiveCountChange,
}) {
  const DUE_DATE_OPTIONS = useMemo(() => getDueDateOptions(), []);
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("");
  const [listId, setListId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lists, setLists] = useState([]);

  useEffect(() => {
    if (!open || !projectId) return;
    api
      .get(`projects/${projectId}/task-lists`, { per_page: -1 })
      .then((res) => {
        const d = res?.data ?? res;
        setLists(Array.isArray(d) ? d : Object.values(d || {}));
      })
      .catch(() => setLists([]));
  }, [open, projectId]);

  const activeCount = [title.trim(), userId, status, listId, dueDate].filter(Boolean).length

  useEffect(() => {
    onActiveCountChange?.(activeCount)
  }, [activeCount, onActiveCountChange])

  const handleApply = () => {
    if (title && title.length < 3) return;
    onFilter({
      users: userId ? [userId] : [],
      title,
      lists: listId ? [listId] : [],
      dueDate,
      status,
    });
  };

  const handleClear = () => {
    setTitle("");
    setUserId("");
    setStatus("");
    setListId("");
    setDueDate("");
    onClear();
  };

  if (!open) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2.5 mb-3 flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 flex-1 min-w-[160px] max-w-[240px] h-11 rounded-md border border-input bg-background px-2.5 focus-within:ring-1 focus-within:ring-pm-accent/40 focus-within:border-pm-accent">
        <Search className="h-4 w-4 text-pm-text-muted shrink-0" />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={__("Search title (min 3 chars)...", 'wedevs-project-manager')}
          className="flex-1 min-w-0 h-full bg-transparent text-sm text-pm-text-primary placeholder:text-muted-foreground focus:outline-none !border-0 !p-0 !shadow-none"
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
        />
      </div>
      <Select
        value={userId || "all"}
        onValueChange={(v) => setUserId(v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-11 text-sm w-auto sm:w-40">
          <SelectValue placeholder={__("All Users", 'wedevs-project-manager')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{__("All Users", 'wedevs-project-manager')}</SelectItem>
          {users.map((u) => (
            <SelectItem
              key={u.id || u.user_id}
              value={String(u.id || u.user_id)}
            >
              <span className="flex items-center gap-2"><UserAvatar user={u} size="sm" />{u.display_name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={listId || "all"}
        onValueChange={(v) => setListId(v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-11 text-sm w-auto sm:w-40">
          <SelectValue placeholder={__("All Lists", 'wedevs-project-manager')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{__("All Lists", 'wedevs-project-manager')}</SelectItem>
          {lists.map((l) => (
            <SelectItem key={l.id} value={String(l.id)}>
              {l.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={dueDate || "all"}
        onValueChange={(v) => setDueDate(v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-11 text-sm w-auto sm:w-40">
          <SelectValue placeholder={__("Any Due Date", 'wedevs-project-manager')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{__("Any Due Date", 'wedevs-project-manager')}</SelectItem>
          {DUE_DATE_OPTIONS.filter((o) => o.id).map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={status || "all"}
        onValueChange={(v) => setStatus(v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-11 text-sm w-auto sm:w-36">
          <SelectValue placeholder={__("All Status", 'wedevs-project-manager')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{__("All", 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="incomplete">{__("Incomplete", 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="complete">{__("Complete", 'wedevs-project-manager')}</SelectItem>
        </SelectContent>
      </Select>
      <Button size="sm" className="h-11 text-sm gap-1" onClick={handleApply}>
        <Filter className="h-4 w-4" />
        {__("Apply", 'wedevs-project-manager')}
      </Button>
      {activeCount > 0 && (
        <Button variant="outline" size="sm" className="h-11 text-sm gap-1" onClick={handleClear}>
          <X className="h-3.5 w-3.5" />
          {__("Clear", 'wedevs-project-manager')}
        </Button>
      )}
      <Button
        aria-label={__("Close filters", 'wedevs-project-manager')}
        size="icon"
        variant="ghost"
        className="h-7 w-7 ml-auto shrink-0"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
