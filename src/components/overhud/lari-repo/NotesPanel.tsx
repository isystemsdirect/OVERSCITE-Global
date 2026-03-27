// src/components/overhud/lari-repo/NotesPanel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useOverHUD } from '../context/OverHUDContextProvider';
import { notesService } from '@/lib/lari-repo/notes-service';
import { FindingNote } from '@/lib/lari-repo/types';
import { MessageSquare, Plus, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotesPanel() {
  const { currentFindingId, currentReviewerId } = useOverHUD();
  const [notes, setNotes] = useState<FindingNote[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (currentFindingId) {
      notesService.getNotesForFinding(currentFindingId).then(setNotes);
    }
  }, [currentFindingId]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !currentFindingId) return;
    
    await notesService.addNote({
      findingId: currentFindingId,
      text: newNote,
      type: 'context',
      authorId: currentReviewerId || 'system-user',
      learningPortalStatus: 'pending'
    });
    
    setNewNote('');
    notesService.getNotesForFinding(currentFindingId).then(setNotes);
  };

  if (!currentFindingId) {
    return (
      <div className="flex items-center justify-center h-full text-[10px] font-mono text-muted-foreground uppercase p-12 text-center">
        SELECT A FINDING TO VIEW NOTES
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black/20">
      <div className="p-3 border-b border-border/20 bg-black/40 flex justify-between items-center">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">NOTES FOR #{currentFindingId}</span>
        <MessageSquare size={14} className="text-primary" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notes.length === 0 ? (
          <div className="text-[10px] font-mono text-muted-foreground italic text-center p-8 border border-dashed border-border/20">NO NOTES RECORDED</div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="bg-black/40 border border-border/10 p-3 rounded-sm">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono text-primary uppercase">{note.authorId}</span>
                    <span className="text-[8px] font-mono text-muted-foreground">{new Date(note.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-foreground leading-relaxed">{note.text}</p>
                <div className="mt-2 text-[8px] font-mono uppercase text-muted-foreground flex justify-between items-center">
                    <div className="flex gap-2">
                        <span>Type: {note.type}</span>
                        <span>•</span>
                        <span>Learning: {note.learningPortalStatus}</span>
                    </div>
                    {note.learningPortalStatus === 'pending' && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                (async () => {
                                    const { learningPortalService } = await import('@/lib/lari-repo/learning-portal-service');
                                    await learningPortalService.dispatchToLearningQueue({
                                        findingId: note.findingId,
                                        type: 'note_bundle',
                                        payload: { noteId: note.id, text: note.text }
                                    });
                                    // Refresh logic here
                                })();
                            }}
                            className="text-primary hover:underline italic"
                        >
                            DISPATCH TO QUEUE
                        </button>
                    )}
                </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-black/40 border-t border-border/20">
        <div className="flex gap-2">
            <input 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                placeholder="ADD APPEND-ONLY NOTE..."
                className="flex-1 bg-black/60 border border-border/30 rounded px-3 py-2 text-[11px] font-mono focus:border-primary/50 outline-none"
            />
            <button 
                onClick={handleAddNote}
                className="bg-primary text-black px-3 py-2 rounded hover:bg-primary/80 transition-colors"
            >
                <Send size={14} />
            </button>
        </div>
      </div>
    </div>
  );
}
