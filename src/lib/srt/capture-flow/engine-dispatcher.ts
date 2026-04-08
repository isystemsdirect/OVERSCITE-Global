/**
 * SRT Accepted Engine Dispatcher
 *
 * Implements the EngineConsumeAcceptedOnlyContract required by UTCB-003.
 *
 * Core Doctrine:
 * - Only fully formal, hashed, locked `SourceMediaRecord` objects can be dispatched to engines.
 * - This prevents bypass pipelines that analyze candidate captures directly from the camera buffer.
 * - Enforces sequential engine consumption preventing batch homogenization.
 *
 * See: docs/governance/SRT_PHOTO_INTAKE_GATE.md
 */

import type { SourceMediaRecord } from '../media/source-media-record';
import { srtDerivativeService } from '../media/derivative-generation';

/**
 * Ensures strict enforcement that only accepted and locked records
 * reach the engine bounds.
 */
export interface EngineConsumeAcceptedOnlyContract {
  dispatchForAnalysis(record: SourceMediaRecord): Promise<void>;
  assertAcceptedTruthState(record: SourceMediaRecord): void;
}

export class SrtEngineDispatcher implements EngineConsumeAcceptedOnlyContract {
  /**
   * Dispatches a legally locked source record for derivative generation and subsequent engine analysis.
   *
   * @param record The locked SourceMediaRecord to analyze.
   */
  public async dispatchForAnalysis(record: SourceMediaRecord): Promise<void> {
    this.assertAcceptedTruthState(record);

    console.log(`[ENGINE_DISPATCHER] Initiating post-accept analysis sequence for source: ${record.id}`);

    try {
      // Step 1: Derivative Generation (Working Assets)
      // Done non-destructively, returning separate references.
      console.log(`[ENGINE_DISPATCHER] Generating derivatives for: ${record.id}`);
      await srtDerivativeService.generateDerivatives(record);

      // Step 2: Formal Engine Routing
      // In full production, this dispatches individual jobs to LARI Vision,
      // Map Context extractors, etc.
      console.log(`[ENGINE_DISPATCHER] Dispatching ${record.id} to connected analysis engines...`);
      await this.simulateEngineAnalysis(record);

      console.log(`[ENGINE_DISPATCHER] Analysis sequence completed for: ${record.id}`);

    } catch (e) {
      console.error(`[ENGINE_DISPATCHER] Analysis failure on ${record.id}:`, e);
      // NOTE: Doctrine states derivative/analysis failure does NOT invalidate source preservation.
    }
  }

  /**
   * BANE-aligned enforcement boundary preventing unaccepted raw buffers from crossing into analysis.
   */
  public assertAcceptedTruthState(record: SourceMediaRecord): void {
    if (!record || typeof record !== 'object') {
      throw new Error(`[BANE_VIOLATION] Engine dispatched an undefined or malformed payload. Expected SourceMediaRecord.`);
    }
    if (record.truthState !== 'locked_source') {
      throw new Error(
        `[BANE_VIOLATION] Engine bypassed acceptance gate. Payload truth state is "${record.truthState}" ` +
        `but only "locked_source" objects may be analyzed.`
      );
    }
  }

  /**
   * Simulates active engine connection delay (e.g. LARI-Vision).
   * @internal
   */
  private async simulateEngineAnalysis(record: SourceMediaRecord): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500); // 1.5s simulated heavy processing
    });
  }
}

export const srtEngineDispatcher = new SrtEngineDispatcher();
