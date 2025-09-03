import { ReactNode } from "react";
import AdminSideBarNavigation from "../components/AdminSideBarNavigation";
import AdminTopNavigation from "../components/AdminTopNavigation";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  
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
