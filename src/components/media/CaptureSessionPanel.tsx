"use client";

/**
 * Capture Session UI
 *
 * Implements the non-blocking inspection workflow from UTCB-003.
 * 
 * Flow:
 * 1. Capture -> adds to CandidateSessionBuffer (no analysis, no hashing)
 * 2. Select/Discard -> user controls which items move forward
 * 3. Accept -> passes localUris to srtAcceptedQueue
 * 4. Background Progress -> shows lightweight queue status without blocking new captures
 */

import React, { useState, useEffect } from "react";
import { CandidateSessionBuffer, CandidatePhoto } from "../../lib/srt/capture-flow/candidate-buffer";
import { srtAcceptedQueue, AcceptedQueueItem } from "../../lib/srt/capture-flow/accepted-queue";
import { SrtTruthStatusBadge } from "./SrtTruthStatusBadge";
import { Camera, CheckCircle2, Trash2, Loader2, ArrowRight, Shield } from "lucide-react";

export function CaptureSessionPanel() {
  const [buffer] = useState(() => new CandidateSessionBuffer());
  const [candidates, setCandidates] = useState<CandidatePhoto[]>([]);
  const [queueState, setQueueState] = useState<ReadonlyArray<AcceptedQueueItem>>([]);

  // Subscribe to queue state for lightweight background tracking
  useEffect(() => {
    const unsubscribe = srtAcceptedQueue.subscribe((state) => {
      setQueueState(state);
    });
    return unsubscribe;
  }, []);

  const refreshBufferList = () => {
    setCandidates([...buffer.getActiveCandidates()]);
  };

  const handleSimulateCapture = () => {
    // Generate a mock URI
    const mockUri = `file:///var/mobile/Containers/Data/Application/mock-shutter-${Date.now()}.jpg`;
    buffer.addCapture(mockUri);
    refreshBufferList();
  };

  const handleToggleSelect = (candidateId: string, currentStatus: boolean) => {
    buffer.toggleSelection(candidateId, !currentStatus);
    refreshBufferList();
  };

  const handleDiscard = (candidateId: string) => {
    buffer.discardCandidate(candidateId);
    refreshBufferList();
  };

  const handleAcceptSelected = () => {
    const acceptedIds = buffer.acceptSelected();
    if (acceptedIds.length > 0) {
      srtAcceptedQueue.enqueueBatch(acceptedIds, "jpeg");
      refreshBufferList();
    }
  };

  // Queue active stats
  // We no longer consider the queue "active" just because a processing item exists, because items rest at `accepted_unanalyzed`.
  const activeQueueCount = queueState.filter(q => q.state === 'accepted_analysis_requested' || q.state === 'analysis_pending' || q.state === 'analysis_in_progress' || q.state === 'intake_in_progress').length;
  const restingCount = queueState.filter(q => q.state === 'accepted_unanalyzed').length;
  const completedCount = queueState.filter(q => q.state === 'analysis_complete' || q.state === 'verification_bound' || q.state === 'export_generated').length;

  return (
    <div className="flex flex-col gap-4 p-4 border border-[#333] rounded bg-black text-gray-200">
      <div className="flex items-center justify-between border-b border-[#333] pb-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase flex items-center gap-2">
            <Camera size={16} /> Optional Capture Buffer
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Fast continuous capture. No analysis occurs until photos are accepted.
          </p>
        </div>
        <button
          onClick={handleSimulateCapture}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] rounded text-sm font-semibold text-gray-300 transition-colors"
        >
          <Camera size={14} /> Shutter
        </button>
      </div>

      {/* CANDIDATE TRAY */}
      {candidates.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto py-2">
          {candidates.map((cand) => (
            <div
              key={cand.candidateId}
              className={`relative flex-shrink-0 w-32 h-24 border rounded overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-colors ${
                cand.isSelected ? "border-amber-500 bg-[#1a1000]" : "border-[#333] bg-[#0a0a0a]"
              }`}
              onClick={() => handleToggleSelect(cand.candidateId, cand.isSelected || false)}
            >
              <span className="text-[10px] text-gray-500 font-mono mb-1 truncate w-full text-center px-1">
                {cand.candidateId.split("-")[2]}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-gray-600">Candidate</span>
              
              <div className="absolute top-1 right-1 flex gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDiscard(cand.candidateId); }}
                  className="p-1 rounded bg-black/50 text-gray-400 hover:text-red-400"
                  title="Discard"
                >
                  <span title="Discard"><Trash2 size={12} /></span>
                </button>
                <div className={`p-1 rounded bg-black/50 ${cand.isSelected ? 'text-amber-500' : 'text-transparent'}`}>
                  <span title="Selected"><CheckCircle2 size={12} /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-[#444] border-dashed border border-[#222] rounded">
          No active candidate items.<br/>Press Shutter to build buffer.
        </div>
      )}

      {/* ACCEPTANCE CONTROLS */}
      <div className="flex justify-between items-center bg-[#050505] p-2 rounded border border-[#1a1a1a]">
        <div className="text-xs text-gray-400">
          Selected: <strong className="text-amber-500">{candidates.filter(c => c.isSelected).length}</strong> / {candidates.length}
        </div>
        <button
          onClick={handleAcceptSelected}
          disabled={!candidates.some(c => c.isSelected)}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-900/30 hover:bg-amber-800/40 border border-amber-900 rounded text-amber-500 text-xs font-semibold disabled:opacity-30 transition-all"
        >
          Accept Selected to Evidence <ArrowRight size={14} />
        </button>
      </div>

      {/* NON-BLOCKING QUEUE STATUS */}
      {queueState.length > 0 && (
        <div className="mt-2 text-xs border-t border-[#222] pt-3">
          <div className="flex justify-between items-center text-gray-500 mb-2">
            <span className="uppercase tracking-widest text-[9px] flex items-center gap-1.5">
              {activeQueueCount > 0 ? <span title="Processing"><Loader2 size={10} className="animate-spin text-amber-500" /></span> : <CheckCircle2 size={10} className="text-green-500" />}
              Background Queue
            </span>
            <span>{completedCount} / {queueState.length} complete</span>
          </div>
          <div className="space-y-1">
            {queueState.map((q) => (
              <div key={q.queueId} className="flex justify-between items-center bg-[black] border border-[#111] p-1.5 rounded">
                <span className="font-mono text-[9px] text-[#555] truncate w-1/4">{q.queueId}</span>
                <div className="flex items-center gap-2">
                  <SrtTruthStatusBadge state={q.state as any} />
                  {q.state === 'accepted_unanalyzed' && (
                     <button
                       onClick={() => srtAcceptedQueue.requestAnalysisForItems([q.queueId])}
                       className="ml-2 px-2 py-0.5 border border-sky-900 bg-sky-950 text-sky-400 hover:bg-sky-900 rounded text-[9px] flex gap-1 items-center font-bold tracking-wider"
                       title="Consume Tokens & Compute"
                     >
                       <Shield size={10} /> Analyze
                     </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
