import { __ } from '@wordpress/i18n';
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAppDispatch } from "@store/index";
import {
  reorderBoardsLocal,
  reorderBoards,
  moveTaskBetweenBoards,
} from "@store/kanbanSlice";
import { useApi } from "@hooks/useApi";
import { Input } from "@components/ui/input";
import { toast } from "sonner";
import { KanbanProvider } from "../../kanban/index";
import KanbanBoardColumn from "./KanbanBoardColumn";

const proApi = useApi();

export default function KanbanDndBoard({
  boards,
  projectId,
  users,
  defaultListId,
  canManage,
  onUpdate,
  onDelete,
  onColorChange,
  onRefresh,
  onMoveTask,
  onImportTasks,
  onSaveAutomation,
  onAddExistingTask,
  newColTitle,
  setNewColTitle,
  onCreateBoard,
}) {
  const dispatch = useAppDispatch();

  const columns = useMemo(
    () =>
      boards.map((b) => ({
        id: String(b.id),
        name: b.title || "",
        color: b.header_background || "",
        rawBoard: b,
      })),
    [boards],
  );

  const [kanbanData, setKanbanData] = useState([]);

  useEffect(() => {
    const items = [];
    boards.forEach((board) => {
      const rawTasks = board.tasks;
      const tasks = Array.isArray(rawTasks) ? rawTasks : rawTasks?.data ?? [];
      tasks.forEach((t) => {
        items.push({
          id: String(t.id),
          name: t.title || "",
          column: String(board.id),
          task: t,
          boardId: board.id,
        });
      });
    });
    setKanbanData(items);
  }, [boards]);

  const handleDataChange = useCallback((newData) => {
    setKanbanData(newData);
  }, []);

  const handleTaskCreated = useCallback((columnId, task) => {
    setKanbanData((prev) => [
      ...prev,
      {
        id: String(task.id),
        name: task.title || "",
        column: columnId,
        task: task,
        boardId: parseInt(columnId),
      },
    ]);
  }, []);

  const handleColumnReorder = useCallback(
    (reorderedColumns) => {
      const reorderedIds = reorderedColumns.map((c) => c.id);
      dispatch(reorderBoardsLocal(reorderedIds));

      const boardOrders = reorderedColumns.map((col, idx) => ({
        section_id: parseInt(col.id),
        order: idx,
      }));
      dispatch(reorderBoards({ projectId, boardOrders })).unwrap().then(() => {
        toast.success(__("Board reordered", 'wedevs-project-manager'));
      }).catch(() => {
        toast.error(__("Failed to reorder boards", 'wedevs-project-manager'));
        onRefresh();
      });
    },
    [dispatch, projectId, __, onRefresh],
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over || !active) return;

      const item = kanbanData.find((d) => d.id === String(active.id));
      if (!item) return;

      const updatedItem = kanbanData.find((d) => d.id === String(active.id));
      const newColumnId = updatedItem?.column;

      if (newColumnId && String(newColumnId) !== String(item.boardId)) {
        dispatch(moveTaskBetweenBoards({ taskId: item.id, fromBoardId: item.boardId, toBoardId: newColumnId }));
        const destTasks = kanbanData
          .filter((d) => d.column === String(newColumnId))
          .map((d) => parseInt(d.id));
        proApi
          .post(`projects/${projectId}/kanboard/task-order`, {
            section_id: parseInt(newColumnId),
            sender_section_id: item.boardId,
            dragabel_task_id: parseInt(item.id),
            is_move: "yes",
            task_ids: destTasks,
          })
          .catch(() => {
            toast.error(__("Failed to move task", 'wedevs-project-manager'));
            onRefresh();
          });
      }
    },
    [kanbanData, projectId, __, onRefresh],
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
      <div className="shrink-0" style={{ width: `${columns.length * 280 + (columns.length - 1) * 16}px` }}>
        <KanbanProvider
          columns={columns}
          data={kanbanData}
          onDataChange={handleDataChange}
          onDragEnd={handleDragEnd}
          onColumnReorder={handleColumnReorder}
          className="!grid-flow-col !auto-cols-[280px]"
        >
          {(column) => (
            <KanbanBoardColumn
              key={column.id}
              column={column}
              projectId={projectId}
              users={users}
              defaultListId={defaultListId}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onColorChange={onColorChange}
              onRefresh={onRefresh}
              onMoveTask={onMoveTask}
              onImportTasks={onImportTasks}
              onSaveAutomation={onSaveAutomation}
              onTaskCreated={handleTaskCreated}
              onAddExistingTask={onAddExistingTask}
            />
          )}
        </KanbanProvider>
      </div>

      {canManage && (
        <div className="min-w-[260px] max-w-[300px] shrink-0 self-start">
          <div className="rounded-xl border border-dashed border-pm-border bg-pm-surface-muted/80 hover:bg-pm-surface hover:border-pm-border transition-colors p-2">
            <Input
              value={newColTitle}
              onChange={(e) => setNewColTitle(e.target.value)}
              placeholder={__("+ Add new section", 'wedevs-project-manager')}
              className="h-8 text-sm bg-transparent border-none shadow-none focus-visible:ring-0 placeholder:text-pm-text-muted"
              onKeyDown={(e) => {
                if (e.key === "Enter") onCreateBoard();
                if (e.key === "Escape") setNewColTitle("");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
