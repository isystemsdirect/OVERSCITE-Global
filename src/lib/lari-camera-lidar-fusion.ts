
'use client';
import * as THREE from 'three';
import { lariLiDARController, LiDARPoint, LiDARScan } from './lari-lidar-controller';
import { TaskDrivenAISystem } from './task-driven-ai-system';

export interface CameraCalibration {
  intrinsicMatrix: number[][]; // 3x3 camera intrinsic matrix
  distortionCoeffs: number[];  // Distortion coefficients [k1, k2, p1, p2, k3]
  extrinsicMatrix: number[][]; // 4x4 camera to LiDAR transform
  imageSize: { width: number; height: number };
}

export interface LiveFusionData {
  timestamp: number;
  cameraFrame: ImageData | HTMLVideoElement;
  lidarPoints: LiDARPoint[];
  fusedMesh: THREE.Mesh | null;
  detectedObjects: DetectedObject[];
  environmentMetrics: EnvironmentMetrics;
  aiInsights: AIInsight[];
}

export interface DetectedObject {
  id: string;
  type: 'building' | 'vehicle' | 'person' | 'tree' | 'pole' | 'sign' | 'unknown';
  boundingBox3D: {
    center: [number, number, number];
    dimensions: [number, number, number];
    rotation: [number, number, number];
  };
  confidence: number;
  pointCount: number;
  color: [number, number, number];
  velocity?: [number, number, number];
  classification: string;
}

export interface EnvironmentMetrics {
  totalPoints: number;
  scanDensity: number; // points per cubic meter
  coverageArea: number; // square meters
  heightRange: { min: number; max: number };
  surfaceTypes: Record<string, number>;
  visibility: number; // 0-1 score
  weatherConditions: {
    precipitation: number;
    visibility: number;
    temperature?: number;
  };
  motionDetected: boolean;
  noiseLevel: number;
}

export interface AIInsight {
  id: string;
  type: 'observation' | 'prediction' | 'anomaly' | 'recommendation' | 'task_completion';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  confidence: number;
  timestamp: number;
  relatedObjects?: string[];
  suggestedActions?: string[];
  learnedFrom?: string; // What triggered this insight
}

import { EventEmitter } from 'events';

export class LariCameraLiDARFusion extends EventEmitter {
  private isActive: boolean = false;
  private timer: NodeJS.Timeout | null = null;

  constructor() {
    super();
  }

  public startLiveFusion() {
    this.isActive = true;
    this.timer = setInterval(() => {
      this.emit('fusionDataUpdated', this.generateMockFusionData());
    }, 500);
    
    // Simulate camera initialization
    setTimeout(() => {
        this.emit('cameraInitialized', { videoElement: { srcObject: null } });
    }, 100);
  }

  public stopLiveFusion() {
    this.isActive = false;
    if (this.timer) clearInterval(this.timer);
  }

  public cleanup() {
    this.stopLiveFusion();
    this.removeAllListeners();
  }

  public generateLiveReport(): string {
    return `LARI FUSION REPORT - ${new Date().toISOString()}\nStatus: ${this.isActive ? 'ACTIVE' : 'INACTIVE'}\n...`;
  }

  private generateMockFusionData(): LiveFusionData {
    return {
      timestamp: Date.now(),
      cameraFrame: {} as any,
      lidarPoints: [],
      fusedMesh: null,
      detectedObjects: [],
      environmentMetrics: {
        totalPoints: 15420,
        scanDensity: 0.85,
        coverageArea: 42.5,
        heightRange: { min: 0, max: 8.4 },
        surfaceTypes: { 'concrete': 0.7, 'metal': 0.3 },
        visibility: 0.92,
        weatherConditions: { precipitation: 0, visibility: 1.0 },
        motionDetected: false,
        noiseLevel: 0.05
      },
      aiInsights: []
    };
  }
}

export const lariCameraLiDARFusion = new LariCameraLiDARFusion();
