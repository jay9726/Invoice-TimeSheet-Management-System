// import * as React from "react"
// import { NavLink } from "react-router-dom"
// import { cn } from "@/lib/utils"
// import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarFooter, SidebarHeader, SidebarContent } from "@/components/ui/sidebar"
// import {
//     LogOut,
//     ClipboardList,
//     Clock,
//     History,
//     LayoutDashboard,
// } from "lucide-react"

// const navlinks = [
//     { to: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
//     { to: "/employee/logtime", label: "Log-time", icon: ClipboardList },
//     { to: "/employee/timesheets", label: "Time-sheet", icon: Clock },
//     { to: "/employee/history", label: "History", icon: History },
// ]

// type AdminSidebarProps = React.ComponentProps<typeof Sidebar> & {
//     user?: {
//         name: string
//         email?: string
//         avatarUrl?: string
//     }
//     onLogout?: () => void
// }

// const EmployeeSidebar = ({
//     user = {
//         name: "Admin User",
//         email: "admin@company.com",
//         avatarUrl: "",
//     },
//     onLogout,
//     ...props
// }: AdminSidebarProps) => {

//     return (
//         <Sidebar {...props}>
//             <SidebarHeader className="bg-white">
//                 <div className="px-3 py-5 flex items-center justify-center">
//                     <img src="/CS-Logo.svg" alt="logo" />
//                 </div>
//             </SidebarHeader>

//             <SidebarContent className="bg-white">
//                 <SidebarMenu className="mt-3 px-2">
//                     {navlinks.map((link) => {
//                         const Icon = link.icon

//                         return (
//                             <SidebarMenuItem key={link.to} className="mt-1">
//                                 <NavLink
//                                     to={link.to}
//                                     end={link.to === "/employee"}
//                                     className={({ isActive }) =>
//                                         cn(
//                                             "group/nav flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ",
//                                             isActive
//                                                 ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 before:absolute before:left-0 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-primary"
//                                                 : "text-secondary hover:bg-secondary/80 hover:text-white"
//                                         )
//                                     }
//                                 >
//                                     {({ isActive }) => (
//                                         <>
//                                             <Icon
//                                                 className={cn(
//                                                     "h-5 w-5 transition-all duration-200",
//                                                     isActive ? "text-primary" : "text-secondary group-hover/nav:text-white"
//                                                 )}
//                                             />
//                                             <span>{link.label}</span>
//                                         </>
//                                     )}
//                                 </NavLink>

//                             </SidebarMenuItem>
//                         )
//                     })}
//                 </SidebarMenu>
//             </SidebarContent>

//             <SidebarFooter className="mt-auto  bg-white border-t">
//                 {/* Logout button */}
//                 <button
//                     type="button"
//                     onClick={onLogout}
//                     className={cn(
//                         "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                         "text-destructive hover:bg-destructive/10 hover:text-destructive"
//                     )}
//                 >
//                     <LogOut className="h-5 w-5 transition-colors text-destructive group-hover:text-destructive" />
//                     <span>Logout</span>
//                 </button>
//             </SidebarFooter>
//         </Sidebar>
//     )
// }


// export default EmployeeSidebar;



























import * as React from "react"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { logoutUser } from "@/redux/slices/authSlice"
import { useAppDispatch } from "@/lib/hooks"

import type { mergeIcon } from "../icon"
import { Avatar, AvatarImage } from "../ui/avatar"
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
            "rounded-none",
            state === "collapsed" ? "h-6 w-6" : "h-17 w-full"
          )}
        >
          {
            state === "collapsed" ? (
              <AvatarImage src="/metalogo.png" alt="ITSMS Logo" />
            ) :
              <AvatarImage src="/logo.png" alt="ITSMS Logo" />
          }
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
