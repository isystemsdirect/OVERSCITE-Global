/**
 * @classification UI_COMPONENT
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * A themed container for individual panels within the PanelEngine. It provides
 * a consistent header, background, and 'glass' effect, ensuring that all
 * panels adhere to the SCINGULAR™ visual language.
 */

import React from 'react';

interface PanelContainerProps {
  title: string;
  children: React.ReactNode;
}

export const PanelContainer: React.FC<PanelContainerProps> = ({ title, children }) => {
  return (
    <div
      className="w-full h-full bg-black/20 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden"
    >
      <div className="h-8 px-4 flex items-center bg-black/30 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white/80">{title}</h3>
      </div>
      <div className="p-4 h-[calc(100%-2rem)]">
        {children}
      </div>
    </div>
  );
};
