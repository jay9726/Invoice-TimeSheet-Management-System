import type React from "react"

const DraftIcon = ({
  width = "80",
  height = "25",
  fill = "#6B7280",
  stroke = "#6B7280",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 110 32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="80" height="32" rx="16" fill="#F3F4F6" />
    <path
      d="M15 11h12M15  16h12M15 21h8"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <text
      x="35"
      y="21"
      fill="#6B7280"
      fontSize="14"
      fontFamily="Inter, sans-serif"
      fontWeight="500"
    >
      Draft
    </text>
  </svg>
)

export default DraftIcon
