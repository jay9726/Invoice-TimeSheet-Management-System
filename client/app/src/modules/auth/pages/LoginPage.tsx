import React from 'react'
import LoginForm from '../components/login-form';
import LoginAnimationComponent from '../components/login-animation-component';


const LoginPage: React.FC = () => {
    return (
        <div className="flex-1 flex w-full">
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-28">
                <div className="mx-auto w-full max-w-sm lg:max-w-md space-y-8">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4 font-medium">
                            Welcome Back
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                            Log in to your account
                        </h1>
                        <p className="text-base text-muted-foreground">
                            Enter your credentials below to access your professional dashboard.
                        </p>
                    </div>

                    <LoginForm />
                </div>
            </div>

            <LoginAnimationComponent />
            
        </div>
    )
}

export default LoginPage