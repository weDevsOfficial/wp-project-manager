import { __ } from '@wordpress/i18n';
import React, { useEffect, useMemo, useState } from "react";
import { useApi } from "@hooks/useApi";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Filter, X } from "lucide-react";

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
    <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg border mb-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={__("Search title (min 3 chars)...", 'wedevs-project-manager')}
        className="h-8 text-sm w-48"
        onKeyDown={(e) => e.key === "Enter" && handleApply()}
      />
      <Select
        value={userId || "all"}
        onValueChange={(v) => setUserId(v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-8 text-sm w-40">
          <SelectValue placeholder={__("All Users", 'wedevs-project-manager')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{__("All Users", 'wedevs-project-manager')}</SelectItem>
          {users.map((u) => (
            <SelectItem
              key={u.id || u.user_id}
              value={String(u.id || u.user_id)}
            >
              {u.display_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={listId || "all"}
        onValueChange={(v) => setListId(v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-8 text-sm w-40">
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
        <SelectTrigger className="h-8 text-sm w-40">
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
        <SelectTrigger className="h-8 text-sm w-36">
          <SelectValue placeholder={__("All Status", 'wedevs-project-manager')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{__("All", 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="incomplete">{__("Incomplete", 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="complete">{__("Complete", 'wedevs-project-manager')}</SelectItem>
        </SelectContent>
      </Select>
      <Button size="sm" className="h-8" onClick={handleApply}>
        <Filter className="h-4 w-4 mr-1" />
        {__("Apply", 'wedevs-project-manager')}
      </Button>
      <Button size="sm" variant="ghost" className="h-8" onClick={handleClear}>
        <X className="h-4 w-4 mr-1" />
        {__("Clear", 'wedevs-project-manager')}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 ml-auto"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
