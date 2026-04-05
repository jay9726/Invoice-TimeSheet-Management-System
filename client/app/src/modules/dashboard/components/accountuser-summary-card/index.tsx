import { Card, CardContent } from '@/components/ui/card';
import React from 'react'

interface summaryCardProps {
    label: string;
    value: number;
    description: string;
    icon: React.ReactElement;
    textColor: string;
    bgColor: string;
    leftBorderColor: string;
}


const AccountUserSummaryCard: React.FC<{ card: summaryCardProps }> = ({ card }) => {
    return (
        <Card
            className="group relative overflow-hidden rounded-xl border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
            {/* Dynamic Left Accent Bar (Always Visible) */}
            <div className={`absolute top-0 bottom-0 left-0 w-1 ${card.leftBorderColor}`} />

            <CardContent className="p-4 md:p-6 flex items-center">
                {/* Left Side: Soft Container Icon */}
                <div className={`mr-4 md:mr-5 flex shrink-0 h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl ${card.textColor} transition-transform duration-500 group-hover:scale-110`}>
                    <div className={`${card.textColor}`}>
                        {card.icon}
                    </div>
                </div>

                {/* Right Side: Data */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase truncate text-muted">
                        {card.label}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
                            {card.value !== undefined ? card.value : <span className="opacity-20">--</span>}
                        </h3>
                    </div>
                    <p className="text-xs sm:text-sm mt-1 truncate transition-colors text-muted">
                        {card.description}
                    </p>
                </div>

                {/* Decorative Background Icon (Large, barely visible) */}
                <div className={`absolute -right-4 -bottom-4 opacity-[0.03] transform scale-150 rotate-12 transition-transform duration-700 group-hover:rotate-0 ${card.textColor} pointer-events-none`}>
                    {card.icon}
                </div>
            </CardContent>
        </Card>
    )
}

export default AccountUserSummaryCard