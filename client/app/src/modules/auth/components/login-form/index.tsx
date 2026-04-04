import Icon from '@/components/icon'
import InputComponent from '@/components/input-component'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { loginUser } from '@/redux/slices/authSlice'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type loginPayload } from '../../schemas/authSchema'
import { loginDefaultValues } from '../../schemas/authDefaultValues'
import { useAppDispatch } from '@/lib/hooks'
import { useUserLogin } from '../../apis/mutation'
import { useToast } from '@/hooks/useToast'
import type { LoginResponse } from '../../apis/types'
import { compressToEncodedURIComponent } from 'lz-string'

const LoginForm: React.FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const toast = useToast();

    const { handleSubmit, control } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: loginDefaultValues
    })

    const { mutate: userLogin, isPending: isPending } = useUserLogin()

    const onSubmit = (formData: loginPayload) => {
        userLogin(formData, {
            onSuccess: (res) => {
                const encrptId = compressToEncodedURIComponent(res?.data?.id)
                const payload: LoginResponse = {
                    token: res?.data?.token,
                    id: encrptId,
                    role: res?.data?.role
                }
                dispatch(loginUser(payload))
                toast.success("Login successfully");

                switch (res?.data?.role) {
                    case 'Admin':
                        return navigate('/admin/dashboard', { replace: true })
                    case 'AccountUser':
                        return navigate('/accountuser/dashboard', { replace: true })
                    case 'Manager':
                        return navigate('/manager/dashboard', { replace: true })
                    default:
                        return navigate('/employee/dashboard', { replace: true })
                }
            },
            onError: (err: any) => {
                if (err?.response?.status) {
                    toast.error(err?.response?.data?.message);
                }
            },
        })
    }


    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <InputComponent
                            {...field}
                            placeholder="Enter your Email"
                            leftIcon={<Icon name='mail' width={18} height={18} />}
                            error={fieldState.error?.message}
                        />
                    </div>
                )}
            />

            <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="font-semibold text-gray-700">Password</Label>
                            <NavLink to="/forget-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                Forgot password?
                            </NavLink>
                        </div>
                        <InputComponent
                            {...field}
                            type='password'
                            togglePassword={true}
                            placeholder="••••••••"
                            leftIcon={<Icon name='password' width={18} height={18} />}
                            rightIcon={<Icon name='openEye' width={18} height={18} />}
                            error={fieldState.error?.message}
                        />
                    </div>
                )}
            />

            <Button className="w-full hover:bg-primary/90 hover:text-white cursor-pointer" type="submit" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    )
}

export default LoginForm