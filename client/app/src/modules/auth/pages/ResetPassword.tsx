import ResetPasswordAnimationComponent from '../components/reset-password-animation-component';
import ResetPasswordForm from '../components/reset-password-form'

const ResetPasswordPage: React.FC = () => {
    return (
        <div className="flex-1 flex w-full">
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-28">
                <div className="mx-auto w-full max-w-sm lg:max-w-md space-y-8">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4 font-medium">
                            Secure Update
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
                            Reset your password
                        </h1>
                        <p className="text-base text-muted">
                            Please create a strong, new password that you don't use on other websites.
                        </p>
                    </div>

                    <ResetPasswordForm />

                </div>
            </div>

            <ResetPasswordAnimationComponent />

        </div>
    )
}

export default ResetPasswordPage;