import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useToast } from "@/hooks/useToast";
import { decompressFromEncodedURIComponent } from "lz-string";
import { SessionAuthentication } from "@/modules/auth/guards/SessisonAuthentication";
import { clearAllLog } from "@/redux/slices/taskActivitySlice";
import Loader from "@/components/loader";
import { useCreateTimeEntry } from '../../apis/mutation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const WorkLogTable: React.FC = () => {

    const toast = useToast();
    const dispatch = useAppDispatch();
    const taskActivities = useAppSelector((state) => state.taskActivity.taskActivity)

    const { mutate: createTaskActivity, isPending: isCreatingTaskActivity } = useCreateTimeEntry()

    const submitAllWorkLog = () => {
        const session = SessionAuthentication.getSession();
        const decrpyEmployeeId = decompressFromEncodedURIComponent(session?.id as string);

        createTaskActivity({ employeeId: decrpyEmployeeId, payload: taskActivities }, {
            onSuccess: () => {
                toast.success("Task Activity Created Successfully")
                dispatch(clearAllLog())
            },
            onError: () => {
                toast.error("Timesheet Is Submitted OR Approved So You Can't Create Task Activity")
                dispatch(clearAllLog())
            }
        })
    }

    { isCreatingTaskActivity && <Loader /> }

    const getcontent = () => {
        if (taskActivities.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center text-slate-500">
                        <p className="font-medium">{"No Task/Activity Found"}</p>
                    </TableCell>
                </TableRow>
            )
        } else {
            return (
                taskActivities.map((task, index) => {
                    return (
                        <TableRow
                            key={index}
                            className="group border-b">
                            <TableCell className="p-4 text-center text-sm">
                                {task.workDate}
                            </TableCell>

                            <TableCell className="p-4 text-center text-sm">
                                {task.taskActivityName}
                            </TableCell>

                            <TableCell className="max-w-50 overflow-x-hidden p-4 text-center text-sm">
                                {task.notes}
                            </TableCell>

                            <TableCell className="p-4 text-center text-sm">
                                {task.projectName}
                            </TableCell>

                            <TableCell className="p-4 text-center text-sm">
                                {task.clientName}
                            </TableCell>

                            <TableCell className="p-4 text-center">
                                {task.startTime}
                            </TableCell>
                            <TableCell className="p-4 text-center">
                                {task.endTime}
                            </TableCell>
                            <TableCell className="p-4 text-center">
                                {task.hoursWorked}
                            </TableCell>
                            <TableCell className={cn("p-4 text-center",
                                task.isBillable ? 'text-green-500' : 'text-red-500'
                            )}>
                                {task.isBillable ? "Yes" : "No"}
                            </TableCell>
                        </TableRow>
                    )
                })
            )
        }
    }


    return (
        <>
            <div className="max-h-115 overflow-y-auto rounded-md shadow-sm">
                <Table className='border border-border'>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Date
                            </TableHead>
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Task/Activity
                            </TableHead>
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Notes
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Project Name
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Client Name
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Start Time
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                End Time
                            </TableHead>

                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Hours
                            </TableHead>
                            <TableHead className="h-12 text-center align-middle font-semibold text-primary uppercase tracking-wider">
                                Billable
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {getcontent()}
                    </TableBody>
                </Table>
            </div>


            {(taskActivities.length !== 0) && (
                <div className="flex justify-end mt-2">
                    <Button onClick={() => submitAllWorkLog()}>Submit All Work Log</Button>
                </div>)}
        </>
    )
}

export default WorkLogTable