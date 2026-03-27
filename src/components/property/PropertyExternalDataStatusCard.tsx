import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Info } from 'lucide-react';
import { EEPIP_Status } from '@/lib/types/property-intelligence';

interface PropertyExternalDataStatusCardProps {
  status: EEPIP_Status;
  lastFetchAt?: string;
  onConnect: () => void;
  onSkip: () => void;
}

export const PropertyExternalDataStatusCard: React.FC<PropertyExternalDataStatusCardProps> = ({
  status,
  lastFetchAt,
  onConnect,
  onSkip,
}) => {
  return (
    <Card className="border-dashed border-2 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">External Property Intelligence</CardTitle>
        </div>
        <CardDescription>
          Enhance your PIP with automated assessor, parcel, and municipal data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === EEPIP_Status.NOT_CONNECTED || status === EEPIP_Status.DEFERRED ? (
          <div className="space-y-4">
            <p className="text-sm text-balance">
              Connecting external intelligence provides immediate structural details, zoning info, and tax history. This is optional and non-blocking.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onConnect} size="sm" className="gap-2">
                <Database className="h-3.5 w-3.5" />
                Fetch External Candidates
              </Button>
              <Button onClick={onSkip} variant="outline" size="sm">
                Proceed Manually (Skip)
              </Button>

            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {status === EEPIP_Status.PARTIALLY_INGESTED || status === EEPIP_Status.FULLY_INGESTED 
                  ? 'Accepted into PIP' 
                  : status === EEPIP_Status.PENDING_REVIEW 
                    ? 'Proposed Changes Ready' 
                    : status === EEPIP_Status.USER_DECLINED 
                      ? 'External Proposals Declined'
                      : status.replace('_', ' ')}
              </p>
              {lastFetchAt && (
                <p className="text-xs text-muted-foreground">Candidate data fetched: {new Date(lastFetchAt).toLocaleString()}</p>
              )}
            </div>

            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Info className="h-3.5 w-3.5" />
              Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
