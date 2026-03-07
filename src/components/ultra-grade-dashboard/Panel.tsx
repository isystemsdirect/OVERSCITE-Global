import React from 'react';
import { cn } from '@/lib/utils';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  title: string;
}

export const Panel: React.FC<PanelProps> = ({ children, className, title }) => {
  return (
    <div className={cn('bg-card/60 backdrop-blur-sm border border-border/30 rounded-lg', className)}>
      <div className="p-4 border-b border-border/30">
        <h3 className="font-semibold text-white/80">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};
