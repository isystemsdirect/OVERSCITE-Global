import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { EEPIP_Status } from '@/lib/types/property-intelligence';

interface PropertyEEPIPActionBarProps {
  status: EEPIP_Status;
  onConnect: () => void;
  onReview: () => void;
  onRefresh: () => void;
}

export const PropertyEEPIPActionBar: React.FC<PropertyEEPIPActionBarProps> = ({
  status,
  onConnect,
  onReview,
  onRefresh,
}) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border border-border">
      <div className="flex-1 flex items-center gap-2 px-2">
        <Database className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">External Intelligence</span>
        <StatusBadge status={status} />
      </div>
      
      <div className="flex items-center gap-2">
        {status === EEPIP_Status.NOT_CONNECTED || status === EEPIP_Status.DEFERRED ? (
          <Button size="sm" onClick={onConnect} variant="outline" className="h-8 gap-1">
            <RefreshCw className="h-3.5 w-3.5" />
            Fetch Candidates
          </Button>
        ) : null}

        {status === EEPIP_Status.PENDING_REVIEW || status === EEPIP_Status.AVAILABLE || status === EEPIP_Status.OUTDATED ? (
          <Button size="sm" onClick={onReview} className="h-8 gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Review Proposed Changes
          </Button>
        ) : null}

        {(status === EEPIP_Status.FULLY_INGESTED || status === EEPIP_Status.PARTIALLY_INGESTED) && (
          <Button size="sm" onClick={onRefresh} variant="ghost" className="h-8 w-8 p-0">
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="sr-only">Check for Freshness</span>
          </Button>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: EEPIP_Status }) => {
  const config: Record<EEPIP_Status, { label: string; className: string; icon?: any }> = {
    [EEPIP_Status.NOT_CONNECTED]: { label: 'No External Candidates', className: 'text-muted-foreground' },
    [EEPIP_Status.AVAILABLE]: { label: 'Candidates Available', className: 'text-blue-500 font-semibold', icon: RefreshCw },
    [EEPIP_Status.DEFERRED]: { label: 'Deferred', className: 'text-amber-500' },
    [EEPIP_Status.PENDING_REVIEW]: { label: 'Proposed Changes Ready', className: 'text-indigo-500 font-semibold', icon: AlertCircle },
    [EEPIP_Status.PARTIALLY_INGESTED]: { label: 'Partially Accepted', className: 'text-emerald-500' },
    [EEPIP_Status.FULLY_INGESTED]: { label: 'Accepted into PIP', className: 'text-emerald-600 font-bold' },
    [EEPIP_Status.OUTDATED]: { label: 'Stale (Check Freshness)', className: 'text-rose-500', icon: AlertCircle },
    [EEPIP_Status.USER_DECLINED]: { label: 'Proposals Declined', className: 'text-slate-400' },
    [EEPIP_Status.SOURCE_UNAVAILABLE]: { label: 'Source Offline', className: 'text-rose-400' },
  };

  const { label, className, icon: Icon } = config[status];

  return (
    <span className={`text-xs flex items-center gap-1 ${className}`}>
      {Icon && <Icon className="h-3 w-3 animate-pulse" />}
      {label}
    </span>
  );
};

