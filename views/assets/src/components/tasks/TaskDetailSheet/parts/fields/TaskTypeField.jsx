import { __ } from '@wordpress/i18n';
import React, { useCallback, useState } from 'react';
import { fetchTask } from '@store/tasksSlice';
import { cn } from '@lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover';
import { Check, ListTodo, X } from 'lucide-react';

export default function TaskTypeField({ task, projectId, dispatch, api }) {
  const [open, setOpen] = useState(false);
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentType = task?.type;

  const loadTypes = useCallback(() => {
    if (types.length > 0) return;
    setLoadingTypes(true);
    api.get('settings/task-types')
      .then(res => {
        const items = res?.data ?? res ?? [];
        setTypes(Array.isArray(items) ? items : []);
      })
      .catch(() => {})
      .finally(() => setLoadingTypes(false));
  }, [api, types.length]);

  const handleSelect = useCallback((type) => {
    if (saving) return;
    setSaving(true);
    const typeId = type?.id === currentType?.id ? false : type?.id;
    api.post(`projects/${projectId}/tasks/${task.id}/update`, {
      title: task.title,
      type_id: typeId,
    }).then(() => {
      dispatch(fetchTask({ projectId, taskId: task.id }));
      setOpen(false);
    }).catch(() => {})
    .finally(() => setSaving(false));
  }, [saving, currentType, task, projectId, api, dispatch]);

  const handleClear = useCallback(() => {
    if (saving) return;
    setSaving(true);
    api.post(`projects/${projectId}/tasks/${task.id}/update`, {
      title: task.title,
      type_id: false,
    }).then(() => {
      dispatch(fetchTask({ projectId, taskId: task.id }));
      setOpen(false);
    }).catch(() => {})
    .finally(() => setSaving(false));
  }, [saving, task, projectId, api, dispatch]);

  return (
    <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <ListTodo className="h-4 w-4" /><span className="text-sm">{__('Type', 'wedevs-project-manager')}</span>
      </div>
      <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={(v) => { setOpen(v); if (v) loadTypes(); }}>
        <PopoverTrigger asChild>
          <button className={cn(
            'text-sm transition-colors',
            currentType
              ? 'text-pm-text-primary bg-muted/50 px-2 py-0.5 rounded hover:bg-muted'
              : 'text-pm-text-muted hover:text-pm-accent'
          )}>
            {currentType ? currentType.title : __('Add type', 'wedevs-project-manager')}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-2" align="start">
          {loadingTypes ? (
            <p className="text-sm text-pm-text-muted py-2 text-center">{__('Loading...', 'wedevs-project-manager')}</p>
          ) : types.length === 0 ? (
            <p className="text-sm text-pm-text-muted py-2 text-center">{__('No task types found', 'wedevs-project-manager')}</p>
          ) : (
            <div className="space-y-0.5">
              {types.map(t => (
                <button
                  key={t.id}
                  type="button"
                  className={cn(
                    'w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted/50 transition-colors flex items-center justify-between text-foreground',
                    currentType?.id === t.id && 'bg-primary/5 text-primary font-medium'
                  )}
                  onClick={() => handleSelect(t)}
                  disabled={saving}
                >
                  {t.title}
                  {currentType?.id === t.id && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
              {currentType && (
                <>
                  <div className="border-t border-border my-1" />
                  <button
                    type="button"
                    className="w-full text-left text-sm px-2 py-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={handleClear}
                    disabled={saving}
                  >
                    {__('Remove type', 'wedevs-project-manager')}
                  </button>
                </>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
      {currentType && !saving && (
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center text-pm-text-muted hover:text-destructive transition-colors"
          title={__('Remove type', 'wedevs-project-manager')}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      </div>
    </div>
  );
}
