import React from 'react';

/** Biểu tượng ngôi nhà đơn giản (nét vàng) dùng cho các khối số liệu. */
export function HouseIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 15 16 5l12 10"
        stroke="#D4AE59"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 13.5V27h18V13.5"
        stroke="#D4AE59"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="13" y="19" width="6" height="8" rx="1" stroke="#D4AE59" strokeWidth="2" />
    </svg>
  );
}
