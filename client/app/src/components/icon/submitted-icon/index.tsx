import type React from "react"

const SubmittedIcon = ({
  width = "80",
  height = "25",
  fill = "#D97706",
  stroke = "#D97706",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 130 32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="110" height="32" rx="16" fill="#FEF3C7" />
    <circle
      cx="18"
      cy="16"
      r="6"
      stroke="#D97706"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M18 13v4l3 2"
      stroke="#D97706"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <text
      x="35"
      y="21"
      fill="#D97706"
      fontSize="14"
      fontFamily="Inter, sans-serif"
      fontWeight="500"
    >
      Submitted
    </text>
  </svg>
)

export default SubmittedIcon
