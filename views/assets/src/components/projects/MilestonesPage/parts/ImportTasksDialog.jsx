import { __ } from '@wordpress/i18n';
import React, { useEffect, useMemo, useState } from "react";
import { useApi } from "@hooks/useApi";
import { useToast } from "@hooks/useToast";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { Checkbox } from "@components/ui/checkbox";
import { ScrollArea } from "@components/ui/scroll-area";
import { Skeleton } from "@components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { ListChecks, CheckCircle } from "lucide-react";

export default function ImportTasksDialog({ open, onOpenChange, milestone, projectId, onDone }) {
  const api = useApi();
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [linking, setLinking] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const linkedIds = useMemo(
    () => (milestone?.tasks?.data ?? []).map((t) => t.id),
    [milestone],
  );

  useEffect(() => {
    if (!open || !projectId) return;
    setLoading(true);
    setSelected([]);
    setSearch("");
    setTab("all");
    api.get("advanced/tasks", { project_id: projectId, per_page: -1 })
      .then((res) => {
        const items = res?.data ?? [];
        setTasks(Array.isArray(items) ? items : []);
      })
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [open, projectId, api]);

  const available = useMemo(() => {
    let filtered = tasks.filter((t) => !linkedIds.includes(t.id));
    if (tab === "complete") filtered = filtered.filter((t) => t.status === 1 || t.status === "1" || t.status === "complete");
    if (tab === "incomplete") filtered = filtered.filter((t) => t.status === 0 || t.status === "0" || t.status === "incomplete");
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((t) => (t.title || "").toLowerCase().includes(q));
    }
    return filtered;
  }, [tasks, linkedIds, tab, search]);

  const toggleTask = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selected.length === available.length) {
      setSelected([]);
    } else {
      setSelected(available.map((t) => t.id));
    }
  };

  const handleLink = async () => {
    if (selected.length === 0 || linking) return;
    setLinking(true);
    try {
      await api.post(`projects/${projectId}/milestones/${milestone.id}/attach-tasks`, {
        task_ids: selected,
      });
      toast.success(
        `${selected.length} ${selected.length === 1 ? __("task linked", 'wedevs-project-manager') : __("tasks linked", 'wedevs-project-manager')}`,
      );
      onOpenChange(false);
      onDone();
    } catch {
      toast.error(__("Failed to link tasks", 'wedevs-project-manager'));
    }
    setLinking(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col overflow-hidden" data-pm-dialog>
        <DialogHeader>
          <DialogTitle>{__("Link Tasks", 'wedevs-project-manager')}</DialogTitle>
          <DialogDescription className="sr-only">
            {__("Link tasks to this milestone", 'wedevs-project-manager')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <p className="text-sm text-pm-text-muted">
            {__("Select tasks to link to", 'wedevs-project-manager')} <strong>{milestone?.title}</strong>
          </p>

          <Input
            placeholder={__("Search tasks...", 'wedevs-project-manager')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
          />

          <div className="inline-flex items-center rounded-lg bg-muted/60 p-0.5 gap-0.5">
            {[
              { key: "all", label: __("All", 'wedevs-project-manager') },
              { key: "incomplete", label: __("Incomplete", 'wedevs-project-manager') },
              { key: "complete", label: __("Completed", 'wedevs-project-manager') },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                  tab === t.key
                    ? "bg-background text-pm-text-primary shadow-sm"
                    : "text-pm-text-muted hover:text-pm-text-primary",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-2 py-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 rounded" />
              ))}
            </div>
          ) : available.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-pm-text-muted">
                {tasks.length === 0
                  ? __("No tasks found in this project", 'wedevs-project-manager')
                  : search.trim()
                    ? __("No tasks match your search", 'wedevs-project-manager')
                    : __("All tasks are already linked", 'wedevs-project-manager')}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 border-b pb-2">
                <Checkbox
                  id="select-all-tasks"
                  checked={available.length > 0 && selected.length === available.length}
                  onCheckedChange={selectAll}
                />
                <label htmlFor="select-all-tasks" className="text-sm font-medium cursor-pointer">
                  {__("Select All", 'wedevs-project-manager')}
                </label>
                {selected.length > 0 && (
                  <Badge variant="secondary" className="text-[11px] ml-auto">
                    {selected.length} {__("selected", 'wedevs-project-manager')}
                  </Badge>
                )}
              </div>
              <ScrollArea className="h-52 border rounded-md">
                <div className="p-2 space-y-0.5">
                  {available.map((task) => {
                    const isDone = task.status === 1 || task.status === "1" || task.status === "complete";
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/30"
                      >
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={selected.includes(task.id)}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <label
                          htmlFor={`task-${task.id}`}
                          className={cn("text-sm cursor-pointer flex-1 truncate", isDone && "line-through text-pm-text-muted")}
                        >
                          {task.title}
                        </label>
                        {isDone && (
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
        <DialogFooter className="shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {__("Cancel", 'wedevs-project-manager')}
          </Button>
          <Button onClick={handleLink} disabled={selected.length === 0 || linking}>
            <ListChecks className="h-4 w-4 mr-1" />
            {__("Link", 'wedevs-project-manager')} {selected.length > 0 && `(${selected.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
