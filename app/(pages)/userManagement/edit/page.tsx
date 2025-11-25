import { Suspense } from "react";
import EditUserPage from "./components/editPage";

export default function Page() {
  return (
    <Suspense>
      <EditUserPage />
    </Suspense>
  );
}
