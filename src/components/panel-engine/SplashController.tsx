/**
 * @classification UI_CONTROLLER
 * @authority Director
 * @status IMPLEMENTED
 * @version 2.0.0
 *
 * @purpose
 * Manages the Instrument Focus Splash, rendering the active panel in an
 * isolated, centered overlay. It also handles the deactivation of the
 * splash mode via background click or ESC key press.
 * This version is updated to use the `useSplash` context hook.
 */

import React, { useEffect } from 'react';
import PanelRegistry from './PanelRegistry';
import { SplashLayer } from './SplashLayer';
import { PanelContainer } from './PanelContainer';
import { useSplash } from '../../context/SplashContext';

export const SplashController: React.FC = () => {
  const { activePanelId, closeSplash } = useSplash();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSplash();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSplash]);

  if (!activePanelId) return null;

  const panelDef = PanelRegistry[activePanelId];
  if (!panelDef) {
    console.warn(`No panel registered for ID: ${activePanelId}`);
    return null;
  }

  const PanelComponent = panelDef.component;

  return (
    <SplashLayer onDismiss={closeSplash}>
      <PanelContainer title={panelDef.displayName}>
        <PanelComponent />
      </PanelContainer>
    </SplashLayer>
  );
};
