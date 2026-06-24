"use client";

import {
  closestCenter,
  DndContext,
  DragOverlay,

  MouseSensor,
  pointerWithin,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createContext,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import tunnel from "tunnel-rat";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const t = tunnel();

const KanbanContext = createContext({
  columns: [],
  data: [],
  activeCardId: null,
  activeColumnId: null,
});

export const KanbanBoard = ({ id, children, className }) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
    data: { type: "column" },
  });
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({ id });
  const { activeColumnId } = useContext(KanbanContext);

  // A column is being dragged over this column (not a card)
  const isColumnOver = activeColumnId && isOver && activeColumnId !== id;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      style={style}
      ref={(node) => {
        setSortableRef(node);
        setDroppableRef(node);
      }}
      {...attributes}
      {...listeners}
      className={cn(
        "flex size-full min-h-40 flex-col overflow-hidden rounded-xl border bg-pm-surface-muted text-sm shadow-sm ring-2 transition-all duration-200 cursor-grab active:cursor-grabbing",
        // Card dragged over this column
        isOver && !activeColumnId && "ring-pm-accent/50 border-pm-accent/30 bg-pm-accent/5",
        // Column dragged over this column — distinct highlight
        isColumnOver && "ring-blue-400 border-blue-400 bg-blue-50/60 scale-[1.01]",
        // No drag-over
        !isOver && !isColumnOver && "ring-transparent border-pm-border/40",
        // This column is being dragged
        isDragging && "opacity-40 shadow-2xl scale-[0.97] border-dashed border-pm-border",
        className
      )}
    >
      {children}
    </div>
  );
};

export const KanbanCard = ({
  id,
  name,
  children,
  className,
  onCardClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
    data: { type: "card" },
  });
  const { activeCardId } = useContext(KanbanContext);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <div
        style={style}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={cn(
          isDragging && "opacity-40 pointer-events-none",
          className
        )}
        onClick={!isDragging ? (e) => { if (e.currentTarget.contains(e.target)) onCardClick?.(e) } : undefined}
      >
        {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
      </div>
      {activeCardId === id && (
        <t.In>
          <div className="rounded-xl shadow-xl ring-2 ring-pm-accent/40 opacity-95 rotate-1 scale-[1.02]">
            {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
          </div>
        </t.In>
      )}
    </>
  );
};

export const KanbanCards = ({
  children,
  className,
  ...props
}) => {
  const { data } = useContext(KanbanContext);
  const filteredData = data.filter((item) => item.column === props.id);
  const items = filteredData.map((item) => item.id);

  return (
    <ScrollArea className="overflow-hidden">
      <SortableContext items={items}>
        <div
          className={cn("flex flex-grow flex-col gap-2 p-2.5", className)}
          {...props}
        >
          {filteredData.map(children)}
        </div>
      </SortableContext>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export const KanbanHeader = ({ className, ...props }) => (
  <div className={cn("m-0 font-semibold text-sm", className)} {...props} />
);

export const KanbanProvider = ({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  onColumnReorder,
  className,
  columns,
  data,
  onDataChange,
  ...props
}) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const [activeColumnId, setActiveColumnId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const columnIds = columns.map((c) => c.id);

  const handleDragStart = (event) => {
    const { active } = event;
    const type = active.data?.current?.type;

    if (type === "column") {
      setActiveColumnId(active.id);
    } else {
      const card = data.find((item) => item.id === active.id);
      if (card) {
        setActiveCardId(active.id);
      }
    }
    onDragStart?.(event);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    // Skip card-over logic when dragging a column
    if (active.data?.current?.type === "column") return;

    const activeItem = data.find((item) => item.id === active.id);
    const overItem = data.find((item) => item.id === over.id);

    if (!activeItem) return;

    const activeColumn = activeItem.column;
    const overColumn =
      overItem?.column ||
      columns.find((col) => col.id === over.id)?.id ||
      columns[0]?.id;

    if (activeColumn !== overColumn) {
      let newData = [...data];
      const activeIndex = newData.findIndex((item) => item.id === active.id);
      const overIndex = newData.findIndex((item) => item.id === over.id);

      newData[activeIndex].column = overColumn;
      newData = arrayMove(newData, activeIndex, overIndex);

      onDataChange?.(newData);
    }

    onDragOver?.(event);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Handle column reorder
    if (active.data?.current?.type === "column") {
      setActiveColumnId(null);
      if (over && active.id !== over.id) {
        const oldIndex = columns.findIndex((c) => c.id === active.id);
        const newIndex = columns.findIndex((c) => c.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(columns, oldIndex, newIndex);
          onColumnReorder?.(reordered);
        }
      }
      return;
    }

    // Handle card reorder
    setActiveCardId(null);
    onDragEnd?.(event);

    if (!over || active.id === over.id) return;

    let newData = [...data];
    const oldIndex = newData.findIndex((item) => item.id === active.id);
    const newIndex = newData.findIndex((item) => item.id === over.id);
    newData = arrayMove(newData, oldIndex, newIndex);
    onDataChange?.(newData);
  };

  const announcements = {
    onDragStart({ active }) {
      if (active.data?.current?.type === "column") {
        const col = columns.find((c) => c.id === active.id);
        return `Picked up the column "${col?.name}"`;
      }
      const { name, column } = data.find((item) => item.id === active.id) ?? {};
      return `Picked up the card "${name}" from the "${column}" column`;
    },
    onDragOver({ active, over }) {
      if (active.data?.current?.type === "column") return "";
      const { name } = data.find((item) => item.id === active.id) ?? {};
      const newColumn = columns.find((column) => column.id === over?.id)?.name;
      return `Dragged the card "${name}" over the "${newColumn}" column`;
    },
    onDragEnd({ active, over }) {
      if (active.data?.current?.type === "column") {
        const col = columns.find((c) => c.id === active.id);
        return `Dropped the column "${col?.name}"`;
      }
      const { name } = data.find((item) => item.id === active.id) ?? {};
      const newColumn = columns.find((column) => column.id === over?.id)?.name;
      return `Dropped the card "${name}" into the "${newColumn}" column`;
    },
    onDragCancel({ active }) {
      if (active.data?.current?.type === "column") {
        const col = columns.find((c) => c.id === active.id);
        return `Cancelled dragging the column "${col?.name}"`;
      }
      const { name } = data.find((item) => item.id === active.id) ?? {};
      return `Cancelled dragging the card "${name}"`;
    },
  };

  // Use pointerWithin when dragging cards (better for nested droppables),
  // closestCenter when dragging columns
  const collisionDetection = activeColumnId ? closestCenter : pointerWithin;

  return (
    <KanbanContext.Provider value={{ columns, data, activeCardId, activeColumnId }}>
      <DndContext
        accessibility={{ announcements }}
        collisionDetection={collisionDetection}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
        {...props}
      >
        <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
          <div
            className={cn(
              "grid size-full auto-cols-fr grid-flow-col gap-4",
              className
            )}
          >
            {columns.map((column) => children(column))}
          </div>
        </SortableContext>
        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>
              <t.Out />
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </KanbanContext.Provider>
  );
};
