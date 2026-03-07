
import dynamic from 'next/dynamic';

const PanelRegistry = {
  DispatchPanel: dynamic(() => import('./panels/DispatchPanel')),
  GaugePanel: dynamic(() => import('./panels/GaugePanel')),
  TimeSeriesPanel: dynamic(() => import('./panels/TimeSeriesPanel')),
};

export default PanelRegistry;
