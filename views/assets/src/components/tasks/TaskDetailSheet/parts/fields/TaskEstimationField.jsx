import { __ } from '@wordpress/i18n';
import React from 'react';
import { usePermissions } from '@hooks/usePermissions';
import { useFilter } from '@hooks/useSlot';
import ProGate from '@components/common/ProGate';
import ProBadge from '@components/common/ProBadge';
import { Clock } from 'lucide-react';

function EstimationTeaser() {
  return (
    <ProGate feature={__('Estimate', 'wedevs-project-manager')}>
      <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
        <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
          <Clock className="h-4 w-4" /><span className="text-sm">{__('Estimate', 'wedevs-project-manager')}</span>
        </div>
        <ProBadge />
      </div>
    </ProGate>
  );
}

export default function TaskEstimationField(props) {
  const { isPro } = usePermissions();
  const Override = useFilter('task.estimation.field', null, props);

  if (!isPro) return <EstimationTeaser />;

  if (Override) {
    const OverrideComp = typeof Override === 'function' ? Override : null;
    if (OverrideComp) return <OverrideComp {...props} />;
    if (React.isValidElement(Override)) return Override;
  }

  // Pro licensed but Time_Tracker module not active — render nothing, since
  // estimation UI is owned by Time_Tracker module (matches Vue behavior).
  return null;
}
