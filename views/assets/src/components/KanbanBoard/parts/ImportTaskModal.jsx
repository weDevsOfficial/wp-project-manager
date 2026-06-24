import { __ } from '@wordpress/i18n';
import React, { useEffect, useState, useMemo } from "react";
import { useApi } from "@hooks/useApi";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { Checkbox } from "@components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { ScrollArea } from "@components/ui/scroll-area";
import { Import } from "lucide-react";

const api = useApi();

export default function ImportTaskModal({ open, onOpenChange, projectId, boardId, onImport }) {
  const [taskLists, setTaskLists] = useState([]);
  const [selectedList, setSelectedList] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [tab, setTab] = useState("all");
  const [loadingLists, setLoadingLists] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingLists(true);
    api
      .get(`projects/${projectId}/task-lists`, { per_page: -1 })
      .then((res) => {
        const d = res?.data ?? res;
        setTaskLists(Array.isArray(d) ? d : Object.values(d || {}));
      })
      .catch(() => setTaskLists([]))
      .finally(() => setLoadingLists(false));
  }, [open, projectId]);

  useEffect(() => {
    if (!selectedList) {
      setTasks([]);
      return;
    }
    setLoadingTasks(true);
    setSelectedTasks([]);
    api
      .get("tasks", {
        project_id: projectId,
        task_list_id: [selectedList],
        per_page: -1,
      })
      .then((res) => {
        const d = res?.data ?? res;
        setTasks(Array.isArray(d) ? d : Object.values(d || {}));
      })
      .catch(() => setTasks([]))
      .finally(() => setLoadingTasks(false));
  }, [selectedList, projectId]);

  const filtered = useMemo(() => {
    if (tab === "complete")
      return tasks.filter((t) => t.status === 1 || t.status === "complete");
    if (tab === "incomplete")
      return tasks.filter((t) => t.status === 0 || t.status === "incomplete");
    return tasks;
  }, [tasks, tab]);

  const toggleTask = (id) =>
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const selectAll = () =>
    setSelectedTasks(
      filtered.length === selectedTasks.length ? [] : filtered.map((t) => t.id),
    );

  const handleImport = () => {
    if (selectedTasks.length === 0) return;
    onImport(selectedTasks, boardId);
    onOpenChange(false);
    setSelectedTasks([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col overflow-hidden" data-pm-dialog>
        <DialogHeader>
          <DialogTitle>{__("Import Task", 'wedevs-project-manager')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          {loadingLists ? (
            <p className="text-sm text-pm-text-muted">{__("Loading...", 'wedevs-project-manager')}</p>
          ) : (
            <div className="space-y-1.5">
              <Label>{__("Task List", 'wedevs-project-manager')}</Label>
              <Select
                value={selectedList || "none"}
                onValueChange={(v) => setSelectedList(v === "none" ? "" : v)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder={__("Select Task List", 'wedevs-project-manager')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{__("Select Task List", 'wedevs-project-manager')}</SelectItem>
                  {taskLists.map((l) => (
                    <SelectItem key={l.id} value={String(l.id)}>
                      {l.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedList && (
            <>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="h-8 max-w-full overflow-x-auto scrollbar-none">
                  <TabsTrigger value="all" className="text-sm px-3 h-6 shrink-0 whitespace-nowrap">
                    {__("All", 'wedevs-project-manager')}
                  </TabsTrigger>
                  <TabsTrigger value="complete" className="text-sm px-3 h-6 shrink-0 whitespace-nowrap">
                    {__("Completed", 'wedevs-project-manager')}
                  </TabsTrigger>
                  <TabsTrigger value="incomplete" className="text-sm px-3 h-6 shrink-0 whitespace-nowrap">
                    {__("Incomplete", 'wedevs-project-manager')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-2 border-b pb-2">
                <Checkbox
                  id="kan-sel-all"
                  checked={
                    filtered.length > 0 &&
                    selectedTasks.length === filtered.length
                  }
                  onCheckedChange={selectAll}
                />
                <label
                  htmlFor="kan-sel-all"
                  className="text-sm font-medium cursor-pointer"
                >
                  {__("Select All", 'wedevs-project-manager')}
                </label>
              </div>
              <ScrollArea className="h-48 border rounded-md">
                {loadingTasks ? (
                  <div className="p-4 text-sm text-center text-pm-text-muted">
                    {__("Loading...", 'wedevs-project-manager')}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="p-4 text-sm text-center text-pm-text-muted">
                    {__("No tasks found", 'wedevs-project-manager')}
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filtered.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-2 py-1 px-1 rounded hover:bg-muted/30 overflow-hidden"
                      >
                        <Checkbox
                          id={`kt-${t.id}`}
                          checked={selectedTasks.includes(t.id)}
                          onCheckedChange={() => toggleTask(t.id)}
                        />
                        <label
                          htmlFor={`kt-${t.id}`}
                          className="text-sm cursor-pointer flex-1 truncate min-w-0"
                        >
                          {t.title}
                        </label>
                        {tab === "all" && (
                          <Badge
                            variant={
                              t.status === 1 || t.status === "complete"
                                ? "default"
                                : "secondary"
                            }
                            className="text-[11px] px-1.5 shrink-0"
                          >
                            {t.status === 1 || t.status === "complete"
                              ? __("Completed", 'wedevs-project-manager')
                              : __("Incomplete", 'wedevs-project-manager')}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </div>
        <DialogFooter className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            {__("Cancel", 'wedevs-project-manager')}
          </Button>
          <Button
            size="sm"
            onClick={handleImport}
            disabled={selectedTasks.length === 0}
          >
            <Import className="h-4 w-4 mr-1" />
            {__("Import", 'wedevs-project-manager')}{" "}
            {selectedTasks.length > 0 && `(${selectedTasks.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
