/**
 * @classification OBSTACLE_AVOIDANCE_MODEL
 * @authority Flight Autonomy Architecture Unit
 * @purpose Represents the detection, classification, and recommended avoidance of physical obstacles.
 * @warning Simulation only. Does not output live avoidance commands to flight controllers.
 */

export type ObstacleSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AvoidanceRecommendation = 'avoid' | 'slow' | 'anchor_hold' | 'abort' | 'return_to_origin' | 'none';

export interface ObstructionFrame {
  frameId: string;
  timestamp: string;
  distanceMeters: number;
  bearingDegrees: number;
  elevationDegrees: number;
  estimatedSizeMeters: number;
  severity: ObstacleSeverity;
}

export interface AvoidanceVectorProposal {
  proposalId: string;
  originalTrajectoryHeading: number;
  proposedTrajectoryHeading: number;
  altitudeAdjustmentMeters: number;
  speedAdjustmentFactor: number;
  recommendation: AvoidanceRecommendation;
}

export class ObstacleAvoidanceModel {
  /**
   * Evaluates an obstruction frame and generates a simulated avoidance recommendation.
   */
  static evaluateObstruction(
    frame: ObstructionFrame,
    currentSpeedMps: number
  ): AvoidanceVectorProposal {
    let recommendation: AvoidanceRecommendation = 'none';
    let speedAdjustment = 1.0;
    
    if (frame.severity === 'critical' || frame.distanceMeters < 1.0) {
      recommendation = 'anchor_hold'; // Immediate stop
      speedAdjustment = 0.0;
    } else if (frame.severity === 'high' || (frame.distanceMeters < 3.0 && currentSpeedMps > 2.0)) {
      recommendation = 'avoid';
      speedAdjustment = 0.5; // Slow down while avoiding
    } else if (frame.severity === 'medium') {
      recommendation = 'slow';
      speedAdjustment = 0.8;
    }

    return {
      proposalId: `AVOID-${Date.now()}`,
      originalTrajectoryHeading: 0, // Mock for simulation
      proposedTrajectoryHeading: recommendation === 'avoid' ? (frame.bearingDegrees + 45) % 360 : 0,
      altitudeAdjustmentMeters: 0,
      speedAdjustmentFactor: speedAdjustment,
      recommendation
    };
  }
}
