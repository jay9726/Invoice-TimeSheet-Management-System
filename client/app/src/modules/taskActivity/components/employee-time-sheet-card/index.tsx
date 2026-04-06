import React from 'react'
import TimesheetStatusBadge from '@/components/timesheet-badge'
import { cn } from '@/lib/utils'
import type { timesheetType } from '@/types/timesheet'
import { useDispatch, useSelector } from 'react-redux'
import { setTimeSheet } from '@/redux/slices/TimeSheetSlice'


interface timeSheetprops {
  sheet: timesheetType
}

const EmployeeTimeSheetCard: React.FC<timeSheetprops> = ({ sheet }) => {

  const dispatch = useDispatch()
  const seletedTimeSheet = useSelector((state: any) => state.timeSheet.timeSheet)

  return (
    <button
      onClick={() => dispatch(setTimeSheet(sheet.timesheetId))}
      className={cn(
        "w-full rounded-lg border px-4 py-3 text-left transition hover:bg-muted",
        seletedTimeSheet === sheet.timesheetId ? "transition border-primary bg-primary/5" : "transition "
      )}
    >
      <div className='flex  justify-between'>
        <div className="font-medium">{sheet.weekStartDate}</div>
        <div>
          <TimesheetStatusBadge status={sheet.status} />
        </div>
      </div>
    </button>
  )
}

export default EmployeeTimeSheetCard
