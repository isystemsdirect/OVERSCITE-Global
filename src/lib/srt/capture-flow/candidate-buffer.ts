/**
 * SRT Candidate Capture Buffer State
 *
 * Defines the ephemeral, non-evidence-bearing structure for photos captured
 * by the technician but NOT YET accepted into the formal SRT pipeline.
 */

export type CandidateCaptureState =
  | 'captured_candidate'
  | 'selected_for_accept'
  | 'rejected_candidate';

export interface CandidatePhoto {
  candidateId: string;
  captureSessionId: string;
  previewUri: string;
  tempSourceUri: string;
  createdAt: string;
  truthState: CandidateCaptureState;
  isSelected?: boolean; // UI tracking override
  advisory?: {
    blurWarning?: boolean;
    duplicateWarning?: boolean;
  };
}

export class CandidateSessionBuffer {
  private candidates: CandidatePhoto[] = [];
  public currentSessionId: string = `sess-${Date.now()}`;

  /**
   * Add a newly captured photo to the buffer.
   */
  public addCapture(tempUri: string): CandidatePhoto {
    const candidate: CandidatePhoto = {
      candidateId: `cand-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      captureSessionId: this.currentSessionId,
      previewUri: tempUri, // Mapped locally
      tempSourceUri: tempUri,
      createdAt: new Date().toISOString(),
      truthState: 'captured_candidate',
      isSelected: false,
    };
    this.candidates.push(candidate);
    return candidate;
  }

  /**
   * Retrieve all current candidates not explicitly rejected.
   */
  public getActiveCandidates(): CandidatePhoto[] {
    return this.candidates.filter(
      (c) => c.truthState === 'captured_candidate' || c.truthState === 'selected_for_accept'
    );
  }

  /**
   * Toggle selection state for batch acceptance.
   */
  public toggleSelection(candidateId: string, isSelected: boolean): void {
    const candidate = this.candidates.find((c) => c.candidateId === candidateId);
    if (candidate && candidate.truthState !== 'rejected_candidate') {
      candidate.isSelected = isSelected;
      candidate.truthState = isSelected ? 'selected_for_accept' : 'captured_candidate';
    }
  }

  /**
   * Mark a candidate as discarded. It will be removed from the active buffer.
   */
  public discardCandidate(candidateId: string): void {
    const candidate = this.candidates.find((c) => c.candidateId === candidateId);
    if (candidate) {
      candidate.truthState = 'rejected_candidate';
      candidate.isSelected = false;
    }
  }

  /**
   * Transition selected candidates out of the buffer and into the Accepted Queue.
   *
   * @returns The raw URIs to be handed to the SRT Intake Queue.
   */
  public acceptSelected(): string[] {
    const accepted = this.candidates.filter((c) => c.isSelected && c.truthState === 'selected_for_accept');
    
    const acceptedIds = accepted.map((c) => c.candidateId);
    
    // Purge them from the local candidate buffer since edge owns transition state now
    this.candidates = this.candidates.filter((c) => !c.isSelected);
    
    return acceptedIds;
  }
}
