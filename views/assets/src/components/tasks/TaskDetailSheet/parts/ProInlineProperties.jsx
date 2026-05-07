import React from 'react';
import { Slot, useSlotFills } from '@hooks/useSlot';
import { useI18n } from '@hooks/useI18n';
import { usePermissions } from '@hooks/usePermissions';
import ProGate from '@components/common/ProGate';
import ProBadge from '@components/common/ProBadge';
import { Clock, Tag, Repeat, Zap } from 'lucide-react';

export default function ProInlineProperties({ taskId, projectId, currentTask, dispatch, api }) {
  const { __ } = useI18n();
  const { isPro } = usePermissions();
  const fills = useSlotFills('task.detail.inline-properties');

  if (fills.length > 0) {
    return (
      <Slot
        name="task.detail.inline-properties"
        taskId={taskId}
        projectId={projectId}
        currentTask={currentTask}
        dispatch={dispatch}
        api={api}
      />
    );
  }

  if (!isPro) {
    return (
      <>
        <ProGate feature={__('Time Tracker')}>
          <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
              <Clock className="h-4 w-4" /><span className="text-sm">{__('Track Time')}</span>
            </div>
            <ProBadge />
          </div>
        </ProGate>
        <ProGate feature={__('Labels')}>
          <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
              <Tag className="h-4 w-4" /><span className="text-sm">{__('Label')}</span>
            </div>
            <ProBadge />
          </div>
        </ProGate>
        <ProGate feature={__('Recurrence')}>
          <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
              <Repeat className="h-4 w-4" /><span className="text-sm">{__('Recurring')}</span>
            </div>
            <ProBadge />
          </div>
        </ProGate>
        <ProGate feature={__('Sprint')}>
          <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
              <Zap className="h-4 w-4" /><span className="text-sm">{__('Sprint')}</span>
            </div>
            <ProBadge />
          </div>
        </ProGate>
      </>
    );
  }

  return null;
}
