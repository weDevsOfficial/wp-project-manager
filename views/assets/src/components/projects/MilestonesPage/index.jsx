import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  fetchMilestones,
  createMilestone,
  updateMilestone,
  openForm,
  closeForm,
  setFilter as setStoreFilter,
  setSort as setStoreSort,
} from "@store/milestonesSlice";
import { useI18n } from "@hooks/useI18n";
import { useToast } from "@hooks/useToast";
import { usePermissions } from "@hooks/usePermissions";
import { useCurrentProject } from "@hooks/useCurrentProject";
import { extractDateStr } from "@lib/pm-utils";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Skeleton } from "@components/ui/skeleton";
import {
  ArrowLeft,
  Plus,
  Milestone as MilestoneIcon,
  Filter,
} from "lucide-react";
import MilestoneFilterBar from "./parts/MilestoneFilterBar";
import MilestoneForm from "./parts/MilestoneForm";
import ImportTasksDialog from "./parts/ImportTasksDialog";
import MilestoneCard from "./parts/MilestoneCard";
import GroupHeader from "./parts/GroupHeader";

export default function MilestonesPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { __ } = useI18n();
  const toast = useToast();

  const { items: milestones, loading, filter, sort, formOpen, editingId } =
    useAppSelector((s) => s.milestones);

  const [saving, setSaving] = useState(false);
  const [importTasksTarget, setImportTasksTarget] = useState(null);
  const project = useCurrentProject(projectId);
  const { userCan, isManager } = usePermissions(project);
  const canCreateMilestone = isManager || userCan('create_milestone');

  useEffect(() => {
    dispatch(fetchMilestones({ projectId }));
  }, [dispatch, projectId]);

  const editingMilestone = editingId
    ? milestones.find((m) => m.id === editingId)
    : null;

  const handleEdit = useCallback(
    (m) => dispatch(openForm(m.id)),
    [dispatch],
  );

  const handleFormSubmit = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        if (editingMilestone) {
          await dispatch(
            updateMilestone({
              projectId,
              milestoneId: editingMilestone.id,
              data: payload,
            }),
          ).unwrap();
          toast.success(__("Milestone updated"));
        } else {
          await dispatch(
            createMilestone({ projectId, data: payload }),
          ).unwrap();
          toast.success(__("Milestone created"));
        }
        dispatch(fetchMilestones({ projectId }));
        dispatch(closeForm());
      } catch {
        toast.error(
          editingMilestone
            ? __("Failed to update milestone")
            : __("Failed to create milestone"),
        );
      }
      setSaving(false);
    },
    [dispatch, projectId, editingMilestone, toast, __],
  );

  const { upcoming, atRisk, overdue, completed, noDate } = useMemo(() => {
    const groups = { upcoming: [], atRisk: [], overdue: [], completed: [], noDate: [] };

    for (const m of milestones) {
      const isComplete =
        m.status === "complete" || m.status === 1 || m.status === "1";
      const health = m.health || "no-date";

      if (isComplete) {
        groups.completed.push(m);
      } else if (health === "overdue") {
        groups.overdue.push(m);
      } else if (health === "at-risk") {
        groups.atRisk.push(m);
      } else if (health === "no-date" || !m.achieve_date) {
        groups.noDate.push(m);
      } else {
        groups.upcoming.push(m);
      }
    }

    const sortFn = (a, b) => {
      if (sort === "progress") return (b.progress ?? 0) - (a.progress ?? 0);
      if (sort === "title")
        return (a.title || "").localeCompare(b.title || "");
      const da = extractDateStr(a.achieve_date) || "9999-12-31";
      const db = extractDateStr(b.achieve_date) || "9999-12-31";
      return da.localeCompare(db);
    };

    groups.upcoming.sort(sortFn);
    groups.atRisk.sort(sortFn);
    groups.overdue.sort(sortFn);
    groups.completed.sort(sortFn);
    groups.noDate.sort(sortFn);

    return groups;
  }, [milestones, sort]);

  const visibleGroups = useMemo(() => {
    const groups = [];
    if (filter === "all" || filter === "upcoming") {
      if (upcoming.length > 0)
        groups.push({ key: "upcoming", label: __("Upcoming"), items: upcoming });
    }
    if (filter === "all" || filter === "at-risk") {
      if (atRisk.length > 0)
        groups.push({ key: "at-risk", label: __("At Risk"), items: atRisk });
    }
    if (filter === "all" || filter === "overdue") {
      if (overdue.length > 0)
        groups.push({ key: "overdue", label: __("Overdue"), items: overdue });
    }
    if (filter === "all" || filter === "completed") {
      if (completed.length > 0)
        groups.push({
          key: "completed",
          label: __("Completed"),
          items: completed,
        });
    }
    if (filter === "all" || filter === "no-date") {
      if (noDate.length > 0)
        groups.push({ key: "no-date", label: __("No Date"), items: noDate });
    }
    return groups;
  }, [filter, upcoming, atRisk, overdue, completed, noDate, __]);

  const totalVisible = visibleGroups.reduce(
    (sum, g) => sum + g.items.length,
    0,
  );

  const filterCounts = useMemo(() => ({
    all:       milestones.length,
    upcoming:  upcoming.length,
    "at-risk": atRisk.length,
    overdue:   overdue.length,
    completed: completed.length,
    "no-date": noDate.length,
  }), [milestones, upcoming, atRisk, overdue, completed, noDate]);

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(`/projects/${projectId}/task-lists`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-pm-text-primary">
            {__("Milestones")}
          </h1>
        </div>
        {canCreateMilestone && (
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => dispatch(openForm())}
          >
            <Plus className="h-4 w-4" />
            {__("New Milestone")}
          </Button>
        )}
      </div>

      {!loading && milestones.length > 0 && (
        <MilestoneFilterBar
          filter={filter}
          sort={sort}
          counts={filterCounts}
          onFilterChange={(v) => dispatch(setStoreFilter(v))}
          onSortChange={(v) => dispatch(setStoreSort(v))}
        />
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : milestones.length === 0 ? (
        <div className="text-center py-16">
          <MilestoneIcon className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-pm-text-primary mb-1">
            {__("No milestones yet")}
          </h3>
          <p className="text-sm text-pm-text-muted mb-4">
            {__("Track your project progress with milestones.")}
          </p>
          {canCreateMilestone && (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => dispatch(openForm())}
            >
              <Plus className="h-4 w-4" />
              {__("Create your first milestone")}
            </Button>
          )}
        </div>
      ) : totalVisible === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-pm-text-muted">
            {__("No milestones match the selected filter.")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleGroups.map((group) => (
            <div key={group.key} className="space-y-2">
              <GroupHeader
                label={group.label}
                count={group.items.length}
                groupKey={group.key}
              />
              <div className="space-y-2">
                {group.items.map((m) => (
                  <MilestoneCard
                    key={m.id}
                    milestone={m}
                    projectId={projectId}
                    onEdit={handleEdit}
                    onImportTasks={setImportTasksTarget}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={formOpen}
        onOpenChange={(open) => !open && dispatch(closeForm())}
      >
        <DialogContent className="sm:max-w-[500px]" data-pm-dialog>
          <DialogHeader>
            <DialogTitle>
              {editingMilestone
                ? __("Edit Milestone")
                : __("Create Milestone")}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {editingMilestone
                ? __("Edit an existing milestone")
                : __("Create a new milestone")}
            </DialogDescription>
          </DialogHeader>
          <MilestoneForm
            milestone={editingMilestone}
            onSubmit={handleFormSubmit}
            onCancel={() => dispatch(closeForm())}
          />
        </DialogContent>
      </Dialog>

      <ImportTasksDialog
        open={!!importTasksTarget}
        onOpenChange={(open) => !open && setImportTasksTarget(null)}
        milestone={importTasksTarget}
        projectId={projectId}
        onDone={() => dispatch(fetchMilestones({ projectId }))}
      />
    </div>
  );
}
