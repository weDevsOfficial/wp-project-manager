import { __ } from '@wordpress/i18n';
import React from 'react';
import { Slot, useSlotFills } from '@hooks/useSlot';
import { usePermissions } from '@hooks/usePermissions';
import ProGate from '@components/common/ProGate';
import ProBadge from '@components/common/ProBadge';
import { Layers, Sparkles } from 'lucide-react';

export default function ProSubtasksSection({ taskId, projectId, currentTask }) {
  const { isPro } = usePermissions();
  const fills = useSlotFills('task.detail.subtasks');

  if (fills.length > 0) {
    return (
      <Slot
        name="task.detail.subtasks"
        taskId={taskId}
        projectId={projectId}
        currentTask={currentTask}
      />
    );
  }

  if (!isPro) {
    return (
      <div className="px-6 py-3">
        <ProGate feature={__('Subtasks', 'wedevs-project-manager')}>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-sm text-pm-text-muted">
              <Layers className="h-4 w-4" />
              <span className="text-sm">{__('Subtasks', 'wedevs-project-manager')}</span>
              <ProBadge />
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex items-center gap-1 text-xs font-medium text-pm-accent border border-pm-accent/30 bg-pm-accent/5 rounded px-2 py-1 cursor-not-allowed opacity-70 hover:opacity-70 h-7"
            >
              <Sparkles className="h-3 w-3" />
              {__('Generate with AI', 'wedevs-project-manager')}
              <span className="ml-1 bg-pm-accent/20 text-pm-accent text-[9px] px-1 py-0.5 rounded font-semibold">{__('Pro', 'wedevs-project-manager')}</span>
            </button>
          </div>
        </ProGate>
      </div>
    );
  }

  return null;
}
