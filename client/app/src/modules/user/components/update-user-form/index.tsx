import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { updateUserSchema, userRoles, type updateUserPayload } from '../../schemas/userSchemas'
import { updateUserDefaultValues } from '../../schemas/userDefaultValues'
import { FormInput } from '@/components/form-input'
import { useGetEmployeeById } from '../../apis/queries'
import { useUpdateEmployee } from '../../apis/mutation'
import { useToast } from '@/hooks/useToast'
import Loader from '@/components/loader'

interface updateUserFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    employeeId: string
}

const UpdateUserForm: React.FC<updateUserFormProps> = ({ setOpen, employeeId }) => {

    const toast = useToast();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(updateUserSchema),
        defaultValues: updateUserDefaultValues
    })

    const { data, isPending } = useGetEmployeeById(employeeId);

    useEffect(() => {
        if (data) {
            reset({
                email: data?.data.email,
                fullName: data?.data.fullName,  
            })
        }
    }, [data, reset])

    const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee();

    const onSubmit = (formData: updateUserPayload) => {
        updateEmployee({ employeeId: employeeId, payload: formData }, {
            onSuccess: () => {
                toast.success("User updated successfully")
                setOpen(false)
            }
        })
    }

    if (isPending) return <Loader />

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-1.5 md:col-span-1">
                    <div className='flex gap-1'>
                        <Label>Name</Label>
                        <span className="text-red-500">*</span>
                    </div>
                    <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                {...field}
                                placeholder="Full Name"
                            />
                        )}
                    />
                    {<p className="text-sm text-red-600">{errors.fullName?.message}</p>}
                </div>



                {/* Role (shadcn Select via Controller) */}
                <div className="space-y-1.5 md:col-span-1">
                    <div className='flex gap-1'>
                        <Label>Role</Label>
                        <span className="text-red-500">*</span>
                    </div>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className="min-w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="" disabled>
                                    Select Role
                                </option>

                                {userRoles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                    {<p className="text-sm text-red-600">{errors.role?.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5 md:col-span-2">
                    <div className='flex gap-1'>
                        <Label>Email</Label>
                        <span className="text-red-500">*</span>
                    </div>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                {...field}
                                placeholder="Email"
                            />
                        )}
                    />
                    {<p className="text-sm text-red-600">{errors.email?.message}</p>}
                </div>

            </div>

            <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button type="submit"> {isUpdating ? 'Updating...' : 'Update User'}</Button>
            </DialogFooter>
        </form>
    )
}

export default UpdateUserForm