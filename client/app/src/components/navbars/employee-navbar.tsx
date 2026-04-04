import * as React from "react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarFooter, SidebarHeader, SidebarContent } from "@/components/ui/sidebar"
import {
    LogOut,
    ClipboardList,
    Clock,
    History,
    LayoutDashboard,
} from "lucide-react"

const navlinks = [
    { to: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employee/logtime", label: "Log-time", icon: ClipboardList },
    { to: "/employee/timesheets", label: "Time-sheet", icon: Clock },
    { to: "/employee/history", label: "History", icon: History },
]

type AdminSidebarProps = React.ComponentProps<typeof Sidebar> & {
    user?: {
        name: string
        email?: string
        avatarUrl?: string
    }
    onLogout?: () => void
}

const EmployeeSidebar = ({
    user = {
        name: "Admin User",
        email: "admin@company.com",
        avatarUrl: "",
    },
    onLogout,
    ...props
}: AdminSidebarProps) => {

    return (
        <Sidebar {...props}>
            <SidebarHeader className="bg-white">
                <div className="px-3 py-5 flex items-center justify-center">
                    <img src="/CS-Logo.svg" alt="logo" />
                </div>
            </SidebarHeader>

            <SidebarContent className="bg-white">
                <SidebarMenu className="mt-3 px-2">
                    {navlinks.map((link) => {
                        const Icon = link.icon

                        return (
                            <SidebarMenuItem key={link.to} className="mt-1">
                                <NavLink
                                    to={link.to}
                                    end={link.to === "/employee"}
                                    className={({ isActive }) =>
                                        cn(
                                            "group/nav flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ",
                                            isActive
                                                ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 before:absolute before:left-0 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-primary"
                                                : "text-secondary hover:bg-secondary/80 hover:text-white"
                                        )
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                className={cn(
                                                    "h-5 w-5 transition-all duration-200",
                                                    isActive ? "text-primary" : "text-secondary group-hover/nav:text-white"
                                                )}
                                            />
                                            <span>{link.label}</span>
                                        </>
                                    )}
                                </NavLink>

                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="mt-auto  bg-white border-t">
                {/* Logout button */}
                <button
                    type="button"
                    onClick={onLogout}
                    className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        "text-destructive hover:bg-destructive/10 hover:text-destructive"
                    )}
                >
                    <LogOut className="h-5 w-5 transition-colors text-destructive group-hover:text-destructive" />
                    <span>Logout</span>
                </button>
            </SidebarFooter>
        </Sidebar>
    )
}


export default EmployeeSidebar;

