import * as React from "react"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { logoutUser } from "@/redux/slices/authSlice"
import { useAppDispatch } from "@/lib/hooks"

import type { mergeIcon } from "../icon"
import { Avatar } from "../ui/avatar"
import SidebarNavLink from "../sidebar-nav-links"
import Loader from "../loader"
import { useGetEmployeeById } from "@/modules/user/apis/queries"
import { SessionAuthentication } from "@/modules/auth/guards/SessisonAuthentication"
import { decompressFromEncodedURIComponent } from "lz-string"


export interface SideBarItem {
  title: string;
  url: string;
  icon: mergeIcon["name"];
}

const mainItems: SideBarItem[] = [
  {
    title: "Dashboard",
    url: "/employee/dashboard",
    icon: "dashboard",
  },
  {
    title: "LogTime",
    url: "/employee/logtime",
    icon: "logtime"
  },
  {
    title: "TimeSheets",
    url: "/employee/timesheets",
    icon: "timesheet",
  },
  {
    title: "History",
    url: "/employee/history",
    icon: "history",
  }
]


export function EmployeeSlider({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { state } = useSidebar();
  const dispatch = useAppDispatch();


  const session = SessionAuthentication.getSession();
  const userId = decompressFromEncodedURIComponent(session?.id as string);

  const { data, isPending } = useGetEmployeeById(userId);

  const getContent = () => {
    if (isPending) {
      return <Loader />
    }

    if (data) {
      return (
        <NavUser name={data?.data?.fullName} email={data?.data?.email} avatar={data.avatarUrl} Logout={() => dispatch(logoutUser())} />
      )
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex justify-center items-center">
        <Avatar
          className={cn(
            "rounded-none flex items-center justify-center transition-all duration-200",
            state === "collapsed" ? "hidden" : "h-full w-full"
          )}
        >
          {state !== "collapsed" && <h1 className="font-bold text-4xl text-primary">ITSMS</h1>}

        </Avatar>
      </SidebarHeader>

      <SidebarSeparator className="bg-border/50 w-full mx-0" />

      <SidebarContent className="px-2 py-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild >
                    <SidebarNavLink item={item} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>


      <SidebarFooter>
        {getContent()}
      </SidebarFooter>
    </Sidebar>
  )
}
