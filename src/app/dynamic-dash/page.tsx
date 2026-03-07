/**
 * @classification ROUTE
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 */

'use client';

import PanelEngine from '../../components/panel-engine/PanelEngine';
import Sidebar from '../../components/Sidebar';
import OverHUD from '../../components/OverHUD';

export default function DynamicDashPage() {
  return (
    <>
      <Sidebar />
      <OverHUD />
      <PanelEngine />
    </>
  );
}
