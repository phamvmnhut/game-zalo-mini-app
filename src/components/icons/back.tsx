import { SVGProps } from "@type/common";
import React from "react";

export function BackIcon(props: SVGProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0.5" y="0.5" width={15} height={15} rx="7.5" fill="#335BBA" />
      <rect x="0.5" y="0.5" width={15} height={15} rx="7.5" stroke="white" />
      <path
        d="M5.9125 8.5L8.7125 11.3L8 12L4 8L8 4L8.7125 4.7L5.9125 7.5H12V8.5H5.9125Z"
        fill="white"
      />
    </svg>
  );
}
