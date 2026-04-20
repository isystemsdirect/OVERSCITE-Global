/**
 * DocuSCRIBE™ — Discussion Panel
 * 
 * Internal messaging surface linked to the document lifecycle.
 * Supports context-aware threads (Page/Block linked) for rapid review coordination.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Clock, ShieldAlert, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocuScribe } from '@/lib/docuscribe/context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export function DiscussionPanel() {
  const { activeDocument, postDiscussionMessage } = useDocuScribe();
  const [messageText, setMessageText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple scroll to bottom on new message
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [activeDocument?.discussion_thread]);

  if (!activeDocument) return null;

  const handlePost = () => {
    if (!messageText.trim()) return;
    postDiscussionMessage(messageText);
    setMessageText('');
  };

  const messages = activeDocument.discussion_thread || [];

  return (
    <div className="flex flex-col h-full bg-zinc-950/20">
      {/* Header Info */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Audit-Linked Discussion</span>
        </div>
        <div className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold text-emerald-400 uppercase">
          SECURE CANAL
        </div>
      </div>

      {/* Message Feed */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-12 text-center space-y-4">
              <div className="p-4 rounded-full bg-white/5 border border-white/5 opacity-20">
                <MessageSquare size={32} />
              </div>
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">
                No messaging records found<br />for this document authority.
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="shrink-0 w-8 h-8 rounded bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                  {msg.author.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-white/80 uppercase tracking-wider">{msg.author}</span>
                    <span className="text-[8px] font-mono text-white/20 flex items-center gap-1">
                      <Clock size={8} /> {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-xs text-white/60 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-zinc-900/40">
        <div className="relative">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handlePost();
              }
            }}
            placeholder="Type a message to the distribution thread..."
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pb-12 text-xs text-white/80 outline-none focus:border-primary/40 transition-all resize-none min-h-[90px]"
          />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
             <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] font-bold text-white/30 uppercase tracking-tighter">
                <ShieldAlert size={10} />
                Governed Input
             </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <Button 
              size="icon" 
              onClick={handlePost}
              disabled={!messageText.trim()}
              className="h-8 w-8 bg-primary text-black hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20"
            >
              <Send size={14} />
            </Button>
          </div>
        </div>
        <div className="mt-2 text-[8px] text-center font-bold text-white/10 uppercase tracking-widest">
           Messages are immutable and recorded in the document audit trail
        </div>
      </div>
    </div>
  );
}
