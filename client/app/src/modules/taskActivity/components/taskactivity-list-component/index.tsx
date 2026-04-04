import React from 'react'
import EmployeeTaskActivityCard from '../employee-task-card'
import { useGetTaskActivityFromTimesheetId, useGetTimeSheetByEmployeeId } from '../../apis/queries'
import Loader from '@/components/loader'
import { useAppSelector } from '@/lib/hooks'
import { SessionAuthentication } from '@/modules/auth/guards/SessisonAuthentication'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { useTimeSheetSubmit } from '../../apis/mutation'
import type { timesheetType } from '@/types/timesheet'
import type { taskActivityType } from '@/types/taskActivity'
import { decompressFromEncodedURIComponent } from 'lz-string'


const canEditTimesheet = (status?: string) => {
    return status === "DRAFT" || status === "REJECTED"
}

const TaskActivityListComponent: React.FC = () => {

    const toast = useToast();
    const session = SessionAuthentication.getSession();
    const decrpyEmployeeId = decompressFromEncodedURIComponent(session?.id as string);
    const selectedTimeSheet = useAppSelector((state) => state.timeSheet.timeSheet)

    const { data: sheetListData } = useGetTimeSheetByEmployeeId(decrpyEmployeeId)
    const selectedSheet = sheetListData?.data?.find((s: timesheetType) => s.timesheetId === selectedTimeSheet)

    const seletedTimeSheet = useAppSelector((state) => state.timeSheet.timeSheet)
    const { data, isPending } = useGetTaskActivityFromTimesheetId(decrpyEmployeeId, seletedTimeSheet)
    const canEdit = canEditTimesheet(selectedSheet?.status)

    const { mutate: timeSheetSubmit, isPending: isSubmitting } = useTimeSheetSubmit()

    const handleSubmit = () => {
        timeSheetSubmit(selectedTimeSheet, {
            onSuccess: () => {
                toast.success('Timesheet submitted successfully And Email Send To The Manager')
            },
            onError: () => {
                toast.error('Something went wrong')
            }
        })
    }


    const getContent = () => {
        if (isPending) {
            return <Loader />
        } else if (data?.data?.length === 0) {
            return (
                <div className="flex  justify-center items-center rounded-xl border p-5  text-muted-foreground">
                    No Tasks available for this timesheet.
                </div>
            )
        } else {
            return (
                data?.data?.map((taskActivity: taskActivityType) => (
                    <EmployeeTaskActivityCard
                        key={taskActivity.timeEntryId}
                        taskActivity={taskActivity}
                        canEdit={canEdit}
                        isSubmitting={isSubmitting}
                    />
                ))
            )
        }
    }


    return (
        <>
            {
                data?.data?.length > 0 &&
                <div className="flex justify-end">
                    {
                        canEdit &&
                        <Button className="cursor-pointer" onClick={() => handleSubmit()}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    }
                </div>
            }
            <div className=" max-h-[70vh] overflow-y-scroll scroll-smooth mt-4 space-y-4">
                {getContent()}
            </div>
        </>
    )
}

export default TaskActivityListComponent