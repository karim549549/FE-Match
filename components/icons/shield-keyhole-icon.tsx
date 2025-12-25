import { SVGProps } from "react";

interface ShieldKeyholeIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export function ShieldKeyholeIcon({
  className = "h-16 w-16",
  ...props
}: ShieldKeyholeIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
      {/* Shield shape with keyhole cutout using mask */}
      <defs>
        <mask id="keyhole-mask">
          <rect width="24" height="24" fill="white" />
          {/* Keyhole cutout - circle on top, rectangle below */}
          <circle cx="12" cy="10" r="2.5" fill="black" />
          <rect x="9.5" y="10" width="5" height="4" fill="black" />
        </mask>
      </defs>
      <path
        d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
        fill="currentColor"
        mask="url(#keyhole-mask)"
        style={{ color: "#ff0080" }}
      />
    </svg>
  );
}
