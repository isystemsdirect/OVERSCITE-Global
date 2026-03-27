
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className, headerContent }) => {
  return (
    <Card className={cn("bg-background/20 backdrop-blur-md border-white/10 h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {headerContent && <div>{headerContent}</div>}
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
