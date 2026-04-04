// import React, { useEffect, useState } from "react"
// import { Controller, useForm, useWatch } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { taskActivitySchema, type taskActivityPayload } from "../../schemas/taskActivitySchema"
// import { taskActivityDefaultValues } from "../../schemas/taskActivityDefaultValues"
// import { FormInput } from "@/components/form-input"
// import { useGetClient } from "@/modules/client/apis/queries"
// import { useGetProject } from "@/modules/project/apis/queries"
// import Loader from "@/components/loader"
// import { useCreateTimeEntry } from "../../apis/mutation"
// import { useToast } from "@/hooks/useToast"
// import { SessionAuthentication } from "@/modules/auth/guards/SessisonAuthentication"
// import type { clientType } from "@/types/client"
// import { decompressFromEncodedURIComponent } from "lz-string"

// const CreateTaskActivityForm: React.FC = () => {

//   const toast = useToast();
//   const { data: clients, isPending: isClientPending } = useGetClient()
//   const { data: projects, isPending: isProjectPending } = useGetProject()

//   const [durationDisplay, setDurationDisplay] = useState<string>("")


//   const { handleSubmit, control, reset, setValue, formState: { errors, isSubmitting } } = useForm<taskActivityPayload>({
//     resolver: zodResolver(taskActivitySchema),
//     defaultValues: taskActivityDefaultValues,
//   })

//   const { mutate: createTaskActivity, isPending: isCreatingTaskActivity } = useCreateTimeEntry()


//   const startTime = useWatch({ control, name: "startTime" })
//   const endTime = useWatch({ control, name: "endTime" })

//   useEffect(() => {
//     if (!startTime || !endTime) {
//       setDurationDisplay("")
//       setValue("hoursWorked", 0)
//       return
//     }

//     const [sh, sm] = startTime.split(":").map(Number)
//     const [eh, em] = endTime.split(":").map(Number)

//     let startMinutes = sh * 60 + sm
//     let endMinutes = eh * 60 + em

//     if (endMinutes <= startMinutes) {
//       endMinutes += 24 * 60
//     }
//     const diffMinutes = endMinutes - startMinutes
//     const displayHours = Math.floor(diffMinutes / 60)
//     const displayMins = diffMinutes % 60

//     setDurationDisplay(
//       `${String(displayHours).padStart(2, "0")}:${String(displayMins).padStart(2, "0")}`
//     )

//     const hours = Math.floor(diffMinutes / 60)
//     const mins = diffMinutes % 60
//     const formatted = parseFloat(`${hours}.${String(mins).padStart(2, "0")}`)
//     setValue("hoursWorked", formatted, { shouldValidate: true })

//   }, [startTime, endTime, setValue])





//   const onSubmit = async (data: taskActivityPayload) => {
//     const session = SessionAuthentication.getSession();
//     const decrpyEmployeeId = decompressFromEncodedURIComponent(session?.id as string);

//     const payload = {
//       ...data,
//       startTime: data.startTime ? `${data.startTime}:00` : "",
//       endTime: data.endTime ? `${data.endTime}:00` : "",
//     }

//     createTaskActivity({ employeeId: decrpyEmployeeId, payload: payload }, {
//       onSuccess: () => {
//         toast.success("Task Activity Created Successfully")
//         reset()
//         setDurationDisplay("")
//       },
//       onError: () => {
//         toast.error("Timesheet Is Submitted OR Approved So You Can't Create Task Activity")
//         reset()
//         setDurationDisplay("")

//       }
//     })
//   }


//   if (isClientPending || isProjectPending || isCreatingTaskActivity || isSubmitting) {
//     return <Loader />
//   }

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="grid grid-cols-1 gap-6 md:grid-cols-2"
//     >
//       {/* Work Date */}
//       <div className="space-y-1">
//         <div className="flex gap-1">
//           <Label>Work Date</Label>
//           <span className="text-red-500">*</span>
//         </div>
//         <Controller
//           name="workDate"
//           control={control}
//           render={({ field }) => (
//             <FormInput {...field} type="date" disabled={isSubmitting} />
//           )}
//         />
//         <p className="text-sm text-red-500">{errors.workDate?.message}</p>
//       </div>

//       {/* Activity */}
//       <div className="space-y-1">
//         <div className="flex gap-1">
//           <Label>Activity</Label>
//           <span className="text-red-500">*</span>
//         </div>
//         <Controller
//           name="taskActivityName"
//           control={control}
//           render={({ field }) => (
//             <FormInput {...field} placeholder="Task Activity" />
//           )}
//         />
//         <p className="text-sm text-red-500">
//           {errors.taskActivityName?.message}
//         </p>
//       </div>

//       {/* Notes */}
//       <div className="space-y-1 md:col-span-2">
//         <div className="flex gap-1">
//           <Label>Notes</Label>
//           <span className="text-red-500">*</span>
//         </div>
//         <Controller
//           name="notes"
//           control={control}
//           render={({ field }) => (
//             <Textarea
//               {...field}
//               className="resize-none"
//               placeholder="Describe the work done..."
//             />
//           )}
//         />
//         <p className="text-sm text-red-500">{errors.notes?.message}</p>
//       </div>

//       {/* Project */}
//       <div className="space-y-1">
//         <div className="flex gap-1">
//           <Label>Project</Label>
//           <span className="text-red-500">*</span>
//         </div>
//         <Controller
//           name="projectId"
//           control={control}
//           render={({ field }) => (
//             <Select
//               value={field.value || ""}
//               onValueChange={field.onChange}
//             >
//               <SelectTrigger className="min-w-full">
//                 <SelectValue placeholder="Select project" />
//               </SelectTrigger>
//               <SelectContent>
//                 {projects?.data?.map((project: any) => (
//                   <SelectItem
//                     key={project.projectId}
//                     value={project.projectId}
//                   >
//                     {project.projectName}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         />
//         <p className="text-sm text-red-500">
//           {errors.projectId?.message}
//         </p>
//       </div>

//       {/* Client */}
//       <div className="space-y-1">
//         <div className="flex gap-1">
//           <Label>Client</Label>
//           <span className="text-red-500">*</span>
//         </div>
//         <Controller
//           name="clientId"
//           control={control}
//           render={({ field }) => (
//             <Select
//               value={field.value || ""}
//               onValueChange={field.onChange}
//             >
//               <SelectTrigger className="min-w-full">
//                 <SelectValue placeholder="Select client" />
//               </SelectTrigger>

//               <SelectContent>
//                 {clients?.data?.map((client: clientType) => (
//                   <SelectItem
//                     key={client.clientId}
//                     value={client.clientId as string}
//                   >
//                     {client.clientName}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         />
//         <p className="text-sm text-red-500">
//           {errors.clientId?.message}
//         </p>
//       </div>

//       {/* Times */}
//       <div className="md:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-3">
//         <div className="space-y-1">
//           <div className="flex gap-1">
//             <Label>Start Time</Label>
//             <span className="text-red-500">*</span>
//           </div>
//           <Controller
//             name="startTime"
//             control={control}
//             render={({ field }) => (
//               <FormInput {...field} type="time" />
//             )}
//           />
//           {<p className="text-sm text-red-500">{errors.startTime?.message}</p>}
//         </div>

//         <div className="space-y-1">
//           <div className="flex gap-1">
//             <Label>End Time</Label>
//             <span className="text-red-500">*</span>
//           </div>
//           <Controller
//             name="endTime"
//             control={control}
//             render={({ field }) => (
//               <FormInput {...field} type="time" />
//             )}
//           />
//           {<p className="text-sm text-red-500">{errors.endTime?.message}</p>}
//         </div>

//         <div className="space-y-1">
//           <div className="flex gap-1">
//             <Label>Duration</Label>
//             <span className="text-red-500">*</span>
//           </div>
//           <FormInput
//             value={durationDisplay}
//             placeholder="00:00"
//             readOnly
//             className="bg-muted cursor-not-allowed"
//             onChange={() => { }}
//           />
//           {<p className="text-sm text-red-500">{errors.hoursWorked?.message}</p>}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="md:col-span-2 flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <Controller
//             name="isBillable"
//             control={control}
//             render={({ field }) => (
//               <Switch
//                 checked={!!field.value}
//                 onCheckedChange={field.onChange}
//               />
//             )}
//           />
//           <Label>Billable</Label>
//         </div>

//         <Button type="submit" disabled={isSubmitting}>
//           Save Work Log
//         </Button>
//       </div>
//     </form>
//   )
// }

// export default CreateTaskActivityForm










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
import { useToast } from "@/hooks/useToast"
import type { clientType } from "@/types/client"
import { useAppDispatch } from "@/lib/hooks"
import { addLog } from "@/redux/slices/taskActivitySlice"

interface createTaskActivityFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateTaskActivityForm: React.FC<createTaskActivityFormProps> = ({ setOpen }) => {

  const toast = useToast();
  const dispatch = useAppDispatch();
  const { data: clients, isPending: isClientPending } = useGetClient()
  const { data: projects, isPending: isProjectPending } = useGetProject()

  const [durationDisplay, setDurationDisplay] = useState<string>("")


  const { handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<taskActivityPayload>({
    resolver: zodResolver(taskActivitySchema),
    defaultValues: taskActivityDefaultValues,
  })


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





  const onSubmit = async (data: taskActivityPayload) => {

    const clientName = clients?.data.filter((v: any) => { return v.clientId === data.clientId })
    const projectName = projects?.data.filter((v: any) => { return v.projectId === data.projectId })

    const payload = {
      ...data,
      startTime: data.startTime ? `${data.startTime}:00` : "",
      endTime: data.endTime ? `${data.endTime}:00` : "",
      clientName: clientName[0].clientName,
      projectName: projectName[0].projectName
    }

    dispatch(addLog(payload))
    toast.success("Task Activity Add To The List")
    setOpen(false)
  }


  if (isClientPending || isProjectPending || isSubmitting) {
    return <Loader />
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      {/* Work Date */}
      <div className="space-y-1">
        <div className="flex gap-1">
          <Label>Work Date</Label>
          <span className="text-red-500">*</span>
        </div>
        <Controller
          name="workDate"
          control={control}
          render={({ field }) => (
            <FormInput {...field} type="date" disabled={isSubmitting} />
          )}
        />
        <p className="text-sm text-red-500">{errors.workDate?.message}</p>
      </div>

      {/* Activity */}
      <div className="space-y-1">
        <div className="flex gap-1">
          <Label>Activity</Label>
          <span className="text-red-500">*</span>
        </div>
        <Controller
          name="taskActivityName"
          control={control}
          render={({ field }) => (
            <FormInput {...field} placeholder="Task Activity" />
          )}
        />
        <p className="text-sm text-red-500">
          {errors.taskActivityName?.message}
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-1 md:col-span-2">
        <div className="flex gap-1">
          <Label>Notes</Label>
          <span className="text-red-500">*</span>
        </div>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              className="resize-none"
              placeholder="Describe the work done..."
            />
          )}
        />
        <p className="text-sm text-red-500">{errors.notes?.message}</p>
      </div>

      {/* Project */}
      <div className="space-y-1">
        <div className="flex gap-1">
          <Label>Project</Label>
          <span className="text-red-500">*</span>
        </div>
        <Controller
          name="projectId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="min-w-full">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects?.data?.map((project: any) => (
                  <SelectItem
                    key={project.projectId}
                    value={project.projectId}
                  >
                    {project.projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <p className="text-sm text-red-500">
          {errors.projectId?.message}
        </p>
      </div>

      {/* Client */}
      <div className="space-y-1">
        <div className="flex gap-1">
          <Label>Client</Label>
          <span className="text-red-500">*</span>
        </div>
        <Controller
          name="clientId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="min-w-full">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>

              <SelectContent>
                {clients?.data?.map((client: clientType) => (
                  <SelectItem
                    key={client.clientId}
                    value={client.clientId as string}
                  >
                    {client.clientName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <p className="text-sm text-red-500">
          {errors.clientId?.message}
        </p>
      </div>

      {/* Times */}
      <div className="md:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <div className="flex gap-1">
            <Label>Start Time</Label>
            <span className="text-red-500">*</span>
          </div>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <FormInput {...field} type="time" />
            )}
          />
          {<p className="text-sm text-red-500">{errors.startTime?.message}</p>}
        </div>

        <div className="space-y-1">
          <div className="flex gap-1">
            <Label>End Time</Label>
            <span className="text-red-500">*</span>
          </div>
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <FormInput {...field} type="time" />
            )}
          />
          {<p className="text-sm text-red-500">{errors.endTime?.message}</p>}
        </div>

        <div className="space-y-1">
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
          {<p className="text-sm text-red-500">{errors.hoursWorked?.message}</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="md:col-span-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Controller
            name="isBillable"
            control={control}
            render={({ field }) => (
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label>Billable</Label>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant='outline' onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Save Work Log
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CreateTaskActivityForm
