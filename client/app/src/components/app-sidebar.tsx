// import * as React from "react"
// import { NavUser } from "@/components/nav-user"
// import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator, useSidebar } from "@/components/ui/sidebar"
// import { Avatar, AvatarImage } from "./ui/avatar"
// import { cn } from "@/lib/utils"
// import SidebarNavLink from "./sidebar-nav-links"
// import type { mergeIcon } from "./icon"
// import { logoutUser } from "@/redux/slices/authSlice"
// import { useAppDispatch } from "@/lib/hooks"

// export interface SideBarItem {
//   title: string;
//   url: string;
//   icon: mergeIcon["name"];
// }


// const mainItems: SideBarItem[] = [
//   {
//     title: "Dashboard",
//     url: "/admin/dashboard",
//     icon: "dashboard",
//   },
//   {
//     title: "Companies",
//     url: "/admin/companies",
//     icon: "companies"
//   },
//   {
//     title: "Bank Accounts",
//     url: "/admin/bankdetails",
//     icon: "bankAccount",
//   },
//   {
//     title: "Clients",
//     url: "/admin/clients",
//     icon: "client",
//   },
//   {
//     title: "Projects",
//     url: "/admin/projects",
//     icon: "project",
//   },
//   {
//     title: "Users",
//     url: "/admin/users",
//     icon: "users",
//   },
//   {
//     title: "Invoices",
//     url: "/admin/invoices",
//     icon: "invoice",
//   }

// ]


// const userData = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
// }

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

//   const { state } = useSidebar();
//   const dispatch = useAppDispatch();
//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader className="flex justify-center items-center">
//         <Avatar
//           className={cn(
//             "rounded-none",
//             state === "collapsed" ? "h-6 w-6" : "h-17 w-full"
//           )}
//         >
//           {
//             state === "collapsed" ? (
//               <AvatarImage src="/metalogo.png" alt="ITSMS Logo" />
//             ) :
//               <AvatarImage src="/logo.png" alt="ITSMS Logo" />
//           }
//         </Avatar>
//       </SidebarHeader>

//       <SidebarSeparator className="bg-border/50 w-full mx-0" />

//       <SidebarContent className="px-4 py-4">
//         <SidebarGroup className="p-0">
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {mainItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild >
//                     <SidebarNavLink item={item} />
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>


//       <SidebarFooter>
//         <NavUser user={userData.user} Logout={() => dispatch(logoutUser())} />
//       </SidebarFooter>
//     </Sidebar>
//   )
// }
