import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { projectSchema, type projectPayload } from '../../schemas/projectSchema'
import { projectDefaultValues } from '../../schemas/projectDefaultValues'
import { FormInput } from '@/components/form-input'
import { useToast } from '@/hooks/useToast'
import { useCreateProject } from '../../apis/mutation'
import { useGetClient } from '@/modules/client/apis/queries'
import Loader from '@/components/loader'
import type { clientType } from '@/types/client'

interface createProjectFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateProjectForm: React.FC<createProjectFormProps> = ({ setOpen }) => {

    const toast = useToast()

    const { data, isLoading, isError } = useGetClient()

    const clients = data?.data ?? []

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<projectPayload>({
        resolver: zodResolver(projectSchema),
        defaultValues: projectDefaultValues
    })

    const { mutate: createProject, isPending: isCreatingProject } = useCreateProject()

    const onSubmit = (formData: projectPayload) => {
        createProject(formData, {
            onSuccess: () => {
                toast.success('Project Create Successfully')
                setOpen(false)
            }
        })
    }

    return (
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
                        <Label>Payment Term</Label>
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
                                    ) : clients.length ? (
                                        clients.map((c: clientType) => (
                                            <SelectItem
                                                key={c.clientId}
                                                value={c.clientId as string}
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
                <Button type="submit" disabled={isCreatingProject}>
                    {isCreatingProject ? "Creating Project..." : "Create Project"}
                </Button>
            </DialogFooter>
        </form>
    )
}

export default CreateProjectForm