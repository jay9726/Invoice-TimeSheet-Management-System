import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import React, { useState } from 'react'
import TimesheetDecisionDialog from '../decision-dialog'
import ManagerTaskCard from '../manager-task-card'
import { useAppSelector } from '@/lib/hooks'
import { useGetTaskActivityFromTimesheetId } from '@/modules/taskActivity/apis/queries'
import Loader from '@/components/loader'
import { SessionAuthentication } from '@/modules/auth/guards/SessisonAuthentication'
import type { taskActivityType } from '@/types/taskActivity'
import { decompressFromEncodedURIComponent } from 'lz-string'

interface managerTaskComponentProps {
    employeeId: string
}

const ManagerTaskComponent: React.FC<managerTaskComponentProps> = ({ employeeId }) => {

    const seletedTimeSheet = useAppSelector((state: any) => state.timeSheet.timeSheet)

    const session = SessionAuthentication.getSession();
    const decrpyEmployeeId = decompressFromEncodedURIComponent(session?.id as string);

    const { data, isPending } = useGetTaskActivityFromTimesheetId(decrpyEmployeeId, seletedTimeSheet)

    const [open, setOpen] = useState(false);


    const getContent = () => {
        if (isPending) {
            return <Loader />
        }
        else if (data?.data.length === 0) {
            return (
                <div className="flex justify-center items-center rounded-xl border p-5 text-muted">
                    No Tasks available for this timesheet.
                </div>
            )
        } else {
            return (
                data.data.map((task: taskActivityType) => (
                    <ManagerTaskCard key={task.timeEntryId} task={task} />
                ))
            )
        }
    }

    return (
        <>
            <Card className="w-full rounded-2xl px-6 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="text-lg font-semibold">
                        Task Activities
                    </div>

                    {
                        data?.data.length > 0 &&
                        <Button className="rounded-xl" onClick={() => setOpen(true)}>
                            Approve / Reject
                        </Button>
                    }
                </div>

                <div className="max-h-[70vh] overflow-y-scroll scroll-smooth space-y-4">

                    {getContent()}

                </div>
            </Card>

            <TimesheetDecisionDialog open={open} onOpenChange={setOpen} employeeId={employeeId} />
        </>
    )
}

export default ManagerTaskComponent