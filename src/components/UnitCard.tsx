import React from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * Card căn hộ theo thiết kế Figma "AN / Card căn hộ" (bố cục dọc):
 * mặt bằng sơ lược, chip công năng, tên căn, loại + diện tích, giá bán dự kiến.
 */

type Room = { kind: 'pk' | 'pn' | 'wc' | 'lg'; flex: number };
type Plan = { top: Room[]; bottom: Room[] };

const PLANS: Record<string, Plan> = {
  A1: {
    top: [{ kind: 'pk', flex: 48 }, { kind: 'pn', flex: 52 }],
    bottom: [{ kind: 'wc', flex: 39 }, { kind: 'lg', flex: 61 }],
  },
  A2: {
    top: [{ kind: 'pk', flex: 48 }, { kind: 'pn', flex: 52 }],
    bottom: [{ kind: 'wc', flex: 39 }, { kind: 'lg', flex: 61 }],
  },
  A3: {
    top: [{ kind: 'pk', flex: 48 }, { kind: 'pn', flex: 26 }, { kind: 'pn', flex: 26 }],
    bottom: [{ kind: 'wc', flex: 40 }, { kind: 'lg', flex: 30 }, { kind: 'lg', flex: 30 }],
  },
  A4: {
    top: [{ kind: 'pk', flex: 48 }, { kind: 'pn', flex: 26 }, { kind: 'pn', flex: 26 }],
    bottom: [
      { kind: 'wc', flex: 20 },
      { kind: 'wc', flex: 20 },
      { kind: 'lg', flex: 30 },
      { kind: 'lg', flex: 30 },
    ],
  },
  A5: {
    top: [
      { kind: 'pk', flex: 40 },
      { kind: 'pn', flex: 20 },
      { kind: 'pn', flex: 20 },
      { kind: 'pn', flex: 20 },
    ],
    bottom: [{ kind: 'wc', flex: 20 }, { kind: 'wc', flex: 20 }, { kind: 'lg', flex: 60 }],
  },
};

const ROOM_STYLE: Record<Room['kind'], { label: string; alpha: number }> = {
  pk: { label: 'Phòng khách', alpha: 0.1 },
  pn: { label: 'PN', alpha: 0.25 },
  wc: { label: 'WC', alpha: 0.35 },
  lg: { label: 'Logia', alpha: 0.06 },
};

const CHIPS: Record<string, string[]> = {
  A1: ['1 phòng khách', '1 WC', '1 logia'],
  A2: ['1 phòng khách', '1 WC', '1 logia'],
  A3: ['1 phòng khách', '1 WC', '2 logia'],
  A4: ['1 phòng khách', '2 WC', '2 logia'],
  A5: ['1 phòng khách', '2 WC', '1 logia'],
};

const SUBTITLE: Record<string, string> = {
  A1: '1 phòng ngủ · 36,8 m²',
  A2: '1 phòng ngủ + · 50,1 m²',
  A3: '2 phòng ngủ · 59,3 m²',
  A4: '2 phòng ngủ · 69,6 m²',
  A5: '3 phòng ngủ · 76,9 m²',
};

function Row({ rooms, height }: { rooms: Room[]; height: string }) {
  return (
    <div className="flex" style={{ height }}>
      {rooms.map((r, i) => (
        <div
          key={i}
          className="flex items-center justify-center rounded-none text-[10px] md:text-[11px] text-[#171717] border border-[#9E7A33]"
          style={{
            flex: r.flex,
            background: `rgba(199,163,82,${ROOM_STYLE[r.kind].alpha})`,
            marginLeft: i === 0 ? 0 : -1,
          }}
        >
          {ROOM_STYLE[r.kind].label}
        </div>
      ))}
    </div>
  );
}

export function UnitCard({
  id,
  active,
  onHover,
  onOpen,
}: {
  id: string;
  active: boolean;
  onHover: () => void;
  onOpen: () => void;
}) {
  const plan = PLANS[id] ?? PLANS.A1;
  return (
    <div
      onMouseEnter={onHover}
      onClick={onOpen}
      className={`group flex flex-col overflow-hidden rounded-[18px] bg-[#FAF8F2] cursor-pointer transition-shadow border ${
        active
          ? 'border-[#D4AE59] shadow-[0_0_0_2px_rgba(212,174,89,0.55)]'
          : 'border-[#D4D4D4] hover:shadow-[0_0_0_2px_rgba(212,174,89,0.35)]'
      }`}
    >
      {/* Ảnh mặt bằng 16:9 */}
      <div className="bg-[#F7F0DB] aspect-video flex flex-col justify-between px-[12%] pt-[6%] pb-3">
        <div className="bg-white border-2 border-[#9E7A33] rounded-[6px] overflow-hidden w-full" style={{ aspectRatio: '396 / 221' }}>
          <div className="h-full flex flex-col">
            <Row rooms={plan.top} height="62.4%" />
            <Row rooms={plan.bottom} height="37.6%" />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {(CHIPS[id] ?? []).map((c) => (
            <span
              key={c}
              className="px-2 py-0.5 rounded-full border border-[#C7A352] bg-white/90 text-[10px] md:text-[11px] text-[#171717] whitespace-nowrap"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Thông tin */}
      <div className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1 px-4 py-3">
        <div className="min-w-0">
          <div className="text-base md:text-lg font-semibold text-[#171717] leading-tight">Căn {id}</div>
          <div className="text-[11px] md:text-xs text-[#525252] mt-0.5 whitespace-nowrap">
            {SUBTITLE[id]}
          </div>
        </div>
        <div className="text-left xl:text-right shrink-0">
          <div className="text-[10px] md:text-[11px] text-[#737373]">Giá bán dự kiến</div>
          <div className="text-sm md:text-base font-semibold text-[#1C2834] tabular-nums flex items-center xl:justify-end gap-1">
            [giá] đ/m²
            <ArrowUpRight className="w-3.5 h-3.5 text-[#9E7A33] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
}
