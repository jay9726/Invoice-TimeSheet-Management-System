import React from 'react'

const LoginAnimationComponent: React.FC = () => {
    return (
        <div className="hidden lg:flex w-1/2 relative bg-primary/5 items-center justify-center overflow-hidden">
            {/* Background Decor lines */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-0 w-px bg-linear-to-b from-transparent via-primary/20 to-transparent"></div>
                {/* Subtle grid pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03] text-primary" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>
            </div>

            {/* Main Illustration */}
            <div className="relative z-10 w-full max-w-2xl p-4 lg:p-12 perspective-1000">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className="w-full h-auto drop-shadow-2xl" fill="none">
                    <defs>
                        {/* Gradients for UI Depth */}
                        <linearGradient id="bg-grad" x1="0" y1="0" x2="800" y2="600" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
                        </linearGradient>
                        <linearGradient id="card-grad1" x1="0" y1="0" x2="0" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                            <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="primary-grad" x1="0" y1="0" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
                        </linearGradient>

                        {/* Glow Effects */}
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
                            <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.1" />
                        </filter>
                    </defs>

                    {/* Behind-Scenes Floating Blobs for Atmosphere */}
                    <circle cx="200" cy="150" r="100" fill="currentColor" className="opacity-10 animate-[pulse_6s_ease-in-out_infinite]" />
                    <circle cx="650" cy="450" r="150" fill="currentColor" className="opacity-10 animate-[pulse_8s_ease-in-out_infinite]" />

                    {/* --- App Frame / Container --- */}
                    <g filter="url(#shadow)" className="animate-[float_5s_ease-in-out_infinite]">
                        <rect x="60" y="60" width="680" height="480" rx="20" fill="url(#bg-grad)" stroke="currentColor" strokeWidth="1" className="opacity-80 text-primary" />
                        <rect x="60" y="60" width="680" height="480" rx="20" fill="white" className="opacity-50" />

                        {/* Top Navbar */}
                        <rect x="60" y="60" width="680" height="50" rx="20" fill="white" className="opacity-90" />
                        <rect x="60" y="110" width="680" height="1" fill="currentColor" className="opacity-10 text-primary" />

                        {/* Nav Items */}
                        <circle cx="100" cy="85" r="6" fill="#ef4444" className="opacity-80" />
                        <circle cx="120" cy="85" r="6" fill="#f59e0b" className="opacity-80" />
                        <circle cx="140" cy="85" r="6" fill="#10b981" className="opacity-80" />

                        <rect x="180" y="75" width="160" height="20" rx="10" fill="currentColor" className="opacity-10 text-primary" />
                        <circle cx="700" cy="85" r="14" fill="currentColor" className="opacity-20 text-primary" />
                    </g>

                    {/* --- Main Dashboard Content --- */}
                    <g className="animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}>
                        {/* Sidebar Area */}
                        <rect x="80" y="130" width="140" height="390" rx="12" fill="url(#card-grad1)" filter="url(#shadow)" />
                        <rect x="100" y="150" width="100" height="24" rx="6" fill="url(#primary-grad)" className="text-primary" />
                        <rect x="100" y="190" width="80" height="12" rx="4" fill="currentColor" className="opacity-20 text-primary" />
                        <rect x="100" y="220" width="90" height="12" rx="4" fill="currentColor" className="opacity-20 text-primary" />
                        <rect x="100" y="250" width="70" height="12" rx="4" fill="currentColor" className="opacity-20 text-primary" />

                        {/* Timesheet Summary Card */}
                        <rect x="250" y="130" width="220" height="140" rx="16" fill="url(#card-grad1)" filter="url(#shadow)" />
                        <rect x="250" y="130" width="220" height="140" rx="16" stroke="currentColor" strokeWidth="2" className="opacity-10 text-primary" />
                        <circle cx="290" cy="170" r="18" fill="url(#primary-grad)" className="text-primary" />
                        <polyline points="290 162 290 170 298 170" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="330" y="160" width="100" height="10" rx="4" fill="currentColor" className="opacity-30 text-primary" />
                        <rect x="330" y="176" width="60" height="8" rx="4" fill="currentColor" className="opacity-20 text-primary" />

                        {/* Mini line graph inside Timesheet card */}
                        <path d="M 270 240 Q 290 210 310 230 T 350 200 T 390 220 T 430 190" stroke="url(#primary-grad)" strokeWidth="3" fill="none" strokeLinecap="round" className="text-primary" />
                        <circle cx="430" cy="190" r="4" fill="url(#primary-grad)" filter="url(#glow)" className="text-primary" />
                    </g>

                    {/* --- Floating Interactive Elements --- */}

                    {/* Floating Invoice Popup */}
                    <g className="animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}>
                        <rect x="490" y="100" width="230" height="300" rx="16" fill="white" filter="url(#shadow)" />
                        {/* Invoice Header */}
                        <rect x="510" y="120" width="80" height="30" rx="6" fill="url(#primary-grad)" className="text-primary opacity-90" />
                        <rect x="660" y="125" width="40" height="20" rx="10" fill="#10b981" className="opacity-20" />
                        <circle cx="668" cy="135" r="4" fill="#10b981" />

                        {/* Invoice Items with staggered entering animation feel */}
                        <g className="opacity-70 text-gray-500">
                            <rect x="510" y="180" width="120" height="12" rx="4" fill="currentColor" />
                            <rect x="670" y="180" width="30" height="12" rx="4" fill="currentColor" />

                            <rect x="510" y="210" width="90" height="12" rx="4" fill="currentColor" />
                            <rect x="670" y="210" width="30" height="12" rx="4" fill="currentColor" />

                            <rect x="510" y="240" width="140" height="12" rx="4" fill="currentColor" />
                            <rect x="670" y="240" width="30" height="12" rx="4" fill="currentColor" />
                        </g>

                        <line x1="510" y1="280" x2="700" y2="280" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="opacity-20 text-primary" />
                        {/* Total strong highlight */}
                        <rect x="640" y="300" width="60" height="24" rx="6" fill="currentColor" className="opacity-10 text-primary" />
                        <rect x="650" y="308" width="40" height="8" rx="4" fill="url(#primary-grad)" className="text-primary" />
                    </g>

                    {/* Floating Analytics Bar Chart */}
                    <g className="animate-[float_4s_ease-in-out_infinite]" style={{ animationDelay: '0.8s' }}>
                        <rect x="250" y="290" width="420" height="230" rx="16" fill="url(#card-grad1)" filter="url(#shadow)" />

                        {/* Chart Title */}
                        <rect x="280" y="320" width="120" height="16" rx="8" fill="currentColor" className="opacity-30 text-primary" />

                        {/* Animated Bars */}
                        <rect x="290" y="460" width="30" height="0" rx="6" fill="url(#primary-grad)" className="text-primary animate-[height-grow_2s_ease-out_forwards]">
                            <animate attributeName="height" from="0" to="80" dur="1s" fill="freeze" />
                            <animate attributeName="y" from="460" to="380" dur="1s" fill="freeze" />
                        </rect>
                        <rect x="340" y="460" width="30" height="0" rx="6" fill="currentColor" className="opacity-40 text-primary">
                            <animate attributeName="height" from="0" to="120" dur="1.2s" fill="freeze" />
                            <animate attributeName="y" from="460" to="340" dur="1.2s" fill="freeze" />
                        </rect>
                        <rect x="390" y="460" width="30" height="0" rx="6" fill="url(#primary-grad)" className="text-primary">
                            <animate attributeName="height" from="0" to="50" dur="1.4s" fill="freeze" />
                            <animate attributeName="y" from="460" to="410" dur="1.4s" fill="freeze" />
                        </rect>
                        <rect x="440" y="460" width="30" height="0" rx="6" fill="currentColor" className="opacity-40 text-primary">
                            <animate attributeName="height" from="0" to="90" dur="1.6s" fill="freeze" />
                            <animate attributeName="y" from="460" to="370" dur="1.6s" fill="freeze" />
                        </rect>
                        <rect x="490" y="460" width="30" height="0" rx="6" fill="url(#primary-grad)" className="text-primary">
                            <animate attributeName="height" from="0" to="140" dur="1.8s" fill="freeze" />
                            <animate attributeName="y" from="460" to="320" dur="1.8s" fill="freeze" />
                        </rect>

                        {/* Base X Axis */}
                        <line x1="280" y1="470" x2="630" y2="470" stroke="currentColor" strokeWidth="2" className="opacity-20 text-primary" />
                    </g>

                    {/* Floating Notification Bubble */}
                    <g className="animate-[bounce_3s_ease-in-out_infinite]">
                        <circle cx="580" cy="270" r="28" fill="#10b981" filter="url(#shadow)" className="opacity-90" />
                        <path d="M570 270 L578 278 L590 262" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </g>

                    {/* Connecting Action Line */}
                    <path d="M 440 200 Q 480 200 500 250" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" fill="none" className="opacity-30 text-primary animate-[dash_20s_linear_infinite]" />
                </svg>

                {/* Add Custom Animations globally if needed via a style tag injected in React */}
                <style>{`
                        @keyframes float {
                            0% { transform: translateY(0px); }
                            50% { transform: translateY(-10px); }
                            100% { transform: translateY(0px); }
                        }
                        @keyframes dash {
                            to { stroke-dashoffset: -1000; }
                        }
                    `}</style>
            </div>
        </div>
    )
}

export default LoginAnimationComponent