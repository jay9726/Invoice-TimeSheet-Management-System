import React from 'react'
import InputComponent from '@/components/input-component'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '@/components/icon'
import { resetPasswordSchema, type resetPasswordPayload } from '../../schemas/authSchema'
import { resetPasswordDefaultValues } from '../../schemas/authDefaultValues'
import { useResetPassword } from '../../apis/mutation'
import { useToast } from '@/hooks/useToast'

const ResetPasswordForm: React.FC = () => {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const toast = useToast()


    const email = useMemo(() => searchParams.get("email") || "", [searchParams])
    const token = useMemo(() => searchParams.get("token") || "", [searchParams])


    const { handleSubmit, control } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: resetPasswordDefaultValues,
    })

    useEffect(() => {
        if (!email || !token) {
            // navigate("/", { replace: true })
        }
    }, [email, token])

    const { mutate: resetPassword, isPending: isPending } = useResetPassword();

    const onSubmit = async (formData: resetPasswordPayload) => {
        resetPassword({ email, token, newPassword: formData.newPassword }, {
            onSuccess: () => {
                navigate("/", { replace: true })
                toast.success("Password Reset Successfully")
            },
            onError: (err) => {
                toast.error(err.message)
            }
        })
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
                    <Label>New Password</Label>
                <Controller
                    control={control}
                    name="newPassword"
                    render={({ field, fieldState }) => (
                        <InputComponent
                            {...field}
                            type='password'
                            togglePassword={true}
                            placeholder="Enter New Password"
                            leftIcon={<Icon name='password' width={18} height={18} />}
                            rightIcon={<Icon name='openEye' width={18} height={18} />}
                            error={fieldState.error?.message}
                        />
                    )}
                />
            </div>

            <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                        <InputComponent
                            {...field}
                            type='password'
                            togglePassword={true}
                            placeholder="Enter Confirm Password"
                            leftIcon={<Icon name='password' width={18} height={18} />}
                            rightIcon={<Icon name='openEye' width={18} height={18} />}
                            error={fieldState.error?.message}
                            disable={isPending}
                        />
                    )}
                />
            </div>

            <Button type="submit" className="w-full rounded-xl"
            >
                {isPending ? "Resetting Password..." : "Reset Password"}
            </Button>
        </form>
    )
}

export default ResetPasswordForm