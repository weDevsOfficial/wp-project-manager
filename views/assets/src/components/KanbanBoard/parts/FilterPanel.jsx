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
  onActiveCountChange,
}) {
  const DUE_DATE_OPTIONS = useMemo(() => getDueDateOptions(), []);
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("");
  const [listId, setListId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [labelId, setLabelId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [milestoneId, setMilestoneId] = useState("");
  const [lists, setLists] = useState([]);
  const [labels, setLabels] = useState([]);
  const [types, setTypes] = useState([]);
  const [milestones, setMilestones] = useState([]);

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

  useEffect(() => {
    if (!open || !projectId) return;

    if (labels.length === 0) {
      api
        .get(`projects/${projectId}`, { with: "labels" })
        .then((res) => setLabels(res?.data?.labels?.data ?? []))
        .catch(() => {});
    }

    if (types.length === 0) {
      api
        .get("settings/task-types")
        .then((res) => setTypes(res?.data ?? []))
        .catch(() => {});
    }

    if (milestones.length === 0) {
      api
        .get(`projects/${projectId}/milestones`, { per_page: 50 })
        .then((res) => setMilestones(res?.data ?? []))
        .catch(() => {});
    }
  }, [open, projectId, labels.length, types.length, milestones.length]);

  // Title is not here: the board search box above owns it, so the panel would
  // otherwise be a second input writing the same request parameter.
  const activeCount = [userId, status, listId, dueDate, priority !== "" ? priority : "", labelId, typeId, milestoneId].filter(Boolean).length

  useEffect(() => {
    onActiveCountChange?.(activeCount)
  }, [activeCount, onActiveCountChange])

  const handleApply = () => {
    onFilter({
      users: userId ? [userId] : [],
      lists: listId ? [listId] : [],
      dueDate,
      status,
      // "0" is Low, a real choice, so it is passed through as a string and
      // only the empty string means "no priority filter".
      priority,
      labels: labelId ? [Number(labelId)] : [],
      types: typeId ? [Number(typeId)] : [],
      milestone: milestoneId ? Number(milestoneId) : "",
    });
  };

  const handleClear = () => {
    setUserId("");
    setStatus("");
    setListId("");
    setDueDate("");
    setPriority("");
    setLabelId("");
    setTypeId("");
    setMilestoneId("");
    onClear();
  };

  if (!open) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2.5 mb-3 flex items-center gap-2 flex-wrap">
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
      <Select
        value={priority === "" ? "all" : priority}
        onValueChange={(v) => setPriority(v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-11 text-sm w-auto sm:w-36">
          <SelectValue placeholder={__("Any Priority", 'wedevs-project-manager')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{__("Any Priority", 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="0">{__("Low", 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="1">{__("Medium", 'wedevs-project-manager')}</SelectItem>
          <SelectItem value="2">{__("High", 'wedevs-project-manager')}</SelectItem>
        </SelectContent>
      </Select>
      {labels.length > 0 && (
        <Select
          value={labelId || "all"}
          onValueChange={(v) => setLabelId(v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-11 text-sm w-auto sm:w-36">
            <SelectValue placeholder={__("All Labels", 'wedevs-project-manager')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{__("All Labels", 'wedevs-project-manager')}</SelectItem>
            {labels.map((l) => (
              <SelectItem key={l.id} value={String(l.id)}>{l.title || l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {types.length > 0 && (
        <Select
          value={typeId || "all"}
          onValueChange={(v) => setTypeId(v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-11 text-sm w-auto sm:w-36">
            <SelectValue placeholder={__("All Types", 'wedevs-project-manager')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{__("All Types", 'wedevs-project-manager')}</SelectItem>
            {types.map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>{t.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {milestones.length > 0 && (
        <Select
          value={milestoneId || "all"}
          onValueChange={(v) => setMilestoneId(v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-11 text-sm w-auto sm:w-40">
            <SelectValue placeholder={__("All Milestones", 'wedevs-project-manager')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{__("All Milestones", 'wedevs-project-manager')}</SelectItem>
            {milestones.map((m) => (
              <SelectItem key={m.id} value={String(m.id)}>{m.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
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
