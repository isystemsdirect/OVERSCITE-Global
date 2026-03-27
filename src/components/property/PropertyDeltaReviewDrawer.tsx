import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Delta_Packet, Field_Change_Record } from '@/lib/types/property-intelligence';

interface PropertyDeltaReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  deltaPacket: Delta_Packet | null;
  onAccept: (selectedFields: string[]) => void;
  onDecline: () => void;
}

export const PropertyDeltaReviewDrawer: React.FC<PropertyDeltaReviewDrawerProps> = ({
  isOpen,
  onClose,
  deltaPacket,
  onAccept,
  onDecline,
}) => {
  const [selectedFields, setSelectedFields] = useState<string[]>(
    deltaPacket?.field_changes.map(f => f.field_path) || []
  );

  if (!deltaPacket) return null;

  const toggleField = (path: string) => {
    setSelectedFields(current => 
      current.includes(path) 
        ? current.filter(p => p !== path) 
        : [...current, path]
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Review Proposed Augmentations</SheetTitle>
          <SheetDescription>
            {deltaPacket.impact_summary}
            Select the proposed external fields to ingest into the internal Property Intelligence Profile (PIP).
          </SheetDescription>
        </SheetHeader>


        <ScrollArea className="flex-1 my-4 pr-4">
          <div className="space-y-6">
            {deltaPacket.field_changes.map((change, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id={`field-${idx}`} 
                    checked={selectedFields.includes(change.field_path)}
                    onCheckedChange={() => toggleField(change.field_path)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <label 
                        htmlFor={`field-${idx}`}
                        className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {change.field_path.replace(/_/g, ' ').toUpperCase()}
                      </label>
                      <Badge variant={change.impact_level === 'HIGH' ? 'destructive' : 'secondary'}>
                        {change.impact_level}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Source: {change.source}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 ml-7 p-3 bg-muted/50 rounded-lg text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1 italic">Current Baseline</p>
                    <p className="font-mono">{String(change.old_value || 'None')}</p>
                  </div>
                  <div className="border-l pl-4 border-border">
                    <p className="text-primary mb-1 italic">Proposed Augmentation</p>
                    <p className="font-mono font-bold text-primary">{String(change.proposed_value)}</p>
                  </div>
                </div>
                <Separator className="ml-7" />
              </div>
            ))}
          </div>
        </ScrollArea>

        <SheetFooter className="mt-auto pt-4 flex sm:flex-row flex-col gap-2">
          <Button variant="outline" onClick={onDecline} className="flex-1">
            Decline All Proposals
          </Button>
          <Button 
            onClick={() => onAccept(selectedFields)} 
            className="flex-1"
            disabled={selectedFields.length === 0}
          >
            Accept Selected Proposals ({selectedFields.length})
          </Button>
        </SheetFooter>

      </SheetContent>
    </Sheet>
  );
};
