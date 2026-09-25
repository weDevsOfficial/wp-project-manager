import { __ } from '@wordpress/i18n';
import React, { useCallback, useState } from 'react';
import { fetchTask } from '@store/tasksSlice';
import { createTaskType } from '@store/settingsSlice';
import { useToast } from '@hooks/useToast';
import AttributePicker from '@components/common/AttributePicker';
import { ListTodo } from 'lucide-react';

// canCreate: task types are site-wide, and only people who can open
// Settings may add one (settings/task-types needs Settings_Page_Access).
export default function TaskTypeField({ task, projectId, dispatch, api, canEdit = true, canCreate = false }) {
  const toast = useToast();
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

  const saveType = useCallback((typeId, successMessage) => {
    if (!canEdit || saving) return Promise.resolve();
    setSaving(true);
    return api.post(`projects/${projectId}/tasks/${task.id}/update`, {
      title: task.title,
      type_id: typeId,
    }).then(() => {
      dispatch(fetchTask({ projectId, taskId: task.id }));
      toast.success(successMessage || (typeId ? __('Task type updated', 'wedevs-project-manager') : __('Task type removed', 'wedevs-project-manager')));
    }).catch(() => toast.error(__('Failed to update task type', 'wedevs-project-manager')))
    .finally(() => setSaving(false));
  }, [saving, task, projectId, api, dispatch, canEdit, toast]);

  // Picking the current type again removes it, as before.
  const handleSelect = useCallback((type) => {
    saveType(type?.id === currentType?.id ? false : type?.id);
  }, [saveType, currentType]);

  const handleClear = useCallback(() => saveType(false), [saveType]);

  // Creates the type, then sets it on this task.
  const handleCreate = useCallback(async (title) => {
    let created;
    try {
      created = await dispatch(createTaskType({ title, description: '', status: 1 })).unwrap();
    } catch (e) {
      throw new Error(typeof e === 'string' && e ? e : __('Failed to create task type', 'wedevs-project-manager'));
    }
    if (!created?.id) throw new Error(__('Failed to create task type', 'wedevs-project-manager'));
    setTypes(prev => [created, ...prev.filter(t => t.id !== created.id)]);
    await saveType(created.id, __('Task type created', 'wedevs-project-manager'));
  }, [dispatch, saveType]);

  const options = types.map(t => ({ id: t.id, label: t.title }));
  // The task's own type shows even before the list has loaded.
  if (currentType && !options.some(o => String(o.id) === String(currentType.id))) {
    options.unshift({ id: currentType.id, label: currentType.title });
  }

  return (
    <div className="flex items-center min-h-11 px-2 rounded-md hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <ListTodo className="h-4 w-4" /><span className="text-sm">{__('Type', 'wedevs-project-manager')}</span>
      </div>
      <AttributePicker
        icon={ListTodo}
        value={currentType?.id ?? null}
        options={options}
        onSelect={handleSelect}
        onClear={handleClear}
        clearLabel={__('Remove type', 'wedevs-project-manager')}
        canEdit={canEdit}
        saving={saving}
        loading={loadingTypes}
        placeholder={__('Add type', 'wedevs-project-manager')}
        readOnlyText={currentType ? currentType.title : __('—', 'wedevs-project-manager')}
        emptyText={__('No task types found', 'wedevs-project-manager')}
        onOpenChange={(open) => { if (open) loadTypes(); }}
        create={canCreate ? {
          label: __('Create type', 'wedevs-project-manager'),
          placeholder: __('Type name', 'wedevs-project-manager'),
          requiredMessage: __('Type name is required', 'wedevs-project-manager'),
          onSubmit: handleCreate,
        } : undefined}
      />
    </div>
  );
}
