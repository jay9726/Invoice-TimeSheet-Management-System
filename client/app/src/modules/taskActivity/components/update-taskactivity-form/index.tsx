import React, { useEffect, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { taskActivitySchema, type taskActivityPayload } from "../../schemas/taskActivitySchema"
import { taskActivityDefaultValues } from "../../schemas/taskActivityDefaultValues"
import { FormInput } from "@/components/form-input"
import { useGetClient } from "@/modules/client/apis/queries"
import { useGetProject } from "@/modules/project/apis/queries"
import Loader from "@/components/loader"
import { useGetTimeEntryByTaskId } from "../../apis/queries"
import { useUpdateTimeActivity } from "../../apis/mutation"
import { useToast } from "@/hooks/useToast"
import type { clientType } from "@/types/client"
import type { projectType } from "@/types/project"

interface updateTaskActivityProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    taskActivityId: string
}

const toDateInputValue = (iso?: string) => {
    if (!iso) return ""
    return iso.split("T")[0]
}

const UpdateTaskActivityForm: React.FC<updateTaskActivityProps> = ({ setOpen, taskActivityId }) => {

    const toast = useToast()

    const { data: clients, isPending: isClientPending } = useGetClient()
    const { data: projects, isPending: isProjectPending } = useGetProject()
    const { data: getTimeentry, isPending: isTimeEntryPending } = useGetTimeEntryByTaskId(taskActivityId)

    const [durationDisplay, setDurationDisplay] = useState<string>("")

    const {
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<taskActivityPayload>({
        resolver: zodResolver(taskActivitySchema),
        defaultValues: taskActivityDefaultValues,
    })

    const currentProjectId = watch("projectId")
    const currentClientId = watch("clientId")

    const startTime = useWatch({ control, name: "startTime" })
    const endTime = useWatch({ control, name: "endTime" })

    useEffect(() => {
        if (!startTime || !endTime) {
            setDurationDisplay("")
            setValue("hoursWorked", 0)
            return
        }

        const [sh, sm] = startTime.split(":").map(Number)
        const [eh, em] = endTime.split(":").map(Number)

        let startMinutes = sh * 60 + sm
        let endMinutes = eh * 60 + em

        if (endMinutes <= startMinutes) {
            endMinutes += 24 * 60
        }

        const diffMinutes = endMinutes - startMinutes
        const displayHours = Math.floor(diffMinutes / 60)
        const displayMins = diffMinutes % 60

        setDurationDisplay(
            `${String(displayHours).padStart(2, "0")}:${String(displayMins).padStart(2, "0")}`
        )

        const hours = Math.floor(diffMinutes / 60)
        const mins = diffMinutes % 60
        const formatted = parseFloat(`${hours}.${String(mins).padStart(2, "0")}`)
        setValue("hoursWorked", formatted, { shouldValidate: true })

    }, [startTime, endTime, setValue])

    useEffect(() => {
        const entry = getTimeentry?.data
        const projectList = projects?.data ?? []
        const clientList = clients?.data ?? []

        if (!entry) return
        if (!projectList.length || !clientList.length) return

        const entryProjectIdStr = String(entry.projectId ?? "")
        const entryClientIdStr = String(entry.clientId ?? "")

        const matchedProject = projectList.find((p: projectType) => String(p.projectId) === entryProjectIdStr)
        const matchedClient = clientList.find((c: clientType) => String(c.clientId) === entryClientIdStr)

        const finalProjectId = matchedProject ? String(matchedProject.projectId) : String(projectList[0]?.projectId || "")
        const finalClientId = matchedClient ? String(matchedClient.clientId) : String(clientList[0]?.clientId || "")

        if (entry.startTime && entry.endTime) {
            const [sh, sm] = entry.startTime.split(":").map(Number)
            const [eh, em] = entry.endTime.split(":").map(Number)

            let startMinutes = sh * 60 + sm
            let endMinutes = eh * 60 + em

            if (endMinutes <= startMinutes) {
                endMinutes += 24 * 60
            }

            const diffMinutes = endMinutes - startMinutes
            const displayHours = Math.floor(diffMinutes / 60)
            const displayMins = diffMinutes % 60

            setDurationDisplay(
                `${String(displayHours).padStart(2, "0")}:${String(displayMins).padStart(2, "0")}`
            )
        }

        reset({
            workDate: toDateInputValue(entry.workDate),
            taskActivityName: entry.taskName,
            notes: entry.notes,
            projectId: finalProjectId,
            clientId: finalClientId,
            startTime: entry.startTime,
            endTime: entry.endTime,
            hoursWorked: entry.hoursWorked,
            isBillable: entry.isBillable,
        })

        setValue("projectId", finalProjectId, { shouldDirty: false })
        setValue("clientId", finalClientId, { shouldDirty: false })
    }, [getTimeentry?.data, projects?.data, clients?.data, reset, setValue])

    const { mutate: updateTimeEntry, isPending: isUpdateTimeEntryPending } = useUpdateTimeActivity()

    const onSubmit = (formData: taskActivityPayload) => {

        updateTimeEntry(
            { taskId: taskActivityId, payload : formData },
            {
                onSuccess: () => {
                    toast.success("TimeEntry updated successfully")
                    setOpen(false)
                },
                onError: () => {
                    toast.error("Timesheet Is Submitted OR Approved So You Can't Update Task Activity")
                },
            }
        )
    }

    if (isClientPending || isProjectPending || isSubmitting || isTimeEntryPending) {
        return <Loader />
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Work Date */}
            <div className="space-y-2">
                <div className="flex gap-1">
                    <Label>Work Date</Label>
                    <span className="text-red-500">*</span>
                </div>
                <Controller
                    name="workDate"
                    control={control}
                    render={({ field }) => <FormInput {...field} type="date" disabled={isSubmitting} />}
                />
                <p className="text-sm text-red-500">{errors.workDate?.message}</p>
            </div>

            {/* Activity */}
            <div className="space-y-2">
                <div className="flex gap-1">
                    <Label>Activity</Label>
                    <span className="text-red-500">*</span>
                </div>
                <Controller
                    name="taskActivityName"
                    control={control}
                    render={({ field }) => <FormInput {...field} placeholder="Task Activity" />}
                />
                <p className="text-sm text-red-500">{errors.taskActivityName?.message}</p>
            </div>

            {/* Notes */}
            <div className="space-y-2 md:col-span-2">
                <div className="flex gap-1">
                    <Label>Notes</Label>
                    <span className="text-red-500">*</span>
                </div>
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <Textarea {...field} className="resize-none" placeholder="Describe the work done..." />
                    )}
                />
                <p className="text-sm text-red-500">{errors.notes?.message}</p>
            </div>

            {/* Project */}
            <div className="space-y-2">
                <div className="flex gap-1">
                    <Label>Project</Label>
                    <span className="text-red-500">*</span>
                </div>
                <Controller
                    name="projectId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            key={`project-${currentProjectId ?? "x"}`}
                            value={field.value ? String(field.value) : ""}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger className="min-w-full">
                                <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects?.data?.map((project: projectType) => (
                                    <SelectItem key={project.projectId} value={project.projectId as string}>
                                        {project.projectName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">{errors.projectId?.message}</p>
            </div>

            {/* Client */}
            <div className="space-y-2">
                <div className="flex gap-1">
                    <Label>Client</Label>
                    <span className="text-red-500">*</span>
                </div>
                <Controller
                    name="clientId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            key={`client-${currentClientId ?? "x"}`}
                            value={field.value ? String(field.value) : ""}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger className="min-w-full">
                                <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients?.data?.map((client:clientType) => (
                                    <SelectItem key={client.clientId} value={client.clientId as string}>
                                        {client.clientName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">{errors.clientId?.message}</p>
            </div>

            {/* Start / End / Duration */}
            <div className="md:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                    <div className="flex gap-1">
                        <Label>Start Time</Label>
                        <span className="text-red-500">*</span>
                    </div>
                    <Controller
                        name="startTime"
                        control={control}
                        render={({ field }) => <FormInput {...field} type="time" disabled={isSubmitting} />}
                    />
                    <p className="text-sm text-red-500">{errors.startTime?.message}</p>
                </div>

                <div className="space-y-2">
                    <div className="flex gap-1">
                        <Label>End Time</Label>
                        <span className="text-red-500">*</span>
                    </div>
                    <Controller
                        name="endTime"
                        control={control}
                        render={({ field }) => <FormInput {...field} type="time" disabled={isSubmitting} />}
                    />
                    <p className="text-sm text-red-500">{errors.endTime?.message}</p>
                </div>

                <div className="space-y-2">
                    <div className="flex gap-1">
                        <Label>Duration</Label>
                        <span className="text-red-500">*</span>
                    </div>
                    <FormInput
                        value={durationDisplay}
                        placeholder="00:00"
                        readOnly
                        className="bg-muted cursor-not-allowed"
                        onChange={() => { }}
                    />
                    <p className="text-sm text-red-500">{errors.hoursWorked?.message}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="md:col-span-2 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Controller
                        name="isBillable"
                        control={control}
                        render={({ field }) => (
                            <Switch checked={!!field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                        )}
                    />
                    <Label className="text-sm font-medium">Billable</Label>
                </div>

                <div className="flex gap-3 items-center">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        disabled={isSubmitting}
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                        {isUpdateTimeEntryPending ? "Updating..." : "Update Time Log"}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default UpdateTaskActivityForm