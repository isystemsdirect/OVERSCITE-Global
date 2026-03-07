'use client';
/**
 * @classification UI_ENGINE
 * @authority Director
 * @status IMPLEMENTED
 * @version 2.0.0
 */

import React, { useState } from 'react';
import { SplashController } from './SplashController';
import { GridLayoutManager } from './GridLayoutManager';
import LogoLayer from './LogoLayer';

const PanelEngine: React.FC = () => {
  const [layout, setLayout] = useState<any[]>([]);
  const [isDraggable, setIsDraggable] = useState(true);
  const [isResizable, setIsResizable] = useState(true);

  const onLayoutChange = (newLayout: any[]) => {
    setLayout(newLayout);
  };

  const toggleEditMode = () => {
    setIsDraggable(!isDraggable);
    setIsResizable(!isResizable);
  };

  return (
    <main className="w-full h-full">
      <LogoLayer />
      <SplashController />
      <button onClick={toggleEditMode} className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground p-2 rounded">
        Toggle Edit Mode
      </button>
      <GridLayoutManager
        layout={layout}
        onLayoutChange={onLayoutChange}
        isDraggable={isDraggable}
        isResizable={isResizable}
      >
        {/* Add grid items here */}
      </GridLayoutManager>
    </main>
  );
};

export default PanelEngine;
