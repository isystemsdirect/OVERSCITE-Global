// src/lib/lari-repo/notes-service.ts
import { FindingNote } from './types';
import { auditService } from './audit-service';

export class NotesService {
  private notes: FindingNote[] = [];

  async addNote(note: Omit<FindingNote, 'id' | 'timestamp'>): Promise<FindingNote> {
    const newNote: FindingNote = {
      ...note,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    this.notes.push(newNote);

    await auditService.logEvent({
      type: 'note_added',
      actorId: note.authorId,
      actorRole: 'reviewer',
      findingId: note.findingId,
      timestamp: newNote.timestamp,
      newState: newNote
    });

    return newNote;
  }

  async getNotesForFinding(findingId: string): Promise<FindingNote[]> {
    return this.notes.filter(n => n.findingId === findingId);
  }
}

export const notesService = new NotesService();
