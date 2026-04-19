/**
 * DocuSCRIBE™ — Google Docs Connector Panel
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P3_CONNECTOR
 *
 * UI representation of the Google Docs connection state.
 * Currently serves as a boundary stub awaiting Director-authorized API keys.
 */

'use client';

import React, { useState } from 'react';
import { Cloud, CloudOff, RefreshCw, UploadCloud, DownloadCloud, ServerCrash } from 'lucide-react';
import { googleDocsConnector } from '@/lib/docuscribe/connectors/google-docs-connector';
import { Button } from '@/components/ui/button';

export function GoogleDocsConnectorPanel() {
  const [state, setState] = useState(googleDocsConnector.getState());
  
  const handleConnect = async () => {
    setState('connecting');
    await googleDocsConnector.connect();
    setState(googleDocsConnector.getState());
  };

  return (
    <div className="bg-black/20 border border-white/5 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            {state === 'connected' ? <Cloud className="w-4 h-4" /> :
             state === 'connecting' ? <RefreshCw className="w-4 h-4 animate-spin" /> :
             state === 'error' ? <ServerCrash className="w-4 h-4 text-red-400" /> :
             <CloudOff className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-xs font-bold text-white/90">Google Docs Integration</h3>
            <p className="text-[10px] text-white/40">External Authority Connector</p>
          </div>
        </div>
        
        {state === 'disconnected' || state === 'error' ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleConnect}
            className="h-7 text-[10px] uppercase tracking-wider font-bold bg-transparent border-white/10 hover:bg-white/5"
          >
            Configure Connection
          </Button>
        ) : state === 'connected' ? (
          <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">Connected</span>
        ) : (
          <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 animate-pulse">Contacting Trust Server...</span>
        )}
      </div>

      <div className="p-4 bg-[#0a0a0a]">
        {state === 'error' ? (
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">Configuration Required</h4>
            <p className="text-[10px] text-red-400/70 leading-relaxed">
              Connection refused. Valid OVERSCITE service account credentials or OAuth2 Client ID must be provisioned
              by the Director in the environment variables before this connector can execute external network requests.
            </p>
          </div>
        ) : state === 'connected' ? (
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all">
              <UploadCloud className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Export to Google</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all">
              <DownloadCloud className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Import from Google</span>
            </button>
          </div>
        ) : (
          <p className="text-[10px] text-white/40 leading-relaxed text-center py-4">
            Connect your Google Workspace account to enable bi-directional hybrid authoring capabilities.
          </p>
        )}
      </div>
    </div>
  );
}
