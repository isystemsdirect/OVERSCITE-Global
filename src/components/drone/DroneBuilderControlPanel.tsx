'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlightControllerConfig } from './FlightControllerConfig';
import { ECUManagement } from './ECUManagement';
import { SensorDataPane } from './SensorDataPane';
import { FAACompliancePanel } from './FAACompliancePanel';
import { LARIAutonomousControl } from './LARIAutonomousControl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Rocket, Settings, Wrench } from 'lucide-react';
import { DroneType, DroneConfiguration, FlightController, SensorArray } from '@/lib/drone-types';
import { CANON } from '@/core/canon/terminology';

interface DroneBuilderControlPanelProps {
  droneId: string;
  initialConfig?: DroneConfiguration;
}

export function DroneBuilderControlPanel({ droneId, initialConfig }: DroneBuilderControlPanelProps) {
  const [activeTab, setActiveTab] = useState('flight-controller');
  const [isBuilding, setIsBuilding] = useState(false);
  const [config, setConfig] = useState<DroneConfiguration>(initialConfig || {
    id: droneId,
    name: 'New Drone Build',
    type: 'quadcopter',
    flightController: { firmware: 'betaflight', version: '4.4.0', pids: { p: 45, i: 40, d: 30 } },
    ecu: { voltage: 14.8, maxCurrent: 45, escProtocol: 'dshot600' },
    sensors: { hasGps: true, hasLidar: false, hasOpticalFlow: false },
    camera: { resolution: '4k', fps: 60, gimbal: true },
    faaCompliance: { registered: false, remoteId: false }
  });

  const handleSave = async () => {
    setIsBuilding(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsBuilding(false);
  };

  const StatusIndicator = ({ label, value }: { label: string, value: boolean }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <Badge variant={value ? 'default' : 'destructive'} className="text-xs">
        {value ? 'READY' : 'OFFLINE'}
      </Badge>
    </div>
  );

  return (
    <div className="w-full h-full bg-black/95 text-white p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">SCINGULAR {CANON.BFI} Drone Builder</h1>
            <p className="text-gray-400 mt-1">Configuration & Calibration Interface for {config.name}</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10">
                <Settings className="h-4 w-4 mr-2" /> Load Preset
            </Button>
            <Button onClick={handleSave} disabled={isBuilding} className="bg-blue-600 hover:bg-blue-500">
                {isBuilding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wrench className="h-4 w-4 mr-2" />}
                {isBuilding ? 'Compiling Firmware...' : 'Flash Firmware'}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration Area */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-white/5 border border-white/10 p-1">
              <TabsTrigger value="flight-controller" className="data-[state=active]:bg-blue-600">Flight Controller</TabsTrigger>
              <TabsTrigger value="ecu" className="data-[state=active]:bg-orange-600">ECU / Power</TabsTrigger>
              <TabsTrigger value="sensors" className="data-[state=active]:bg-green-600">Sensors</TabsTrigger>
              <TabsTrigger value="lari" className="data-[state=active]:bg-purple-600">LARI {CANON.BFI}</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
                <TabsContent value="flight-controller">
                    <FlightControllerConfig config={config.flightController} onChange={(fc) => setConfig({...config, flightController: fc})} />
                </TabsContent>
                <TabsContent value="ecu">
                    <ECUManagement config={config.ecu} onChange={(ecu) => setConfig({...config, ecu: ecu})} />
                </TabsContent>
                <TabsContent value="sensors">
                    <SensorDataPane sensors={config.sensors} />
                </TabsContent>
                <TabsContent value="lari">
                    <LARIAutonomousControl 
                        droneId={droneId}
                        aiStatus="active"
                        onAIToggle={(enabled) => {
                            console.log(`Toggled LARI ${CANON.BFI} to ${enabled}`);
                        }}
                    />
                </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Sidebar Status & Diagnostics */}
        <div className="space-y-6">
           {/* Diagnostics Card */}
           <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                    <CardTitle className="text-lg">System Diagnostics</CardTitle>
                    <CardDescription>Real-time pre-flight checks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <StatusIndicator label="Flight Controller Link" value={true} />
                    <StatusIndicator label="GPS Lock" value={config.sensors.hasGps} />
                    <StatusIndicator label="IMU Calibration" value={true} />
                    <StatusIndicator label="Motor Sync" value={true} />
                    <StatusIndicator label="Video Feed (5.8GHz)" value={true} />
                    <StatusIndicator label="Remote ID Broadcast" value={config['faaCompliance']?.remoteId || false} />
                </CardContent>
           </Card>

           {/* FAA Compliance Card */}
           <FAACompliancePanel config={config['faaCompliance']} />

           {/* Quick Actions */}
           <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center border-dashed border-white/20 hover:border-blue-500 hover:bg-blue-500/10">
                    <Plus className="h-6 w-6 mb-2" />
                    <span>Add Module</span>
                </Button>
                 <Button variant="outline" className="h-24 flex flex-col items-center justify-center border-dashed border-white/20 hover:border-green-500 hover:bg-green-500/10">
                    <Rocket className="h-6 w-6 mb-2" />
                    <span>Test Motor</span>
                </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
