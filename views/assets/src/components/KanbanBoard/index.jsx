import { __ } from '@wordpress/i18n';
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  fetchBoards,
  fetchBoardTasks,
  createBoard,
  updateBoard,
  deleteBoard,
  addTaskToBoard,
  setBoardColor,
  importTasks,
  saveAutomation,
} from "@store/kanbanSlice";
import { useApi } from "@hooks/useApi";
import { useConfirm } from "@hooks/useConfirm";
import { usePermissions } from "@hooks/usePermissions";
import { useProjectAssignees } from "@hooks/useProjectAssignees";
import TaskDetailSheet from "@components/tasks/TaskDetailSheet";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { Filter } from "lucide-react";
import { toast } from "sonner";
import FilterPanel from "./parts/FilterPanel";
import KanbanDndBoard from "./parts/KanbanDndBoard";

const api = useApi();
const proApi = useApi();

export default function KanbanBoard() {
  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const [ConfirmDialog, confirm] = useConfirm();
  const { canManage } = usePermissions();
  const { boards, loading } = useAppSelector((s) => s.kanban);
  const [newColTitle, setNewColTitle] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [defaultListId, setDefaultListId] = useState("");
  const users = useProjectAssignees(projectId);

  const loadAllBoards = useCallback(() => {
    if (!projectId) return;
    dispatch(fetchBoards({ projectId })).then((action) => {
      const arr = Array.isArray(action.payload)
        ? action.payload
        : action.payload?.data ?? [];
      arr.forEach((board) =>
        dispatch(fetchBoardTasks({ projectId, boardId: board.id })),
      );
    });
  }, [projectId, dispatch]);

  useEffect(() => {
    loadAllBoards();
  }, [loadAllBoards]);

  const taskSheetOpen = useAppSelector((s) => s.tasks?.taskSheetOpen);
  const taskModified = useAppSelector((s) => s.tasks?.taskModifiedInSheet);
  const prevSheetOpen = useRef(false);
  useEffect(() => {
    if (prevSheetOpen.current && !taskSheetOpen && taskModified) {
      loadAllBoards();
    }
    prevSheetOpen.current = taskSheetOpen;
  }, [taskSheetOpen, taskModified, loadAllBoards]);

  useEffect(() => {
    if (!projectId) return;
    api
      .get(`projects/${projectId}/task-lists`, { per_page: 1 })
      .then((res) => {
        const d = res?.data ?? res;
        const arr = Array.isArray(d) ? d : Object.values(d || {});
        if (arr.length > 0) setDefaultListId(String(arr[0].id));
      })
      .catch((err) => { if (typeof console !== 'undefined') console.warn('[PM] Failed to load default task list:', err) });
  }, [projectId]);

  const handleCreateBoard = async () => {
    if (!newColTitle.trim()) return;
    const title = newColTitle.trim();
    setNewColTitle("");
    try {
      await dispatch(createBoard({ projectId, title })).unwrap();
      toast.success(__("Section created", 'wedevs-project-manager'));
      loadAllBoards();
    } catch {
      toast.error(__("Failed to create section", 'wedevs-project-manager'));
    }
  };

  const handleUpdateBoard = (boardId, payload) =>
    dispatch(updateBoard({ projectId, boardId, payload }));
  const handleDeleteBoard = async (boardId) => {
    const ok = await confirm(__("Delete this column?", 'wedevs-project-manager'), __("Delete Column", 'wedevs-project-manager'));
    if (!ok) return;
    try {
      await dispatch(deleteBoard({ projectId, boardId })).unwrap();
      toast.success(__("Column deleted", 'wedevs-project-manager'));
      loadAllBoards();
    } catch {
      toast.error(__("Failed to delete column", 'wedevs-project-manager'));
    }
  };

  const handleColorChange = (boardId, color) => {
    dispatch(setBoardColor({ projectId, boardId, color: color || "" }));
  };

  const handleMoveTask = useCallback(
    async (taskId, fromBoardId, toBoardId) => {
      if (!toBoardId) {
        try {
          await proApi.post(
            `projects/${projectId}/kanboard/${fromBoardId}/tasks/${taskId}/delete`,
          );
          toast.success(__("Task removed", 'wedevs-project-manager'));
          loadAllBoards();
        } catch {
          toast.error(__("Failed to remove task", 'wedevs-project-manager'));
        }
        return;
      }
      try {
        await proApi.post(`projects/${projectId}/kanboard/task-order`, {
          section_id: toBoardId,
          sender_section_id: fromBoardId,
          dragabel_task_id: taskId,
          is_move: "yes",
          task_ids: [taskId],
        });
        loadAllBoards();
      } catch {
        toast.error(__("Failed to move task", 'wedevs-project-manager'));
        loadAllBoards();
      }
    },
    [projectId, __, loadAllBoards],
  );

  const handleAddExistingTask = useCallback(
    (taskId, boardId) => {
      dispatch(addTaskToBoard({ projectId, boardId, taskId })).then(() => {
        toast.success(__("Task added", 'wedevs-project-manager'));
        loadAllBoards();
      });
    },
    [dispatch, projectId, loadAllBoards, __],
  );

  const handleImportTasks = useCallback(
    (taskIds, boardId) => {
      dispatch(importTasks({ projectId, taskIds, boardId })).then(() => {
        toast.success(__("Tasks imported", 'wedevs-project-manager'));
        loadAllBoards();
      });
    },
    [dispatch, projectId, loadAllBoards, __],
  );

  const handleSaveAutomation = useCallback(
    async (boardId, actions) => {
      await dispatch(
        saveAutomation({
          projectId,
          boardId,
          automation: { board_id: boardId, data: actions },
        }),
      ).unwrap();
    },
    [dispatch, projectId],
  );

  const handleFilter = useCallback(
    async (filters) => {
      try {
        const payload = {
          users: filters.users || [],
          title: filters.title || "",
          lists: filters.lists || [],
          dueDate: filters.dueDate || "",
          status: filters.status || "",
          filterTask: "active",
        };
        const res = await proApi.post(
          `projects/${projectId}/kanboard/filter`,
          payload,
        );
        const filteredBoards = res?.data ?? res;
        if (Array.isArray(filteredBoards)) {
          filteredBoards.forEach((fb) => {
            const tasks = fb.tasks?.data ?? fb.tasks ?? [];
            dispatch({
              type: "kanban/fetchBoardTasks/fulfilled",
              payload: {
                boardId: fb.id,
                tasks: Array.isArray(tasks) ? tasks : [],
                meta: null,
              },
            });
          });
        }
      } catch {
        toast.error(__("Filter failed", 'wedevs-project-manager'));
      }
    },
    [projectId, dispatch, __],
  );

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[280px] space-y-2">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl opacity-50" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1900px] mx-auto px-6 pt-4 pb-6 h-full">
      <ConfirmDialog />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-pm-text tracking-tight">
          {__("Kanban Board", 'wedevs-project-manager')}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5 border-pm-border text-pm-text hover:bg-pm-surface-muted"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="h-3.5 w-3.5" />
            {__("Filter", 'wedevs-project-manager')}
          </Button>
        </div>
      </div>

      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        projectId={projectId}
        users={users}
        onFilter={handleFilter}
        onClear={loadAllBoards}
      />

      <KanbanDndBoard
        boards={boards}
        projectId={projectId}
        users={users}
        defaultListId={defaultListId}
        canManage={canManage}
        onUpdate={handleUpdateBoard}
        onDelete={handleDeleteBoard}
        onColorChange={handleColorChange}
        onRefresh={loadAllBoards}
        onMoveTask={handleMoveTask}
        onImportTasks={handleImportTasks}
        onSaveAutomation={handleSaveAutomation}
        onAddExistingTask={handleAddExistingTask}
        newColTitle={newColTitle}
        setNewColTitle={setNewColTitle}
        onCreateBoard={handleCreateBoard}
      />
      <TaskDetailSheet />
    </div>
  );
}
