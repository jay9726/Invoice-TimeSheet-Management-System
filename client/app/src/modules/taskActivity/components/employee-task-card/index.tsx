import React, { useState } from 'react'
import Icon from '@/components/icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ConfirmModal from '@/components/confirm-modal'
import type { taskActivityType } from '@/types/taskActivity'
import DialogBox from '@/components/dialog-box'
import UpdateTaskActivityForm from '../update-taskactivity-form'
import { useDeleteTimeActivity } from '../../apis/mutation'
import { useToast } from '@/hooks/useToast'
import Loader from '@/components/loader'


interface taskActivityProps {
    taskActivity: taskActivityType,
    canEdit: boolean,
    isSubmitting: boolean
}

const EmployeeTaskActivityCard: React.FC<taskActivityProps> = ({ taskActivity, canEdit, isSubmitting }) => {
    const toast = useToast();
    const [open, setOpen] = useState(false)
    const [selectUpdateTaskActivity, setSelectUpdateTaskActivity] = useState(false)
    const [deleteId, setDeleteId] = useState<string>("")
    const [selectedTaskActivityId, setSelectedTaskActivityId] = useState<string>("")

    const { mutate: deleteTaskActivity, isPending: isDeleting } = useDeleteTimeActivity();

    const removeTaskActivity = () => {
        deleteTaskActivity({ taskId: deleteId as string }, {
            onSuccess: () => {
                toast.success('Task activity deleted successfully')
                setOpen(false)
            }
        })
        setOpen(false)
    }

    const isPending = isDeleting

    if (isPending) return <Loader />
    console.log(taskActivity)

    return (
        <>
            <div className="flex flex-col gap-3 rounded-xl border p-4 shadow-sm"                >
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className='flex flex-col gap-1'>
                        <h4 className="font-semibold">{taskActivity.taskName}</h4>
                        <div className='flex gap-8'>
                            <p className="text-sm">
                                Client Name : {taskActivity.clientName}
                            </p>
                            <p className="text-sm">
                                Project Name : {taskActivity.projectName}
                            </p>
                        </div>
                    </div>
                    {
                        canEdit &&
                        <div className="flex justify-center">
                            <Button
                                variant='ghost'
                                className={"transition-all duration-200 hover:bg-primary/20 hover:cursor-pointer"}
                                onClick={() => { setSelectUpdateTaskActivity(true), setSelectedTaskActivityId(taskActivity.timeEntryId) }}
                                disabled={isSubmitting}
                                >
                                <Icon name='update' width={4} height={4} className='text-primary' />
                            </Button>

                            <Button
                                variant='link'
                                onClick={() => { setOpen(true), setDeleteId(taskActivity.timeEntryId) }}
                                className={"transition-all duration-200 hover:bg-destructive/20 hover:text-destructive hover:cursor-pointer"}
                                disabled={isSubmitting}
                                >
                                <Icon name='delete' width={4} height={4} stroke='red' />
                            </Button>
                        </div>
                    }
                </div>

                {/* Meta */}
                <div className="w-full flex flex-wrap gap-6 text-sm">
                    {/* <span>02:15 AM – 03:15 AM</span> */}
                    <span>{taskActivity.startTime} – {taskActivity.endTime}</span>
                    <span>{taskActivity.hoursWorked}h</span>
                    <span
                        className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            taskActivity.isBillable
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                        )}
                    >
                        {taskActivity.isBillable ? "Billable" : "Non-Billable"}
                    </span>
                </div>
                <div className="flex items-start gap-2 rounded-lg p-4 text-sm">
                    <strong>Notes:</strong>
                    <p>{taskActivity.notes}</p>
                </div>
            </div>

            <ConfirmModal
                open={open}
                setOpen={setOpen}
                confirmAction={() => { removeTaskActivity() }}
            />

            <DialogBox
                open={selectUpdateTaskActivity}
                setOpen={setSelectUpdateTaskActivity}
                title="Update Task Activity"
                children={selectedTaskActivityId !== undefined ? <UpdateTaskActivityForm setOpen={setSelectUpdateTaskActivity} taskActivityId={selectedTaskActivityId} /> : null}
            />
        </>
    )
}

export default EmployeeTaskActivityCard