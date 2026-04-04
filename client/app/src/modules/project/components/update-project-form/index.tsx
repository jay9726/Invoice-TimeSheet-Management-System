import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { projectSchema, type projectPayload } from '../../schemas/projectSchema'
import { projectDefaultValues } from '../../schemas/projectDefaultValues'
import { FormInput } from '@/components/form-input'
import { useToast } from '@/hooks/useToast'
import { useGetProjectById } from '../../apis/queries'
import { useUpdateProject } from '../../apis/mutation'
import Loader from '@/components/loader'
import { useGetClient } from '@/modules/client/apis/queries'
import type { clientType } from '@/types/client'



interface updateProjectFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    projectId: string
}


const UpdateProjectForm: React.FC<updateProjectFormProps> = ({ setOpen, projectId }) => {

    const toast = useToast();

    const { data: clients, isLoading, isError } = useGetClient()

    const clientlist = clients?.data ?? []

    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: projectDefaultValues
    })

    const { data, isPending } = useGetProjectById(projectId)

    useEffect(() => {
        if (data?.data) {
            reset({
                projectName: data.data.projectName,
                paymentTerms: data.data.paymentTerms,
                clientId: data.data.clientId,
                hourlyRate: String(data.data.hourlyRate),
                isActive: data.data.isActive
            })
        }
    }, [data?.data, reset])

    const { mutate: updateProject, isPending: isUpdatePending } = useUpdateProject();

    const onSubmit = (formData: projectPayload) => {
        updateProject({ projectId: projectId, payload: formData }, {
            onSuccess: () => {
                toast.success("project Update Successfully")
                setOpen(false)
            }
        })
    }



    return (

        <>
            {isPending || isUpdatePending && <Loader />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Project Name */}
                    <div className="space-y-1.5 md:col-span-1">
                        <div className='flex gap-1'>
                            <Label>Project Name</Label>
                            <span className="text-red-500">*</span>
                        </div>
                        <Controller
                            control={control}
                            name="projectName"
                            render={({ field }) => <FormInput {...field} placeholder="Project Name" />}
                        />
                        <p className="text-sm text-red-600">{errors.projectName?.message}</p>
                    </div>

                    {/* Payment Term */}
                    <div className="space-y-1.5 md:col-span-1">
                        <div className='flex gap-1'>
                            <Label>Payment Terms</Label>
                            <span className="text-red-500">*</span>
                        </div>
                        <Controller
                            control={control}
                            name="paymentTerms"
                            render={({ field }) => <FormInput {...field} placeholder="Payment Terms" />}
                        />
                        <p className="text-sm text-red-600">{errors.paymentTerms?.message}</p>
                    </div>

                    {/* Client Dropdown (with loader) */}
                    <div className="space-y-1.5">
                        <div className='flex gap-1'>
                            <Label>Client</Label>
                            <span className="text-red-500">*</span>
                        </div>
                        <Controller
                            control={control}
                            name="clientId"
                            render={({ field }) => (
                                <Select
                                    value={field.value ? String(field.value) : ""}
                                    onValueChange={field.onChange}
                                    disabled={isLoading || isError}
                                >
                                    <SelectTrigger id="clientId" className="w-full">
                                        <SelectValue placeholder={isLoading ? "Loading clients..." : "Select client"} />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {isLoading ? (
                                            <div className="p-3">
                                                <Loader />
                                            </div>
                                        ) : isError ? (
                                            <div className="p-3 text-sm text-red-500">Failed to load clients</div>
                                        ) : clientlist.length ? (
                                            clientlist.map((c: clientType) => (
                                                <SelectItem
                                                    key={c.clientId ?? c.clientId}
                                                    value={String(c.clientId ?? c.clientId)}
                                                >
                                                    {c.clientName}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-3 text-sm text-slate-500">No clients found</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        <p className="text-sm text-red-600">{errors.clientId?.message}</p>
                    </div>

                    {/* Hourly Rate */}
                    <div className="space-y-1.5">
                        <div className='flex gap-1'>
                            <Label>Hourly Rate</Label>
                            <span className="text-red-500">*</span>
                        </div>
                        <Controller
                            control={control}
                            name="hourlyRate"
                            render={({ field }) => (
                                <FormInput {...field} inputMode="decimal" placeholder="Rate/hour" />
                            )}
                        />
                        <p className="text-sm text-red-600">{errors.hourlyRate?.message}</p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                    <Button type="submit" disabled={isUpdatePending}>
                        {isUpdatePending ? "Updating Project..." : "Update Project"}
                    </Button>
                </DialogFooter>
            </form>
        </>
    )
}

export default UpdateProjectForm