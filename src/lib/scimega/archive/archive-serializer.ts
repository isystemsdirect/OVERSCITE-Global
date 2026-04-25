/**
 * @classification ARCHIVE_SERIALIZER
 * @authority ArcHive™ Packaging Layer
 * @purpose Serializes ArcHive™ manifests to JSON with mandatory boundary declarations.
 * @warning Serialized output is evidence only. No executable content is included.
 */

import type { ArcHiveManifest } from './archive-manifest-types';

export class ArchiveSerializer {
  private static readonly HEADER = [
    '════════════════════════════════════════════════════════════',
    '  ArcHive™ SCIMEGA™ Configuration Manifest',
    '  EVIDENCE ONLY — NO EXECUTION — NO HARDWARE WRITE — NO C2',
    '════════════════════════════════════════════════════════════'
  ];

  /**
   * Serializes a manifest to formatted JSON with boundary header.
   */
  static serialize(manifest: ArcHiveManifest, compact: boolean = false): string {
    ArchiveSerializer.validateNoExecutableContent(manifest);

    const header = ArchiveSerializer.HEADER.join('\n');
    const body = compact
      ? JSON.stringify(manifest)
      : JSON.stringify(manifest, null, 2);

    return `${header}\n\n${body}`;
  }

  /**
   * Validates that no executable content is present in the manifest.
   */
  private static validateNoExecutableContent(manifest: ArcHiveManifest): void {
    const serialized = JSON.stringify(manifest);
    const forbidden = ['child_process', 'exec(', 'spawn(', 'eval(', 'Function(', 'require(', 'import('];
    for (const keyword of forbidden) {
      if (serialized.includes(keyword)) {
        throw new Error(`ArcHive™ BLOCKED: Manifest contains forbidden executable content: "${keyword}"`);
      }
    }
  }
}
