import React from "react";
import Loader from "@/components/loader";
import { useAccountUserDashboard } from "../apis/queries";
import AccountUserSummaryCard from "../components/accountuser-summary-card";
import Icon from "@/components/icon";

const AccountUserDashboard: React.FC = () => {

    const { data, isPending } = useAccountUserDashboard();

    if (isPending) return <Loader />

    const cardData = [
        {
            label: "Total Companies",
            value: data?.totalCompanies,
            description: "Total number of registered companies",
            icon: <Icon name="building" width={22} height={22} stroke="currentColor" />,
            textColor: "text-indigo-600",
            bgColor: "bg-indigo-50",
            leftBorderColor: "bg-indigo-500"
        },
        {
            label: "Total Clients",
            value: data?.totalClients,
            description: "Total number of active clients",
            icon: <Icon name="users" width={22} height={22} stroke="currentColor" />,
            textColor: "text-sky-600",
            bgColor: "bg-sky-50",
            leftBorderColor: "bg-sky-500"
        },
        {
            label: "Active Projects",
            value: data?.totalProjects,
            description: "Total number of ongoing projects",
            icon: <Icon name="buildings" width={22} height={22} stroke="currentColor" />,
            textColor: "text-rose-600",
            bgColor: "bg-rose-50",
            leftBorderColor: "bg-rose-500"
        },
        {
            label: "Invoices Generated",
            value: data?.totalGeneratedInvoices,
            description: "Total number of generated invoices",
            icon: <Icon name="generated" width={22} height={22} stroke="currentColor" />,
            textColor: "text-amber-600",
            bgColor: "bg-amber-50",
            leftBorderColor: "bg-amber-500"
        },
        {
            label: "Finalized Invoices",
            value: data?.totalFinalizedInvoices,
            description: "Total number of finalized invoices",
            icon: <Icon name="finalized" width={22} height={22} stroke="currentColor" />,
            textColor: "text-blue-600",
            bgColor: "bg-blue-50",
            leftBorderColor: "bg-blue-500"
        },
        {
            label: "Paid Invoices",
            value: data?.totalPaidInvoices,
            description: "Total number of successfully paid invoices",
            icon: <Icon name="paid" width={22} height={22} stroke="currentColor" />,
            textColor: "text-emerald-600",
            bgColor: "bg-emerald-50",
            leftBorderColor: "bg-emerald-500"
        },
    ];

    return (
        <div className="mx-auto flex max-w-7xl w-full flex-col gap-4 md:gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 min-h-auto">

            <div className="space-y-2">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted text-sm sm:text-base max-w-3xl">
                    Get a high-level view of your companies, clients, actively billing projects, and invoicing status at a glance.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {cardData.map((card, index) => (
                    <AccountUserSummaryCard key={index} card={card} />
                ))}
            </div>
        </div>
    );
};

export default AccountUserDashboard;