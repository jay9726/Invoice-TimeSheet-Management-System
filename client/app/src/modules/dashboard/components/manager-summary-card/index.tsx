import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

interface summaryCardProps {
    label: string,
    value: number,
    description: string,
    icon: React.ReactNode,
    colorClass: string
}


const ManagerSummaryCard: React.FC<{ card: summaryCardProps }> = ({ card }) => {
    return (
        <Card
            className="group overflow-hidden rounded-xl border border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-4">
                        <p className="text-sm font-semibold tracking-wide uppercase">
                            {card.label}
                        </p>
                        <div>
                            <h3 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
                                {card.value}
                            </h3>
                        </div>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${card.colorClass} transition-transform duration-300 group-hover:scale-110`}>
                        {card.icon}
                    </div>
                </div>
                <div className="mt-5 flex items-center text-sm text-muted">
                    <span className="line-clamp-1">{card.description}</span>
                </div>
            </CardContent>
        </Card>
    )
}

export default ManagerSummaryCard