import React from 'react'
import { useNavigate, NavLink } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputComponent from '@/components/input-component';
import Icon from '@/components/icon';
import { useToast } from '@/hooks/useToast';
import { forgotPasswordSchema, type forgotPasswordPayload } from '../../schemas/authSchema';
import { forgotPasswordDefaultValues } from '../../schemas/authDefaultValues';
import { useForgotPassword } from '../../apis/mutation';

const ForgetPasswordForm: React.FC = () => {

    const navigate = useNavigate();
    const toast = useToast();

    const { handleSubmit, control } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: forgotPasswordDefaultValues
    })

    const { mutate: forgotPassword, isPending: isPending } = useForgotPassword();

    const onSubmit = async (formData: forgotPasswordPayload) => {
        forgotPassword(formData, {
            onSuccess: () => {
                navigate("/", { replace: true })
                toast.success("Email sent successfully")
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message ?? "Something went wrong")
            }
        })
    }


    return (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-700">Email Address</Label>
                        <InputComponent
                            {...field}
                            placeholder="name@company.com"
                            leftIcon={<Icon name='mail' width={18} height={18} />}
                            error={fieldState.error?.message}
                            disable={isPending}
                        />
                    </div>
                )}
            />

            <div className="pt-2">
                <Button className="w-full h-11 text-base font-medium shadow-sm transition-all hover:shadow-md cursor-pointer" type="submit" disabled={isPending}>
                    {isPending ? "Sending Email..." : "Send Reset Link"}
                </Button>
            </div>

            <div className="text-center text-sm font-medium text-gray-600 mt-6">
                Remember your password?{" "}
                <NavLink to="/" className="text-primary hover:text-primary/80 transition-colors">
                    Log in
                </NavLink>
            </div>
        </form>
    )
}

export default ForgetPasswordForm