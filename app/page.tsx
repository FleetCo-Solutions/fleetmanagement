import WebLayout from "./(pages)/layout";
import RealTimeData from "./(pages)/realTimeData/page";
import VehiclesOverview from "./(pages)/vehicleOverview/page";

export default function Home() {
  return (
    <WebLayout>
      <RealTimeData/>
    </WebLayout>
  );
}
