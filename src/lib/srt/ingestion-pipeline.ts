import { HardwareTelemetryPayload } from '../scing/drone/telemetryEnforcer';

/**
 * Standard Data Record (SDR) wrapping for hardware ingestion.
 */
export interface SRTIngestionPacket {
  packetId: string;
  sourceType: 'HARDWARE_TELEMETRY';
  payload: HardwareTelemetryPayload;
  ingestedAt: string;
  truthState: 'live';
}

const srtBuffer: SRTIngestionPacket[] = [];

/**
 * The Sensor Record Trace (SRT) Ingestion Pipeline.
 * All hardware telemetry MUST pass through this funnel before touching OVERSCITE state or LARI context layers.
 */
export class SRTIngestionPipeline {
  
  static ingestTelemetry(telemetry: HardwareTelemetryPayload): SRTIngestionPacket {
     const packet: SRTIngestionPacket = {
        packetId: `SRT-TEL-${Date.now()}-${telemetry.deviceId}`,
        sourceType: 'HARDWARE_TELEMETRY',
        payload: telemetry,
        ingestedAt: new Date().toISOString(),
        truthState: 'live' // Hardware telemetry is deterministic continuous observation
     };

     srtBuffer.push(packet);
     
     // In a production system, this would emit to a state manager (Zustand, Redux, or WebSockets)
     // and keep only a sliding window of buffers to prevent memory leaks.
     if (srtBuffer.length > 1000) {
        srtBuffer.shift();
     }

     return packet;
  }

  static getRecentFeed(deviceId: string, count: number = 10): SRTIngestionPacket[] {
     return srtBuffer.filter(p => p.payload.deviceId === deviceId).slice(-count);
  }
}
