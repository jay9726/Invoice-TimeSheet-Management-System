import { EmployeeSlider } from "@/components/sliders/employee-slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Outlet } from "react-router-dom"



const EmployeeLayout = () => {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <SidebarProvider>
      <Toaster position="top-right" swipeDirections={["right"]} duration={2000} />

      <EmployeeSlider />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1>Employee Console</h1>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default EmployeeLayout;
