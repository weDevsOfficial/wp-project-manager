import React, { useEffect, useState, useCallback } from "react";
import { useApi } from "@hooks/useApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import RichTextEditor from "@components/common/RichTextEditor";
import { Skeleton } from "@components/ui/skeleton";
import { UserAvatar } from "@components/common/UserAvatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Loader2, X, UserPlus, Calendar } from "lucide-react";
import { cn } from "@lib/utils";

const getCurrentUser = () => {
  if (typeof PM_Vars === 'undefined') return null
  const u = PM_Vars.current_user
  return {
    id: u?.ID ?? u?.data?.ID ?? u?.id,
    display_name: u?.data?.display_name || u?.display_name || u?.data?.user_login || '',
    avatar_url: u?.data?.avatar_url || u?.avatar_url || PM_Vars.avatar_url || '',
  }
}

export default function NewTaskSheet({ open, onOpenChange, userId, onCreated, defaultDueDate = '' }) {
  const api = useApi();
  const { __ } = useI18n();
  const toast = useToast();

  const [projects, setProjects] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState(() => {
    const u = getCurrentUser()
    return u?.id ? [u] : []
  });
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const selectedProjectMembers = (projects.find(p => String(p.id) === String(selectedProject))?.assignees?.data) ?? []
  const assigneeResults = assigneeSearch.trim().length === 0
    ? selectedProjectMembers
    : selectedProjectMembers.filter(u => (u.display_name || '').toLowerCase().includes(assigneeSearch.toLowerCase()))
  const [showAssigneeSearch, setShowAssigneeSearch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    if (!open || !userId) return;
    setLoadingProjects(true);
    api
      .get("projects", {
        select: "id, title",
        with: "assignees",
        status: "incomplete",
        per_page: 100,
      })
      .then((res) => {
        const p = res.data ?? [];
        setProjects(p);
        if (p.length > 0) setSelectedProject(String(p[0].id));
      })
      .catch(() => {})
      .finally(() => setLoadingProjects(false));
  }, [open, userId]);

  useEffect(() => {
    if (!selectedProject) {
      setLists([]);
      setSelectedList("");
      return;
    }
    setLoadingLists(true);
    api
      .get(`projects/${selectedProject}/task-lists`, {
        select: "id, title",
        per_page: 300,
      })
      .then((res) => {
        const l = res.data ?? [];
        setLists(l);
        if (l.length > 0) setSelectedList(String(l[0].id));
        else setSelectedList("");
      })
      .catch(() => {})
      .finally(() => setLoadingLists(false));
  }, [selectedProject]);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setSelectedProject("");
      setSelectedList("");
      setProjects([]);
      setLists([]);
      setStartDate("");
      setDueDate("");
      const u = getCurrentUser()
      setSelectedAssignees(u?.id ? [u] : []);
      setAssigneeSearch("");
      setShowAssigneeSearch(false);
    } else if (defaultDueDate) {
      setDueDate(defaultDueDate);
    }
  }, [open, defaultDueDate]);

  const handleSearchUsers = useCallback((q) => {
    setAssigneeSearch(q);
  }, []);

  const addAssignee = useCallback((user) => {
    if (!selectedAssignees.find(u => parseInt(u.id) === parseInt(user.id))) {
      setSelectedAssignees(prev => [...prev, user]);
    }
    setAssigneeSearch("");
    setShowAssigneeSearch(false);
  }, [selectedAssignees]);

  const removeAssignee = useCallback((userId) => {
    setSelectedAssignees(prev => prev.filter(u => u.id !== userId));
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !selectedProject || !selectedList) return;
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        board_id: selectedList,
        assignees: selectedAssignees.length > 0 ? selectedAssignees.map(u => u.id) : [userId],
      };
      if (description.trim()) payload.description = description.trim();
      if (startDate) payload.start_at = startDate;
      if (dueDate) payload.due_date = dueDate;

      await api.post(`projects/${selectedProject}/tasks`, payload);
      toast.success(__("Task created"));
      onOpenChange(false);
      onCreated?.();
    } catch {
      toast.error(__("Failed to create task"));
    }
    setSaving(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[520px] flex flex-col p-0 gap-0"
      >
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>{__("New Task")}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Project */}
          <div className="space-y-2">
            <Label>
              {__("Project")} <span className="text-destructive">*</span>
            </Label>
            {loadingProjects ? (
              <Skeleton className="h-10 rounded-md" />
            ) : (
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder={__("Select a project")} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Task List */}
          <div className="space-y-2">
            <Label>
              {__("Task List")} <span className="text-destructive">*</span>
            </Label>
            {loadingLists ? (
              <Skeleton className="h-10 rounded-md" />
            ) : (
              <Select
                value={selectedList}
                onValueChange={setSelectedList}
                disabled={!selectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder={__("Select a list")} />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((l) => (
                    <SelectItem key={l.id} value={String(l.id)}>
                      {l.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Task Title */}
          <div className="space-y-2">
            <Label>
              {__("Task Title")} <span className="text-destructive">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={__("Enter task title")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>{__("Description")}</Label>
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder={__("Add a description (optional)")}
            />
          </div>

          {/* Assignees */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <UserPlus className="h-4 w-4" />
              {__("Assignees")}
            </Label>
            <div className="space-y-2">
              {selectedAssignees.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedAssignees.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center gap-1 bg-muted rounded-full pl-0.5 pr-2 py-0.5"
                    >
                      <UserAvatar user={user} size="xs" />
                      <span className="text-sm">{user.display_name}</span>
                      <button
                        type="button"
                        onClick={() => removeAssignee(user.id)}
                        className="text-pm-text-muted hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="relative">
                <Input
                  value={assigneeSearch}
                  onChange={(e) => handleSearchUsers(e.target.value)}
                  onFocus={() => setShowAssigneeSearch(true)}
                  onBlur={() => setTimeout(() => setShowAssigneeSearch(false), 150)}
                  placeholder={__("Search users...")}
                  className="h-9"
                />
                {showAssigneeSearch && assigneeResults.length > 0 && (
                  <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-background border rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {assigneeResults.map(user => (
                      <button
                        key={user.id}
                        type="button"
                        onMouseDown={() => addAssignee(user)}
                        className={cn(
                          "flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted text-left text-foreground",
                          selectedAssignees.find(u => u.id === user.id) && "opacity-50"
                        )}
                      >
                        <UserAvatar user={user} size="xs" />
                        <span>{user.display_name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {__("Dates")}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-xs text-pm-text-muted">{__("Start Date")}</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-pm-text-muted">{__("Due Date")}</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={startDate || undefined}
                  className="w-full h-9 rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {__("Cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || !title.trim() || !selectedProject || !selectedList}
          >
            {saving && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
            {saving ? __("Creating...") : __("Create Task")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
