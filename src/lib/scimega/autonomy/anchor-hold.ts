/**
 * @classification ANCHOR_HOLD
 * @authority Flight Autonomy Architecture Unit
 * @purpose Represents the stationary stabilization envelope (position, altitude, orientation).
 * @warning Simulation only. Does not output live stabilization commands.
 */

export interface AnchorHoldState {
  isActive: boolean;
  reason: 'pilot_interrupt' | 'obstacle_avoidance' | 'teon_boundary' | 'mission_pause' | 'user_command' | 'none';
  positionLockAvailable: boolean; // GPS or Vision Odometry
  altitudeLockAvailable: boolean; // Barometer or Lidar
  orientationLockAvailable: boolean; // IMU / Compass
  estimatedDriftRadiusMeters: number;
}

export class AnchorHoldModel {
  /**
   * Evaluates the readiness of the system to maintain a stable anchor hold.
   */
  static evaluateHoldReadiness(
    gpsFixType: string,
    satelliteCount: number,
    visionOdometryActive: boolean,
    windSpeedMph: number
  ): AnchorHoldState {
    const positionLockAvailable = (gpsFixType === '3D' && satelliteCount >= 8) || visionOdometryActive;
    const altitudeLockAvailable = true; // Assuming standard baro equipped
    const orientationLockAvailable = true; // Assuming standard IMU equipped

    // Rough drift estimation based on lock quality and wind
    let driftRadius = 0.5; // base drift
    if (!positionLockAvailable) {
      driftRadius += 2.0; // Significant drift without position lock
    }
    if (windSpeedMph > 15) {
      driftRadius += 1.0;
    }

    return {
      isActive: false, // Initial evaluation state
      reason: 'none',
      positionLockAvailable,
      altitudeLockAvailable,
      orientationLockAvailable,
      estimatedDriftRadiusMeters: driftRadius
    };
  }
}
