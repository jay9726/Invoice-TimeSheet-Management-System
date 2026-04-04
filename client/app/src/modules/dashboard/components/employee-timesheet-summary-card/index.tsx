import React from 'react'

interface timesheetProps {
    label: string,
    value: string,
    colorClass: string,
    icon: React.ReactNode
}

const EmployeeTimesheetSummaryCard: React.FC<{ metric: timesheetProps }> = ({ metric }) => {
    return (
        <div className="flex flex-col items-center gap-2 group">
            <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md ${metric.colorClass}`}
            >
                {metric.icon}
            </div>
            <div className="text-xl font-bold text-slate-900">{metric.value !== undefined ? metric.value : '--'}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{metric.label}</div>
        </div>
    )
}

export default EmployeeTimesheetSummaryCard