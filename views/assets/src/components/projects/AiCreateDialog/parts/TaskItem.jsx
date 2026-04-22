import React from 'react';
import { useI18n } from '@hooks/useI18n';
import { Input } from '@components/ui/input';
import { Checkbox } from '@components/ui/checkbox';
import { GripVertical, Pencil } from 'lucide-react';

export default function TaskItem({ task, onToggle, onTitleChange }) {
  const { __ } = useI18n();
  return (
    <div className="group flex items-center gap-2 rounded-md px-1 py-0.5 hover:bg-muted/40 transition-colors">
      <Checkbox checked={task._selected} onCheckedChange={() => onToggle(task._id)} />
      <GripVertical className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Input
        value={task.title}
        onChange={(e) => onTitleChange(task._id, e.target.value)}
        className="h-7 text-sm border-transparent hover:border-input focus-visible:border-input bg-transparent px-1.5 flex-1 shadow-none"
        placeholder={__('Task name')}
      />
      <Pencil className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
