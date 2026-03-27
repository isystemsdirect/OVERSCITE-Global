
import dynamic from 'next/dynamic';

const PanelRegistry: Record<string, { component: any, displayName: string }> = {
  DispatchPanel: {
    component: dynamic(() => import('./panels/DispatchPanel')),
    displayName: 'Dispatch Operational Focus',
  },
  GaugePanel: {
    component: dynamic(() => import('./panels/GaugePanel')),
    displayName: 'Instrumentation Gauges',
  },
  TimeSeriesPanel: {
    component: dynamic(() => import('./panels/TimeSeriesPanel')),
    displayName: 'Temporal Data Analysis',
  },
};

export default PanelRegistry;
