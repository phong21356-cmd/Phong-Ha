import React from 'react';

/**
 * Minh hoạ SVG thương hiệu An Phúc Imperia: cụm 4 tòa nhà ở xã hội trên nền mây,
 * dùng bảng màu vàng của web NOXH. Vẽ bằng vector để giữ nét ở mọi kích thước.
 */
export function SkylineIllustration({ className = '' }: { className?: string }) {
  const towers = [
    { x: 40, w: 96, h: 210, floors: 14 },
    { x: 150, w: 120, h: 300, floors: 20 },
    { x: 284, w: 104, h: 250, floors: 17 },
    { x: 402, w: 84, h: 180, floors: 12 },
  ];
  const base = 360;
  return (
    <svg
      className={className}
      viewBox="0 0 520 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skyGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B88C39" />
          <stop offset="0.35" stopColor="#E8CC83" />
          <stop offset="0.65" stopColor="#C69A49" />
          <stop offset="1" stopColor="#F2D990" />
        </linearGradient>
        <linearGradient id="towerFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D4AE59" stopOpacity="0.22" />
          <stop offset="1" stopColor="#D4AE59" stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id="cloud" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FAFAFA" stopOpacity="0.28" />
          <stop offset="1" stopColor="#FAFAFA" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="260" cy="372" rx="250" ry="26" fill="url(#cloud)" />
      <line x1="10" y1={base} x2="510" y2={base} stroke="#D4AE59" strokeOpacity="0.5" />

      {towers.map((t, i) => {
        const top = base - t.h;
        const cols = 3;
        const cellW = (t.w - 24) / cols;
        const cellH = (t.h - 24) / t.floors;
        return (
          <g key={i}>
            <rect
              x={t.x}
              y={top}
              width={t.w}
              height={t.h}
              fill="url(#towerFill)"
              stroke="url(#skyGold)"
              strokeWidth="1.5"
            />
            <rect
              x={t.x + t.w / 2 - 14}
              y={top - 12}
              width="28"
              height="12"
              fill="none"
              stroke="url(#skyGold)"
              strokeWidth="1.5"
            />
            {Array.from({ length: t.floors }).map((_, r) =>
              Array.from({ length: cols }).map((__, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={t.x + 12 + c * cellW + 3}
                  y={top + 12 + r * cellH + 2}
                  width={cellW - 6}
                  height={Math.max(cellH - 5, 2)}
                  fill="#D4AE59"
                  fillOpacity={(r * 7 + c * 3 + i) % 5 === 0 ? 0.55 : 0.14}
                />
              ))
            )}
          </g>
        );
      })}
    </svg>
  );
}

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
