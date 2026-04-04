import React from 'react'

const ResetPasswordAnimationComponent: React.FC = () => {
    return (
        <div className="hidden lg:flex w-1/2 relative bg-primary/5 items-center justify-center overflow-hidden">
            {/* Background Decor lines */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-0 w-px bg-linear-to-b from-transparent via-primary/20 to-transparent"></div>

                {/* Subtle grid pattern for ResetPassword */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03] text-primary" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid-pattern-rp" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern-rp)" />
                </svg>
            </div>

            {/* Main Illustration: Strong Password/Key */}
            <div className="relative z-10 w-full max-w-2xl p-4 lg:p-12 perspective-1000">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className="w-full h-auto drop-shadow-2xl" fill="none">
                    <defs>
                        {/* Gradients for UI Depth */}
                        <linearGradient id="bg-grad-rp" x1="0" y1="0" x2="800" y2="600" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
                        </linearGradient>
                        <linearGradient id="card-grad-rp" x1="0" y1="0" x2="0" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                            <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.95" />
                        </linearGradient>
                        <linearGradient id="primary-grad-rp" x1="0" y1="0" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
                        </linearGradient>

                        {/* Filters */}
                        <filter id="shadow-rp" x="-10%" y="-10%" width="130%" height="130%">
                            <feDropShadow dx="0" dy="12" stdDeviation="12" floodOpacity="0.1" />
                        </filter>
                        <filter id="glow-rp" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Background Glowing Rings & Atmosphere */}
                    <circle cx="400" cy="300" r="180" fill="url(#primary-grad-rp)" className="text-primary opacity-5 animate-[pulse_6s_ease-in-out_infinite]" />
                    <circle cx="400" cy="300" r="240" stroke="currentColor" strokeWidth="2" strokeDasharray="12 24" className="text-primary opacity-20 animate-[spin_50s_linear_infinite]" />

                    {/* --- The Safe Box / Secure Server Container --- */}
                    {/* Floating gently to represent secure cloud storage */}
                    <g filter="url(#shadow-rp)" className="animate-[float_5s_ease-in-out_infinite]">
                        <rect x="220" y="120" width="360" height="360" rx="32" fill="url(#bg-grad-rp)" stroke="currentColor" strokeWidth="1" className="opacity-80 text-primary" />
                        <rect x="220" y="120" width="360" height="360" rx="32" fill="url(#card-grad-rp)" className="opacity-80" />

                        {/* Safe Details / Server Lights */}
                        <rect x="250" y="150" width="300" height="300" rx="20" stroke="url(#primary-grad-rp)" strokeWidth="4" fill="none" className="text-primary opacity-30" />
                        <circle cx="280" cy="180" r="8" fill="#ef4444" className="opacity-80" />
                        <circle cx="310" cy="180" r="8" fill="#f59e0b" className="opacity-80" />
                        <circle cx="340" cy="180" r="8" fill="#10b981" filter="url(#glow-rp)" className="animate-pulse" />

                        <line x1="280" y1="210" x2="520" y2="210" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-primary opacity-20" />

                        {/* Inner Safe Dial/Lock Mechanism Placeholder */}
                        <circle cx="400" cy="320" r="80" fill="url(#bg-grad-rp)" className="text-primary opacity-50" />
                        <circle cx="400" cy="320" r="60" stroke="currentColor" strokeWidth="4" strokeDasharray="10 10" className="text-primary opacity-20 animate-[spin_20s_linear_infinite]" />
                    </g>

                    {/* --- The Key (Authorization) --- */}
                    {/* Translating in independently to imply 'unlocking/resetting' */}
                    <g className="animate-[float_4s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} transform="translate(40, -20) rotate(15 400 300)">
                        <ellipse cx="330" cy="320" rx="35" ry="35" fill="white" filter="url(#shadow-rp)" />
                        <ellipse cx="330" cy="320" rx="35" ry="35" stroke="url(#primary-grad-rp)" strokeWidth="12" fill="none" className="text-primary" />

                        <path d="M 365 320 L 490 320" stroke="url(#primary-grad-rp)" strokeWidth="14" strokeLinecap="round" className="text-primary" filter="url(#shadow-rp)" />
                        <rect x="440" y="320" width="14" height="36" rx="4" fill="url(#primary-grad-rp)" className="text-primary" />
                        <rect x="470" y="320" width="14" height="24" rx="4" fill="url(#primary-grad-rp)" className="text-primary" />

                        {/* Key Glow / Magic */}
                        <circle cx="490" cy="320" r="10" fill="url(#primary-grad-rp)" filter="url(#glow-rp)" className="text-primary opacity-80 animate-pulse" />
                    </g>

                    {/* --- Success Checkmark Badge --- */}
                    <g className="animate-[bounce_4s_ease-in-out_infinite]" style={{ animationDelay: '0.8s' }}>
                        <circle cx="560" cy="450" r="48" fill="#10b981" filter="url(#shadow-rp)" className="opacity-95" />
                        <circle cx="560" cy="450" r="56" fill="none" stroke="#10b981" strokeWidth="2" className="opacity-40 animate-ping" style={{ animationDuration: '3s' }} />
                        <polyline points="535,455 555,475 585,435" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </g>

                    {/* --- Animated floating Password Asterisks (Data Bits) --- */}
                    {/* Representing the new robust password being generated */}
                    <g className="text-primary">
                        <g className="opacity-60 animate-pulse" style={{ animationDuration: '2s' }}>
                            <path d="M180 200 L195 185 L210 200 L195 215 Z" fill="url(#primary-grad-rp)" filter="url(#glow-rp)" />
                        </g>
                        <g className="opacity-80 animate-[float_3s_ease-in-out_infinite]" style={{ animationDelay: '300ms' }}>
                            <path d="M620 220 L640 200 L660 220 L640 240 Z" fill="url(#primary-grad-rp)" filter="url(#glow-rp)" />
                        </g>
                        <g className="opacity-50 animate-pulse" style={{ animationDelay: '800ms', animationDuration: '2.5s' }}>
                            <path d="M220 440 L235 425 L250 440 L235 455 Z" fill="url(#primary-grad-rp)" filter="url(#glow-rp)" />
                        </g>
                        <g className="opacity-40 animate-[float_4s_ease-in-out_infinite]" style={{ animationDelay: '1200ms' }}>
                            <path d="M640 360 L650 350 L660 360 L650 370 Z" fill="url(#primary-grad-rp)" filter="url(#glow-rp)" />
                        </g>
                    </g>

                </svg>

                {/* Custom Animations via style mapping */}
                <style>{`
                        @keyframes float {
                            0% { transform: translateY(0px) rotate(0deg); }
                            50% { transform: translateY(-12px) rotate(1deg); }
                            100% { transform: translateY(0px) rotate(0deg); }
                        }
                    `}</style>
            </div>
        </div>
    )
}

export default ResetPasswordAnimationComponent