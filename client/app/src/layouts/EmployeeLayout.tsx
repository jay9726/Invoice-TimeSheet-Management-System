import EmployeeSidebar from "@/components/navbars/employee-navbar";
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner";
import { useAppDispatch } from "@/lib/hooks";
import { logoutUser } from "@/redux/slices/authSlice";
import { Outlet } from "react-router-dom"



const EmployeeLayout = () => {

  const dispatch = useAppDispatch();

  return (
    <SidebarProvider>
       <Toaster position="top-right" swipeDirections={["right"]} duration={2000} />
      <EmployeeSidebar
        collapsible="offcanvas"
        user={{ name: "Employee", email: "emplloyee@gmail.com", avatarUrl: "" }}
        onLogout={() => dispatch(logoutUser())}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1>Employee Console</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default EmployeeLayout;
