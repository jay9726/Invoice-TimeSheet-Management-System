import type React from "react"

const RejectedIcon = ({
  width = "80",
  height = "25",
  fill = "#DC2626",
  stroke = "#DC2626",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 120 32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="110" height="32" rx="16" fill="#FEE2E2" />
    <path
      d="M15 12l8 8M23 12l-8 8"
      stroke="#DC2626"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <text
      x="35"
      y="21"
      fill="#DC2626"
      fontSize="14"
      fontFamily="Inter, sans-serif"
      fontWeight="500"
    >
      Rejected
    </text>
  </svg>
)

export default RejectedIcon
