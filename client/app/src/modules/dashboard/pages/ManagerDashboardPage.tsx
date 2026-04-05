import React from 'react'
import { useManagerDashboard } from '../apis/queries';
import Loader from '@/components/loader';
import ManagerSummaryCard from '../components/manager-summary-card';
import Icon from '@/components/icon';

const ManagerDashboardPage: React.FC = () => {
    const { data, isPending } = useManagerDashboard();

    if (isPending) return <Loader />

    const cardData = [
        {
            label: "Total Employees",
            value: data.totalEmployees,
            description: "Active workforce under management",
            icon: <Icon name="users" width={22} height={22} stroke="currentColor" />,
            colorClass: "text-blue-600 bg-blue-50 ring-blue-100/50"
        },
        {
            label: "Total Clients",
            value: data.totalClients,
            description: "Active corporate partnerships",
            icon: <Icon name="building" width={22} height={22} stroke="currentColor" />,
            colorClass: "text-indigo-600 bg-indigo-50 ring-indigo-100/50"
        },
        {
            label: "Active Projects",
            value: data.totalProjects,
            description: "Ongoing operational engagements",
            icon: <Icon name="users" width={22} height={22} stroke="currentColor" />,
            colorClass: "text-purple-600 bg-purple-50 ring-purple-100/50"
        },
        {
            label: "Pending Approvals",
            value: data.totalPendingTimesheets,
            description: "Timesheets awaiting your review",
            icon: <Icon name="clock" width={22} height={22} stroke="currentColor" />,
            colorClass: "text-amber-600 bg-amber-50 ring-amber-100/50"
        },
        {
            label: "Approved Logs",
            value: data.totalApprovedTimesheets,
            description: "Successfully processed timesheets",
            icon: <Icon name="approved" width={22} height={22} stroke="currentColor" />,
            colorClass: "text-emerald-600 bg-emerald-50 ring-emerald-100/50"
        },
        {
            label: "Rejected Logs",
            value: data.totalRejectedTimesheets,
            description: "Timesheets requiring revision",
            icon: <Icon name="rejected" width={22} height={22} stroke="currentColor" />,
            colorClass: "text-rose-600 bg-rose-50 ring-rose-100/50"
        },
    ];

    return (
        <div className="flex w-full flex-col gap-8 p-6 md:p-8 max-w-400 mx-auto min-h-auto">

            <div className="flex flex-col gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Operations Control Center</h1>
            </div>

            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
                {cardData.map((card, index) => (
                    <ManagerSummaryCard key={index} card={card} />
                ))}
            </div>
        </div>
    )
}

export default ManagerDashboardPage