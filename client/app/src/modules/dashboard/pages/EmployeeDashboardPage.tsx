import React from "react"
import Loader from "@/components/loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEmployeeDashboard } from "../apis/queries"
import { SessionAuthentication } from "@/modules/auth/guards/SessisonAuthentication"
import EmployeeSummaryCard from "../components/employee-summary-card"
import EmployeeTimesheetSummaryCard from "../components/employee-timesheet-summary-card"
import Icon from "@/components/icon"
import { decompressFromEncodedURIComponent } from "lz-string"


const EmployeeDashboard: React.FC = () => {

    const session = SessionAuthentication.getSession();
    const decrpyEmployeeId = decompressFromEncodedURIComponent(session?.id as string);
    const { data, isPending } = useEmployeeDashboard(decrpyEmployeeId);

    if (isPending) return <Loader />

    const cardData = [
        {
            label: "Total Timesheets",
            value: data?.totalTimeSheets,
            description: "Total number of logged timesheets",
            icon: <Icon name="timeSheet" width={22} height={22} stroke="currentColor" />,
            textColor: "text-indigo-600",
            bgColor: "bg-indigo-50",
            leftBorderColor: "bg-indigo-500"
        },
        {
            label: "Total Billable Hours",
            value: data?.totalBillableHours,
            description: "Total number of billable hours",
            icon: <Icon name="approved" width={22} height={22} stroke="currentColor" />,
            textColor: "text-emerald-600",
            bgColor: "bg-emerald-50",
            leftBorderColor: "bg-emerald-500"
        },
        {
            label: "Total Hours Worked",
            value: data?.totalWorkedHours,
            description: "Total number of hours worked",
            icon: <Icon name="clock" width={22} height={22} stroke="currentColor" />,
            textColor: "text-amber-600",
            bgColor: "bg-amber-50",
            leftBorderColor: "bg-amber-500"
        },
        {
            label: "This Month Timesheets",
            value: data?.thisMonthTotalTimesheets,
            description: "Total number of timesheets this month",
            icon: <Icon name="timeSheet" width={22} height={22} stroke="currentColor" />,
            textColor: "text-sky-600",
            bgColor: "bg-sky-50",
            leftBorderColor: "bg-sky-500"
        },
        {
            label: "This Month Billable Hours",
            value: data?.thisMonthBillableHours,
            description: "Total number of billable hours this month",
            icon: <Icon name="approved" width={22} height={22} stroke="currentColor" />,
            textColor: "text-violet-600",
            bgColor: "bg-violet-50",
            leftBorderColor: "bg-violet-500"
        },
    ];

    const statusMetrics = [
        {
            label: "Draft",
            value: data?.totalDraftTimeSheets,
            colorClass: "bg-slate-500",
            icon: <Icon name="timeSheet" width={20} height={20} stroke="white" />
        },
        {
            label: "Submitted",
            value: data?.totalSubmittedTimeSheets,
            colorClass: "bg-blue-500",
            icon: <Icon name="send" width={20} height={20} stroke="white" />
        },
        {
            label: "Approved",
            value: data?.totalApprovedTimeSheets,
            colorClass: "bg-emerald-500",
            icon: <Icon name="approved" width={20} height={20} stroke="white" />
        },
        {
            label: "Rejected",
            value: data?.totalRejectedTimeSheets,
            colorClass: "bg-rose-500",
            icon: <Icon name="rejected" width={20} height={20} stroke="white" />
        },
    ];

    return (
        <div className="mx-auto flex max-w-7xl w-full flex-col gap-4 md:gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-5 min-h-auto bg-slate-50/50">

            <div className="space-y-2">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-secondary">My Activity Workspace</h1>
                <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
                    Track your timesheets, logged hours, and current approval statuses at a glance.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {cardData.map((card, index) => (
                    <EmployeeSummaryCard key={index} card={card} />
                ))}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
                <Card className="hover:shadow-md transition-shadow duration-300 border border-slate-200/50 bg-white">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-secondary">Your Timesheets Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {statusMetrics.map((metric, index) => (
                                <EmployeeTimesheetSummaryCard key={index} metric={metric} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EmployeeDashboard;