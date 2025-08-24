import { ReactNode } from "react";
import AdminSideBarNavigation from "../components/AdminSideBarNavigation";
import AdminTopNavigation from "../components/AdminTopNavigation";
// import { auth } from "../../auth";
// import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  // const session = await auth()
  // if (!session) {
  //   redirect("/login");
  // }
  
  return (
    <div>
      <div className="flex">
        <AdminSideBarNavigation />
        <div className="w-[94%]">
          <div>
            <AdminTopNavigation />
          </div>
          <div className="h-[93vh] overflow-auto bg-white">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
