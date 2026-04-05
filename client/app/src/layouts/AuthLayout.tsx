import { Toaster } from '@/components/ui/sonner';
import React from 'react'
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
    return (
        <div className='min-h-screen flex'>
            <Toaster position="top-right" swipeDirections={["right"]} duration={2000} />
            <div className='flex-1 flex flex-col'>
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout

