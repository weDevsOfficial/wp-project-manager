import React, { useEffect, useState } from "react";
import { useApi } from "@hooks/useApi";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import RichTextEditor from "@components/common/RichTextEditor";
import { Skeleton } from "@components/ui/skeleton";
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
import { Loader2 } from "lucide-react";

export default function NewTaskSheet({ open, onOpenChange, userId, onCreated }) {
  const api = useApi();
  const { __ } = useI18n();
  const toast = useToast();

  const [projects, setProjects] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!title.trim() || !selectedProject || !selectedList) return;
    setSaving(true);
    try {
      await api.post(`projects/${selectedProject}/tasks`, {
        title: title.trim(),
        description: description.trim() || undefined,
        board_id: selectedList,
        assignees: [userId],
      });
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
          <div className="space-y-2">
            <Label>
              {__("Project")} <span className="text-destructive">*</span>
            </Label>
            {loadingProjects ? (
              <Skeleton className="h-10 rounded-md" />
            ) : (
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
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

          <div className="space-y-2">
            <Label>{__("Description")}</Label>
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder={__("Add a description (optional)")}
            />
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {__("Cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              saving || !title.trim() || !selectedProject || !selectedList
            }
          >
            {saving && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
            {saving ? __("Creating...") : __("Create Task")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
