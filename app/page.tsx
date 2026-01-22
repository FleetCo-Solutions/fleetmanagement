
import WebLayout from "./(pages)/layout";
import RealTimeData from "./(pages)/dashboard/page";

export default async function Home() {
 
  return (
    <WebLayout>
      <RealTimeData/>
    </WebLayout>
  );
}
