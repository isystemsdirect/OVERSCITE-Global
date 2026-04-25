/**
 * @classification SCRIPT_ANNOTATION
 * @authority SCIMEGA Terminal Emulation Layer
 * @purpose Generates headers and wrappers to explicitly brand emulation scripts as non-executing.
 */

import type { SCIMEGAConfigurationProposal } from '../export/scimega-export-types';

export class ScriptAnnotation {
  /**
   * Generates the immutable header for any SCIMEGA simulation script.
   */
  static generateHeader(proposal: SCIMEGAConfigurationProposal): string {
    const timestamp = new Date().toISOString();
    return `
######################################################################
# SCIMEGA™ SIMULATION ONLY — NO EXECUTION
# ARC AUTHORIZED PROPOSAL REQUIRED FOR REAL USE
# 
# Proposal ID: ${proposal.proposalId}
# Generated: ${timestamp}
# Risk Classification: ${proposal.diff.classification.toUpperCase()}
#
# WARNING: This script is generated for observational review ONLY.
# Do NOT copy and paste this blindly without physical ARC validation.
######################################################################
`.trim() + '\n\n';
  }

  /**
   * Generates the immutable footer for any SCIMEGA simulation script.
   */
  static generateFooter(): string {
    return `
######################################################################
# END OF SIMULATION SCRIPT
######################################################################
`.trim() + '\n';
  }
}
