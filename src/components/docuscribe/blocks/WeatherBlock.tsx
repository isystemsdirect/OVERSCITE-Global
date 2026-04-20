/**
 * DocuSCRIBE™ — Weather Intelligence Block
 * 
 * Renders live or snapshotted environmental risks within the document canvas.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Cloud, Wind, Thermometer, ShieldAlert, RefreshCw, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWeatherData, type WeatherDataPayload } from '@/lib/docuscribe/connectors/WeatherConnector';
import { useDocuScribe } from '@/lib/docuscribe/context';

interface WeatherBlockProps {
  id: string;
  pageId: string;
}

export function WeatherBlock({ id, pageId }: WeatherBlockProps) {
  const { activeDocument, refreshDataBlock, captureBlockSnapshot } = useDocuScribe();
  const [data, setData] = useState<WeatherDataPayload | null>(null);
  const [loading, setLoading] = useState(false);

  // Retrieve block metadata from context
  const page = activeDocument?.pages.find(p => p.page_id === pageId);
  const block = page?.blocks?.[id];

  const isLive = block?.mode === 'live';

  useEffect(() => {
    if (block?.mode === 'snapshot' && block.data) {
      setData(block.data);
    } else if (isLive && !loading) {
      handleRefresh();
    }
  }, [block?.mode, id]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Mock coordinates if document doesn't have them
      const lat = activeDocument?.location?.lat || 40.7128;
      const lng = activeDocument?.location?.lng || -74.0060;
      
      const newData = await getWeatherData(lat, lng);
      setData(newData);
      refreshDataBlock(pageId, id); // Update timestamp in context
    } catch (error) {
      console.error('Weather fetch failed', error);
    } finally {
      setLoading(false);
    }
  };

  if (!data && !loading) return null;

  return (
    <div className={cn(
      "my-6 p-4 rounded-lg border flex flex-col gap-4 transition-all duration-300",
      isLive 
        ? "bg-blue-500/5 border-blue-500/20 shadow-lg shadow-blue-500/5" 
        : "bg-zinc-500/5 border-zinc-500/20 grayscale-[0.5]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-1.5 rounded-md",
            isLive ? "bg-blue-500/20 text-blue-400" : "bg-zinc-500/20 text-zinc-400"
          )}>
            <Cloud size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Intelligence Block</span>
              <span className={cn(
                "text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase",
                isLive ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-500/20 text-zinc-400"
              )}>
                {isLive ? 'Live Feed' : 'Snapshot Frozen'}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white/90">Environmental Risk Profile</h4>
          </div>
        </div>

        <div className="flex gap-2">
          {isLive && (
            <button 
              onClick={handleRefresh}
              className="p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-white transition-colors"
              title="Refresh Live Data"
            >
              <RefreshCw size={14} className={cn(loading && "animate-spin")} />
            </button>
          )}
          {isLive && (
            <button 
              onClick={() => captureBlockSnapshot(pageId, id)}
              className="p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-white transition-colors"
              title="Capture Snapshot"
            >
              <Lock size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* IRI Score */}
        <div className="col-span-1 p-3 rounded-md bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold text-white/30 uppercase mb-1">IRI Score</div>
          <div className={cn("text-2xl font-black", 
            data?.iriBand === 'Low' ? 'text-emerald-400' : 
            data?.iriBand === 'Moderate' ? 'text-amber-400' : 'text-rose-400'
          )}>
            {loading ? '---' : data?.iri}
          </div>
          <div className="text-[8px] font-bold uppercase tracking-tighter text-white/40">{data?.iriBand} RISK</div>
        </div>

        {/* Temperature */}
        <div className="col-span-1 p-3 rounded-md bg-white/5 border border-white/10 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 mb-1">
            <Thermometer size={10} className="text-blue-400" />
            <span className="text-[9px] font-bold text-white/40 uppercase">Ambient</span>
          </div>
          <div className="text-lg font-bold text-white/90">{loading ? '--' : data?.temp}°F</div>
          <div className="text-[8px] font-medium text-white/30 italic capitalize">{data?.conditions}</div>
        </div>

        {/* Roof Temp */}
        <div className="col-span-1 p-3 rounded-md bg-white/5 border border-white/10 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldAlert size={10} className="text-amber-400" />
            <span className="text-[9px] font-bold text-white/40 uppercase">Roof Surface</span>
          </div>
          <div className="text-lg font-bold text-white/90">{loading ? '--' : data?.roofTemp}°F</div>
          <div className="text-[8px] font-medium text-white/30 italic">Infrared Delta</div>
        </div>

        {/* Wind */}
        <div className="col-span-1 p-3 rounded-md bg-white/5 border border-white/10 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 mb-1">
            <Wind size={10} className="text-zinc-400" />
            <span className="text-[9px] font-bold text-white/40 uppercase">Wind Gust</span>
          </div>
          <div className="text-lg font-bold text-white/90">{loading ? '--' : data?.windSpeed} mph</div>
          <div className="text-[8px] font-medium text-white/30 italic">Anemometer High</div>
        </div>
      </div>

      {/* Footer / Attribution */}
      <div className="flex items-center justify-between text-[8px] font-mono text-white/20 uppercase tracking-widest pt-2 border-t border-white/5">
        <span>Source: NOAA-INTELLIGENCE-FUSION</span>
        <span>As of: {loading ? 'UPDATING...' : new Date(data?.timestamp || '').toLocaleString()}</span>
      </div>
    </div>
  );
}
