import { SVGProps } from "react";

interface PlayIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export function PlayIcon({ className = "h-5 w-5", ...props }: PlayIconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
