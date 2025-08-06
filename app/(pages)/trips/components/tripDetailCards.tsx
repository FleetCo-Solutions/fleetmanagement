import React from 'react';
import OverviewRealTime from '@/app/components/cards/overviewRealTime';

interface TripDetailCardsProps {
  performanceData: {
    fuelEfficiency: number;
    avgSpeed: number;
    idleTime: number;
    speedViolations: number;
  };
}

const TripDetailCards: React.FC<TripDetailCardsProps> = ({ performanceData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <OverviewRealTime
        title="Fuel Efficiency"
        quantity={`${performanceData.fuelEfficiency} km/L`}
        description="Current trip"
      />
      <OverviewRealTime
        title="Average Speed"
        quantity={`${performanceData.avgSpeed} km/h`}
        description="Current trip"
      />
      <OverviewRealTime
        title="Idle Time"
        quantity={`${performanceData.idleTime} min`}
        description="Current trip"
      />
      <OverviewRealTime
        title="Violations"
        quantity={performanceData.speedViolations}
        description="Speed violations"
      />
    </div>
  );
};

export default TripDetailCards; 