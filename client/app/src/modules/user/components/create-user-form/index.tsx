import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { userRoles, userSchema, type userPayload } from '../../schemas/userSchemas'
import { userDefaultValues } from '../../schemas/userDefaultValues'
import { FormInput } from '@/components/form-input'
import InputComponent from '@/components/input-component'
import Icon from '@/components/icon'
import { useCreateEmployee } from '@/modules/auth/apis/mutation'
import { useToast } from '@/hooks/useToast'


interface createUserFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateUserForm: React.FC<createUserFormProps> = ({ setOpen }) => {

    const toast = useToast()

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: userDefaultValues
    })

    const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee();

    const onSubmit = (formData: userPayload) => {
        createEmployee(formData, {
            onSuccess: () => {
                toast.success("User Created Successfully")
                setOpen(false)
            },
            onError: () => {
                setOpen(true)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-1.5">
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

                {/* Email */}
                <div className="space-y-1.5">
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

                <div className='space-y-1.5'>
                    <div className='flex gap-1'>
                        <Label>Password</Label>
                        <span className="text-red-500">*</span>
                    </div>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputComponent
                                {...field}
                                type='password'
                                togglePassword={true}
                                placeholder="Enter your Password"
                                rightIcon={<Icon name='openEye' width={18} height={18} />}
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                </div>

                <div className="space-y-1.5">
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

            </div>

            <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button type="submit">{isCreating ? "Creating..." : " Create User"}</Button>
            </DialogFooter>
        </form>
    )
}

export default CreateUserForm