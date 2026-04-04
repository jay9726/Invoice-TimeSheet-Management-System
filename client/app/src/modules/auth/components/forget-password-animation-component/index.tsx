import React from 'react'

const ForgetPasswordAnimationComponent: React.FC = () => {
    return (
        <div className="hidden lg:flex w-1/2 relative bg-primary/5 items-center justify-center overflow-hidden">
            {/* Background Decor lines */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-0 w-px bg-linear-to-b from-transparent via-primary/20 to-transparent"></div>

                {/* Subtle grid pattern for ForgetPassword */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03] text-primary" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid-pattern-fp" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern-fp)" />
                </svg>
            </div>

            {/* Main Illustration */}
            <div className="relative z-10 w-full max-w-2xl p-4 lg:p-12 perspective-1000">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className="w-full h-auto drop-shadow-2xl" fill="none">
                    <defs>
                        {/* Gradients for UI Depth */}
                        <linearGradient id="bg-grad-fp" x1="0" y1="0" x2="800" y2="600" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
                        </linearGradient>
                        <linearGradient id="card-grad-fp" x1="0" y1="0" x2="0" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                            <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.95" />
                        </linearGradient>
                        <linearGradient id="primary-grad-fp" x1="0" y1="0" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
                        </linearGradient>

                        {/* Filters */}
                        <filter id="shadow-fp" x="-10%" y="-10%" width="130%" height="130%">
                            <feDropShadow dx="0" dy="12" stdDeviation="12" floodOpacity="0.1" />
                        </filter>
                        <filter id="glow-fp" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Background Spinning Atmosphere */}
                    <circle cx="400" cy="300" r="180" fill="url(#primary-grad-fp)" className="text-primary opacity-5 animate-[pulse_6s_ease-in-out_infinite]" />
                    <circle cx="400" cy="300" r="220" stroke="currentColor" strokeWidth="2" strokeDasharray="8 16" className="text-primary opacity-20 animate-[spin_60s_linear_infinite]" />

                    {/* --- App Frame / Background Box --- */}
                    <g filter="url(#shadow-fp)" className="animate-[float_5s_ease-in-out_infinite]">
                        <rect x="150" y="80" width="500" height="440" rx="24" fill="url(#bg-grad-fp)" stroke="currentColor" strokeWidth="1" className="opacity-80 text-primary" />
                        <rect x="150" y="80" width="500" height="440" rx="24" fill="white" className="opacity-60" />

                        {/* Abstract Header Dots */}
                        <circle cx="180" cy="110" r="6" fill="#ef4444" className="opacity-80" />
                        <circle cx="200" cy="110" r="6" fill="#f59e0b" className="opacity-80" />
                        <circle cx="220" cy="110" r="6" fill="#10b981" className="opacity-80" />
                    </g>

                    {/* --- Main Center Shield/Lock (Security) --- */}
                    <g className="animate-[float_4s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }}>
                        <path d="M400 160 C400 160 520 190 520 280 C520 420 400 500 400 500 C400 500 280 420 280 280 C280 190 400 160 400 160 Z" fill="url(#card-grad-fp)" filter="url(#shadow-fp)" />

                        {/* Inner Shield Lines */}
                        <path d="M400 180 C400 180 490 205 490 280 C490 390 400 460 400 460 C400 460 310 390 310 280 C310 205 400 180 400 180 Z" stroke="url(#primary-grad-fp)" strokeWidth="6" strokeLinejoin="round" fill="none" className="text-primary opacity-60" />

                        {/* The Keyhole */}
                        <circle cx="400" cy="290" r="28" fill="url(#primary-grad-fp)" filter="url(#glow-fp)" className="text-primary" />
                        <path d="M385 300 L375 360 L425 360 L415 300 Z" fill="url(#primary-grad-fp)" className="text-primary" />
                    </g>

                    {/* --- The Envelope (Reset Link) --- */}
                    {/* It floats across and up to symbolize sending */}
                    <g className="animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} transform="translate(60, 40) rotate(-10 500 350)">
                        <rect x="460" y="280" width="160" height="110" rx="12" fill="white" filter="url(#shadow-fp)" />
                        <rect x="460" y="280" width="160" height="110" rx="12" stroke="currentColor" strokeWidth="3" className="text-primary opacity-20" />

                        {/* Envelope Flap */}
                        <path d="M460 280 L540 340 L620 280" stroke="url(#primary-grad-fp)" strokeWidth="4" className="text-primary" strokeLinejoin="round" fill="none" />

                        {/* A glowing dot on the envelope signifying the critical link */}
                        <circle cx="540" cy="340" r="8" fill="#10b981" filter="url(#glow-fp)" className="opacity-90 animate-[pulse_2s_ease-in-out_infinite]" />

                        {/* Magic Particles sending off */}
                        <circle cx="640" cy="270" r="4" fill="url(#primary-grad-fp)" className="text-primary opacity-80 animate-pulse" />
                        <circle cx="620" cy="250" r="6" fill="url(#primary-grad-fp)" className="text-primary opacity-50 animate-pulse" style={{ animationDelay: '300ms' }} />
                        <circle cx="660" cy="300" r="3" fill="url(#primary-grad-fp)" className="text-primary opacity-90 animate-pulse" style={{ animationDelay: '600ms' }} />
                    </g>

                    {/* --- Visual refresh arrows --- */}
                    <g className="animate-[spin_20s_linear_infinite]" style={{ transformOrigin: '400px 330px' }}>
                        <path d="M220 330 A 180 180 0 0 1 400 150" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-primary opacity-20" fill="none" />
                        <polygon points="400,135 400,165 425,150" fill="currentColor" className="text-primary opacity-30" />

                        <path d="M580 330 A 180 180 0 0 1 400 510" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-primary opacity-20" fill="none" />
                        <polygon points="400,525 400,495 375,510" fill="currentColor" className="text-primary opacity-30" />
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

export default ForgetPasswordAnimationComponent