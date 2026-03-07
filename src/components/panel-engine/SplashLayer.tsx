/**
 * @classification UI_COMPONENT
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * Provides the visual backdrop for the Instrument Focus mode. It creates
 * a blurred, semi-transparent overlay within the PanelEngine bounds,
 * ensuring that the focused panel is clearly isolated without hijacking
 * the entire viewport.
 */

import React from 'react';

interface SplashLayerProps {
  children: React.ReactNode;
  onDismiss: () => void;
}

export const SplashLayer: React.FC<SplashLayerProps> = ({ children, onDismiss }) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only dismiss if the click is on the backdrop itself, not the content
    if (e.target === e.currentTarget) {
      onDismiss();
    }
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="max-w-[80%] max-h-[85%] w-full h-full border border-white/10 rounded-lg shadow-2xl"
        // Stop propagation to prevent clicks inside the content from closing the splash
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
