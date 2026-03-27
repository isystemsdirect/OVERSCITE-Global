/**
 * @classification HOOK
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * Provides a governed interface for panels to subscribe to data streams
 * from the Normalized Metric Store. Enforces read-only access and exposes
 * data confidence levels to the UI.
 */

import { useDataStream } from '../data/normalized-metric-store';
import { NormalizedMetricStoreState } from '../types/data-contracts';

export const usePanelData = <T extends keyof NormalizedMetricStoreState>(
  streamName: T
) => {
  const stream = useDataStream(streamName);

  const ConfidenceIndicator: React.FC = () => {
    const colorMap = {
      LIVE: 'text-green-400',
      CACHED: 'text-gray-400',
      DELAYED: 'text-yellow-400',
      STALE: 'text-orange-400',
      INVALID: 'text-red-500',
    };

    return (
      <div className={`absolute top-2 right-2 text-xs font-mono ${colorMap[stream.confidence]}`}>
        {stream.confidence}
      </div>
    );
  };

  return { ...stream, ConfidenceIndicator };
};
