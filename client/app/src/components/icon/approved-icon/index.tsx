import React from "react"

const ApprovedIcon = ({
    width = '80',
    height = '25',
    fill = '#16A34A',
    stroke = '#16A34A',
    ...props
}: React.SVGProps<SVGSVGElement>) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 120 32"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <rect width="110" height="32" rx="16" fill="#DCFCE7" />
        <path
            d="M15 16l4 4 8-8"
            fill="none"
            stroke="#16A34A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <text
            x="35"
            y="21"
            fill="#16A34A"
            fontSize="14"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
        >
            Approved
        </text>
    </svg>
)

export default ApprovedIcon
