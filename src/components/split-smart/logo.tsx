import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", props.className)}
      {...props}
    >
      <path d="M14 13.5V8.5a2 2 0 1 0-4 0v5" />
      <path d="M12 21a9 9 0 0 0 0-18" />
      <path d="M8 16h8" />
      <path d="M12 11.5h.01" />
      <path d="M12 15.5h.01" />
    </svg>
  );
}
