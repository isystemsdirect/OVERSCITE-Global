/**
 * @classification UI_COMPONENT
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 */

'use client';

import React from 'react';
import { useLayout } from '../context/LayoutContext';

export default function OverHUD() {
  const { overHUDHeight } = useLayout();

  return (
    <div
      className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-lg border-b border-white/10 z-10 overhud-panel"
      style={{ height: `${overHUDHeight}px` }}
    >
      {/* OverHUD content goes here */}
    </div>
  );
}
