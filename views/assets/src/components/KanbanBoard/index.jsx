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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import FileUploadArea from "@components/common/FileUploadArea";
import { Filter, Image as ImageIcon, X, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import FilterPanel from "./parts/FilterPanel";
import KanbanDndBoard from "./parts/KanbanDndBoard";

const api = useApi();

export default function KanbanBoard() {
  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const [ConfirmDialog, confirm] = useConfirm();
  const { canManage } = usePermissions();
  const { boards, loading } = useAppSelector((s) => s.kanban);
  const [newColTitle, setNewColTitle] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [panelFilters, setPanelFilters] = useState(null);
  const [searching, setSearching] = useState(false);
  const [defaultListId, setDefaultListId] = useState("");
  const users = useProjectAssignees(projectId);

  // Board background image (Trello-style), stored per user in project meta and
  // uploaded through our own file-upload dialog. Default is the plain surface.
  const [boardBg, setBoardBg] = useState("");
  const [boardBgId, setBoardBgId] = useState(0);
  const [bgDialogOpen, setBgDialogOpen] = useState(false);
  const [bgFiles, setBgFiles] = useState([]);
  const [bgUploading, setBgUploading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    let active = true;
    api.get(`projects/${projectId}/kanboard-background`)
      .then((res) => {
        if (!active) return;
        setBoardBg(res?.data?.background || res?.background || "");
        setBoardBgId(res?.data?.attachment_id || res?.attachment_id || 0);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [projectId]);

  const persistBg = useCallback((url, attachmentId = 0) => {
    setBoardBg(url);
    setBoardBgId(attachmentId);
    api.post(`projects/${projectId}/kanboard-background`, { background: url, attachment_id: attachmentId })
      .catch(() => toast.error(__("Couldn't save background", 'wedevs-project-manager')));
  }, [projectId]);

  const handleBgUpload = useCallback(async () => {
    const file = bgFiles[0];
    if (!file) return;
    setBgUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.upload(`projects/${projectId}/kanboard-background/upload`, fd);
      const url = res?.data?.url || res?.url;
      const attachmentId = res?.data?.attachment_id || res?.attachment_id || 0;
      if (!url) throw new Error("no url");
      persistBg(url, attachmentId);
      setBgDialogOpen(false);
      setBgFiles([]);
      toast.success(__("Board background updated", 'wedevs-project-manager'));
    } catch {
      toast.error(__("Upload failed", 'wedevs-project-manager'));
    } finally {
      setBgUploading(false);
    }
  }, [bgFiles, projectId, persistBg]);

  const clearBoardBg = useCallback(async () => {
    const ok = await confirm(
      __("Remove the board background image? The uploaded image will be deleted.", 'wedevs-project-manager'),
      __("Remove background", 'wedevs-project-manager'),
    );
    if (!ok) return;
    persistBg("", 0); // server deletes the previously stored asset
  }, [persistBg, confirm]);

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
    dispatch(updateBoard({ projectId, boardId, payload }))
      .unwrap()
      .then(() => toast.success(__("Column updated", 'wedevs-project-manager')))
      .catch(() => toast.error(__("Failed to update column", 'wedevs-project-manager')));
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

  const handleColorChange = async (boardId, color) => {
    try {
      await dispatch(setBoardColor({ projectId, boardId, color: color || "" })).unwrap();
      toast.success(__("Column color updated", 'wedevs-project-manager'));
    } catch {
      toast.error(__("Failed to update column color", 'wedevs-project-manager'));
    }
  };

  const handleMoveTask = useCallback(
    async (taskId, fromBoardId, toBoardId) => {
      if (!toBoardId) {
        try {
          await api.post(
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
        await api.post(`projects/${projectId}/kanboard/task-order`, {
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
      try {
        await dispatch(
          saveAutomation({
            projectId,
            boardId,
            automation: { board_id: boardId, data: actions },
          }),
        ).unwrap();
        toast.success(__("Automation saved", 'wedevs-project-manager'));
      } catch {
        toast.error(__("Failed to save automation", 'wedevs-project-manager'));
      }
    },
    [dispatch, projectId, __],
  );

  const applyFilters = useCallback(
    async (filters) => {
      try {
        setSearching(true);
        const payload = {
          users: filters.users || [],
          title: filters.title || "",
          lists: filters.lists || [],
          dueDate: filters.dueDate || "",
          status: filters.status || "",
          filterTask: "active",
        };
        const res = await api.post(
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
        toast.error(__("Couldn't search this board", 'wedevs-project-manager'));
      } finally {
        setSearching(false);
      }
    },
    [projectId, dispatch, __],
  );

  const handleFilter = useCallback(
    (filters) => {
      setPanelFilters(filters);
      applyFilters({ ...filters, title: filters.title || search });
    },
    [applyFilters, search],
  );

  // Debounced title search, composed with the panel's other filters. Emptying
  // the box with no panel filters active restores the untouched board.
  useEffect(() => {
    const term = search.trim();

    if (term.length > 0 && term.length < 2) return;

    const timer = setTimeout(() => {
      if (!term && !panelFilters) {
        loadAllBoards();
        return;
      }
      applyFilters({ ...(panelFilters || {}), title: term });
    }, 350);

    return () => clearTimeout(timer);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearSearch = useCallback(() => {
    setSearch("");
    setPanelFilters(null);
    loadAllBoards();
  }, [loadAllBoards]);

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[280px] space-y-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg opacity-50" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "max-w-[1900px] mx-auto px-6 pt-4 pb-6 h-full bg-cover bg-center bg-no-repeat",
        boardBg && "rounded-xl",
      )}
      style={boardBg ? { backgroundImage: `url("${boardBg}")` } : undefined}
    >
      <ConfirmDialog />
      <div className="flex items-center justify-between mb-4">
        <h2
          className={cn(
            "text-xl font-bold text-pm-text-primary",
            boardBg && "rounded-lg bg-pm-surface/90 px-3 py-1.5 shadow-sm backdrop-blur",
          )}
        >
          {__("Kanban Board", 'wedevs-project-manager')}
        </h2>
        <div className="flex items-center gap-2">
          {/* Search is scoped to this project by the route it posts to. */}
          <div className={cn(
            "flex items-center gap-2 h-11 rounded-lg border border-pm-border bg-pm-surface px-3 w-[200px] sm:w-[260px] focus-within:border-pm-accent focus-within:ring-1 focus-within:ring-pm-accent/40 transition-colors",
            boardBg && "bg-pm-surface/90 backdrop-blur",
          )}>
            <Search className="h-3.5 w-3.5 text-pm-text-muted shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={__("Search tasks…", 'wedevs-project-manager')}
              aria-label={__("Search tasks on this board", 'wedevs-project-manager')}
              className="flex-1 min-w-0 h-full bg-transparent text-xs text-pm-text-primary placeholder:text-pm-text-muted focus:outline-none !border-0 !p-0 !shadow-none [&::-webkit-search-cancel-button]:appearance-none"
            />
            {searching ? (
              <Loader2 className="h-3.5 w-3.5 text-pm-text-muted shrink-0 animate-spin" />
            ) : (search || panelFilters) ? (
              <button
                type="button"
                onClick={clearSearch}
                title={__("Clear search", 'wedevs-project-manager')}
                className="shrink-0 rounded p-0.5 text-pm-text-muted hover:text-pm-text-primary transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
          {canManage && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-11 text-xs gap-1.5 border-pm-border text-pm-text hover:bg-pm-surface-muted"
                onClick={() => setBgDialogOpen(true)}
                title={__("Set board background", 'wedevs-project-manager')}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                {__("Background", 'wedevs-project-manager')}
              </Button>
              {boardBg && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-pm-text-muted hover:text-pm-text-primary"
                  onClick={clearBoardBg}
                  title={__("Remove background", 'wedevs-project-manager')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-11 text-xs gap-1.5 border-pm-border text-pm-text hover:bg-pm-surface-muted"
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
        boardBg={!!boardBg}
      />
      <TaskDetailSheet />

      <Dialog open={bgDialogOpen} onOpenChange={(o) => { setBgDialogOpen(o); if (!o) setBgFiles([]); }}>
        <DialogContent className="sm:max-w-md" data-pm-dialog>
          <DialogHeader>
            <DialogTitle>{__("Board background", 'wedevs-project-manager')}</DialogTitle>
          </DialogHeader>
          <FileUploadArea files={bgFiles} onFilesChange={(f) => setBgFiles(f.slice(-1))} />
          <DialogFooter>
            <Button className="h-11 px-5" variant="outline" onClick={() => { setBgDialogOpen(false); setBgFiles([]); }}>
              {__("Cancel", 'wedevs-project-manager')}
            </Button>
            <Button className="h-11 px-5" onClick={handleBgUpload} disabled={!bgFiles.length || bgUploading}>
              {bgUploading ? __("Uploading…", 'wedevs-project-manager') : __("Set background", 'wedevs-project-manager')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
