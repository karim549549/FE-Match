import { SVGProps } from "react";

interface AppleIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export function AppleIcon({ className = "h-5 w-5", ...props }: AppleIconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.15-.04-.21.09-1.39.87-2.79 2.1-3.69.69-.53 1.63-.92 2.227-.92.05 0 .11.01.177.02v.18zm-3.328 5.37c-2.518 0-4.708 2.2-4.708 5.86 0 4.14 2.89 7.89 5.87 7.89 1.13 0 1.91-.48 2.54-1.05.65.61 1.64 1.05 2.65 1.05 2.62 0 4.96-3.1 4.96-6.4 0-3.36-2.19-5.35-5.11-5.35-1.74 0-3.04.91-3.69 1.97-.24-.92-1.35-1.97-2.512-1.97z"></path>
    </svg>
  );
}
