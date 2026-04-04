import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface toolTipsProps {
    children: React.ReactNode
    lable: string
}


const ToolTips: React.FC<toolTipsProps> = ({ children, lable }) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                <p>{lable}</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default ToolTips