"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name?: string
    logo: React.ElementType
    plan?: string
  }[]
}) {
  if (!teams[0]) return null

  return (
    <SidebarMenu
      /* 👇 THIS IS THE KEY */
      className="group-data-[collapsible=icon]:items-center"
    >
      <SidebarMenuItem
        className="
          h-14 flex items-center
          group-data-[collapsible=icon]:justify-center
          group-data-[collapsible=icon]:px-0
        "
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="
                h-12
                w-full
                flex items-center gap-3
                transition-all duration-200 ease-linear

                /* 👇 FORCE RAIL CENTER */
                group-data-[collapsible=icon]:w-10
                group-data-[collapsible=icon]:justify-center
                group-data-[collapsible=icon]:px-0
              "
            >
              {/* ICON */}
              <div
                className="
                  bg-sidebar-primary text-sidebar-primary-foreground
                  flex size-8 shrink-0
                  items-center justify-center rounded-lg
                "
              >
                {React.createElement(teams[0].logo, {
                  className: "size-4",
                })}
              </div>

              {/* TEXT (GONE IN ICON MODE) */}
              <div
                className="
                  grid flex-1 text-left text-sm leading-tight
                  transition-all duration-200 ease-linear
                  group-data-[collapsible=icon]:hidden
                "
              >
                <span className="truncate font-medium">
                  {teams[0].name}
                </span>
                <span className="truncate text-xs">
                  {teams[0].plan}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
