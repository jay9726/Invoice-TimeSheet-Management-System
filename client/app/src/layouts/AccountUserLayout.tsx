import { AccountuserSidebar } from '@/components/navbars/acoount-user-navbar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { useAppDispatch } from '@/lib/hooks'
import { logoutUser } from '@/redux/slices/authSlice'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AccountUserLayout: React.FC = () => {

  const dispatch = useAppDispatch()

  return (
    <SidebarProvider>
      <Toaster position="top-right" swipeDirections={["right"]} duration={2000} />
      <AccountuserSidebar
        collapsible="offcanvas"
        user={{ name: "account user", email: "acocuntuser@gmail.com", avatarUrl: "" }}
        onLogout={() => dispatch(logoutUser())}

      />

      {/* Main */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1>Account User Panel</h1>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AccountUserLayout