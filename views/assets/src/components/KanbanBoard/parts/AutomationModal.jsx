import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from "react";
import { useApi } from "@hooks/useApi";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import { UserAvatar } from '@components/common/UserAvatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { ScrollArea } from "@components/ui/scroll-area";
import { toast } from "sonner";

const api = useApi();

export default function AutomationModal({
  open,
  onOpenChange,
  projectId,
  board,
  users,
  taskLists,
  onSave,
}) {

  const existing = board?.automation || {};
  const [moveType, setMoveType] = useState(existing.type || "0");
  const [todoSection, setTodoSection] = useState(existing.todo?.section || "");
  const [todoLists, setTodoLists] = useState(existing.todo?.lists || []);
  const [inProgressReOpened, setInProgressReOpened] = useState(
    existing.inProgress?.reOpened === "yes",
  );
  const [doneCompleted, setDoneCompleted] = useState(
    existing.done?.completed === "yes",
  );
  const [assignedUsers, setAssignedUsers] = useState(existing.users || []);
  const [taskStatus, setTaskStatus] = useState(existing.taskStatus || "none");
  const [saving, setSaving] = useState(false);
  const [lists, setLists] = useState(taskLists || []);

  useEffect(() => {
    if (!open || lists.length > 0) return;
    api
      .get(`projects/${projectId}/task-lists`, { per_page: -1 })
      .then((res) => {
        const d = res?.data ?? res;
        setLists(Array.isArray(d) ? d : Object.values(d || {}));
      })
      .catch((err) => { if (typeof console !== 'undefined') console.warn('[PM] Failed to load task lists for automation:', err) });
  }, [open, projectId]);

  const toggleUser = (user) => {
    setAssignedUsers((prev) => {
      const exists = prev.find(
        (u) => (u.id || u.user_id) === (user.id || user.user_id),
      );
      return exists
        ? prev.filter((u) => (u.id || u.user_id) !== (user.id || user.user_id))
        : [...prev, user];
    });
  };

  const toggleList = (list) => {
    setTodoLists((prev) => {
      const exists = prev.find((l) => l.id === list.id);
      return exists ? prev.filter((l) => l.id !== list.id) : [...prev, list];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const actions = {
      type: moveType,
      todo: { section: todoSection, lists: todoLists },
      inProgress: { reOpened: inProgressReOpened ? "yes" : "" },
      done: { completed: doneCompleted ? "yes" : "" },
      users: assignedUsers,
      taskStatus,
    };
    try {
      await onSave(board.id, actions);
      toast.success(__("Automation updated", 'wedevs-project-manager'));
      onOpenChange(false);
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || __("Failed to save", 'wedevs-project-manager');
      toast.error(msg);
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh]" data-pm-dialog>
        <DialogHeader>
          <DialogTitle>{__("Manage Automation", 'wedevs-project-manager')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-130px)]">
          <div className="space-y-5 pr-3">
            <div className="space-y-2">
              <p className="text-sm text-pm-text-muted">
                {__(
                  "Choose a preset to automate your kanbanboard and sync with Task Lists", 'wedevs-project-manager',
                )}
              </p>
              <Label className="text-sm font-semibold">
                {__("Move Tasks", 'wedevs-project-manager')}
              </Label>
              <Select value={moveType} onValueChange={setMoveType}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{__("Select Type", 'wedevs-project-manager')}</SelectItem>
                  <SelectItem value="none">{__("None", 'wedevs-project-manager')}</SelectItem>
                  <SelectItem value="todo">{__("To Do", 'wedevs-project-manager')}</SelectItem>
                  <SelectItem value="in_progress">
                    {__("In Progress", 'wedevs-project-manager')}
                  </SelectItem>
                  <SelectItem value="done">{__("Done", 'wedevs-project-manager')}</SelectItem>
                  <SelectItem value="overdue">{__("Overdue", 'wedevs-project-manager')}</SelectItem>
                </SelectContent>
              </Select>

              {moveType === "none" && (
                <p className="text-sm text-pm-text-muted italic">
                  {__("This column will not be automated", 'wedevs-project-manager')}
                </p>
              )}

              {moveType === "todo" && (
                <div className="space-y-3 pl-1">
                  <Label className="text-sm font-medium">
                    {__("Move task here when...", 'wedevs-project-manager')}
                  </Label>
                  <div className="flex flex-col gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="todo-new"
                          checked={todoSection === "newlyadded"}
                          onCheckedChange={(checked) => setTodoSection(checked ? "newlyadded" : "")}
                        />
                        <Label htmlFor="todo-new" className="text-sm cursor-pointer font-medium">
                          {__("Newly added", 'wedevs-project-manager')}
                        </Label>
                      </div>
                      <p className="text-[15px] text-pm-text-muted pl-6">
                        {__(
                          "Tasks added recently on any task lists will be automatically moved here.", 'wedevs-project-manager',
                        )}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="todo-lists"
                          checked={todoSection === "lists"}
                          onCheckedChange={(checked) => setTodoSection(checked ? "lists" : "")}
                        />
                        <Label htmlFor="todo-lists" className="text-sm cursor-pointer font-medium">
                          {__("Task lists", 'wedevs-project-manager')}
                        </Label>
                      </div>
                      <p className="text-[15px] text-pm-text-muted pl-6">
                        {__(
                          "Tasks added only in the selected task lists will be automatically moved here.", 'wedevs-project-manager',
                        )}
                      </p>
                    </div>
                  </div>
                  {todoSection === "lists" && (
                    <div className="pl-6 space-y-1">
                      <ScrollArea className="h-28 border rounded-md p-2">
                        {lists.map((l) => (
                          <div
                            key={l.id}
                            className="flex items-center gap-2 py-1"
                          >
                            <Checkbox
                              id={`tl-${l.id}`}
                              checked={todoLists.some((tl) => tl.id === l.id)}
                              onCheckedChange={() => toggleList(l)}
                            />
                            <label
                              htmlFor={`tl-${l.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {l.title}
                            </label>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}

              {moveType === "in_progress" && (
                <div className="space-y-2 pl-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="ip-reopen"
                      checked={inProgressReOpened}
                      onCheckedChange={setInProgressReOpened}
                    />
                    <Label
                      htmlFor="ip-reopen"
                      className="text-sm cursor-pointer font-medium"
                    >
                      {__("Reopened tasks", 'wedevs-project-manager')}
                    </Label>
                  </div>
                  <p className="text-[15px] text-pm-text-muted pl-6">
                    {__(
                      "If a closed task in this project reopens, it will automatically move here.", 'wedevs-project-manager',
                    )}
                  </p>
                </div>
              )}

              {moveType === "done" && (
                <div className="space-y-2 pl-1">
                  <Label className="text-sm font-medium">
                    {__("Move issue here when...", 'wedevs-project-manager')}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="done-complete"
                      checked={doneCompleted}
                      onCheckedChange={setDoneCompleted}
                    />
                    <Label
                      htmlFor="done-complete"
                      className="text-sm cursor-pointer font-medium"
                    >
                      {__("Completed tasks", 'wedevs-project-manager')}
                    </Label>
                  </div>
                  <p className="text-[15px] text-pm-text-muted pl-6">
                    {__(
                      "Issues will automatically move here when marked as complete.", 'wedevs-project-manager',
                    )}
                  </p>
                </div>
              )}

              {moveType === "overdue" && (
                <div className="space-y-2 pl-1">
                  <p className="text-[15px] text-pm-text-muted">
                    {__(
                      "Tasks that are past their due date will automatically move to this column.", 'wedevs-project-manager',
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                {__("Assign User", 'wedevs-project-manager')}
              </Label>
              <p className="text-[15px] text-pm-text-muted">
                {__(
                  "Select team members to be assigned automatically when a task dropped in this column.", 'wedevs-project-manager',
                )}
              </p>
              {users && users.length > 0 && (
                <ScrollArea className="h-28 border rounded-md p-2">
                  {users.map((u) => {
                    const uid = u.id || u.user_id;
                    const isSelected = assignedUsers.some(
                      (au) => (au.id || au.user_id) === uid,
                    );
                    return (
                      <div key={uid} className="flex items-center gap-2 py-1">
                        <Checkbox
                          id={`au-${uid}`}
                          checked={isSelected}
                          onCheckedChange={() => toggleUser(u)}
                        />
                        <UserAvatar user={u} size="sm" />
                        <label
                          htmlFor={`au-${uid}`}
                          className="text-sm cursor-pointer"
                        >
                          {u.display_name}
                        </label>
                      </div>
                    );
                  })}
                </ScrollArea>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                {__("Change task status", 'wedevs-project-manager')}
              </Label>
              <div className="flex flex-col gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="ts-none"
                      checked={taskStatus === "none"}
                      onCheckedChange={(checked) => setTaskStatus(checked ? "none" : "")}
                    />
                    <Label htmlFor="ts-none" className="text-sm cursor-pointer font-medium">
                      {__("None", 'wedevs-project-manager')}
                    </Label>
                  </div>
                  <p className="text-[15px] text-pm-text-muted pl-6">
                    {__("Dropping task here has no progress status", 'wedevs-project-manager')}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="ts-complete"
                      checked={taskStatus === "completed"}
                      onCheckedChange={(checked) => setTaskStatus(checked ? "completed" : "none")}
                    />
                    <Label htmlFor="ts-complete" className="text-sm cursor-pointer font-medium">
                      {__("Completed task", 'wedevs-project-manager')}
                    </Label>
                  </div>
                  <p className="text-[15px] text-pm-text-muted pl-6">
                    {__(
                      "Dropping task here will automatically mark the task as complete.", 'wedevs-project-manager',
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="ts-incomplete"
                      checked={taskStatus === "incomplete"}
                      onCheckedChange={(checked) => setTaskStatus(checked ? "incomplete" : "none")}
                    />
                    <Label htmlFor="ts-incomplete" className="text-sm cursor-pointer font-medium">
                      {__("Incompleted task", 'wedevs-project-manager')}
                    </Label>
                  </div>
                  <p className="text-[15px] text-pm-text-muted pl-6">
                    {__(
                      "Dropping task here will automatically mark the task as incomplete.", 'wedevs-project-manager',
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            {__("Cancel", 'wedevs-project-manager')}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? __("Saving...", 'wedevs-project-manager') : __("Update Automation", 'wedevs-project-manager')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
