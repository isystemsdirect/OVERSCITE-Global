
import React from 'react';
import MissionMapPanel from './MissionMapPanel';
import WeatherIntelligencePanel from './WeatherIntelligencePanel';
import InspectionFlowPanel from './InspectionFlowPanel';
import TeamReadinessPanel from './TeamReadinessPanel';
import FinancialPulsePanel from './FinancialPulsePanel';
import LariAdvisoryPulsePanel from './LariAdvisoryPulsePanel';
import EvidenceChainQueuePanel from './EvidenceChainQueuePanel';
import IndustryNewsPanel from './IndustryNewsPanel';
import { CalendarPanel } from './CalendarPanel';

const PanelGrid = () => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
      <div className="md:col-span-2 lg:col-span-3 row-span-2">
        <MissionMapPanel />
      </div>
      <div className="md:col-span-1 lg:col-span-1">
        <WeatherIntelligencePanel />
      </div>
      <div className="md:col-span-1 lg:col-span-1">
        <TeamReadinessPanel />
      </div>
       <div className="md:col-span-1 lg:col-span-1">
        <CalendarPanel />
      </div>
      <div className="md:col-span-3 lg:col-span-4">
        <InspectionFlowPanel />
      </div>
      <div className="md:col-span-1 lg:col-span-2">
        <LariAdvisoryPulsePanel />
      </div>
      <div className="md:col-span-1 lg:col-span-2">
        <EvidenceChainQueuePanel />
      </div>
      <div className="md:col-span-1 lg:col-span-2">
        <IndustryNewsPanel />
      </div>
      <div className="md:col-span-3 lg:col-span-4">
        <FinancialPulsePanel />
      </div>
    </div>
  );
};

export default PanelGrid;
