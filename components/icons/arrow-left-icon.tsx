import { SVGProps } from "react";

interface ArrowLeftIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export function ArrowLeftIcon({
  className = "h-5 w-5",
  ...props
}: ArrowLeftIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}
