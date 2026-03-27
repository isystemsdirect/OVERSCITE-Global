/**
 * @classification UI_COMPONENT
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 */

'use client';

import React from 'react';
import { useLayout } from '../context/LayoutContext';

export default function Sidebar() {
  const { sidebarWidth } = useLayout();

  return (
    <div
      className="fixed top-0 left-0 h-full bg-black/50 backdrop-blur-lg border-r border-white/10 z-20"
      style={{ width: `${sidebarWidth}px` }}
      data-sidebar="sidebar"
    >
      {/* Sidebar content goes here */}
    </div>
  );
}
