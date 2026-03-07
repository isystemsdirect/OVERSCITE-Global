'use client'
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import PanelRegistry from './PanelRegistry';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridLayoutManagerProps {
  layout: any[];
  onLayoutChange: (layout: any[]) => void;
  isDraggable: boolean;
  isResizable: boolean;
}

export const GridLayoutManager: React.FC<GridLayoutManagerProps> = ({ 
  layout, onLayoutChange, isDraggable, isResizable 
}) => {

  const renderPanels = () => {
    return layout.map((item: any) => {
      const PanelComponent = (PanelRegistry as any)[item.i];
      if (!PanelComponent) {
        return <div key={item.i}><p>Unknown panel type: {item.i}</p></div>;
      }
      return (
        <div key={item.i}>
          <PanelComponent />
        </div>
      );
    });
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={100}
      onLayoutChange={(newLayout) => onLayoutChange(newLayout)}
      isDraggable={isDraggable}
      isResizable={isResizable}
      preventCollision={true}
    >
      {renderPanels()}
    </ResponsiveGridLayout>
  );
};
