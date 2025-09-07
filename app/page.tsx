import { redirect } from "next/navigation";
import WebLayout from "./(pages)/layout";
import RealTimeData from "./(pages)/realTimeData/page";
import { auth } from "./auth";

export default async function Home() {
  const session = await auth()
  if (!session?.userToken) {
    // If the user is not authenticated, redirect to the login page
    redirect("/login");
  }
  return (
    <WebLayout>
      <RealTimeData/>
    </WebLayout>
  );
}
