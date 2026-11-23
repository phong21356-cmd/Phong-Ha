import React from 'react';
import { X, Compass, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ApartmentUnit, Attendee } from '../data/residencesData';

interface FloorplanModalProps {
  unit: ApartmentUnit | null;
  winner?: Attendee | null;
  onClose: () => void;
  onOpenCertificate?: (winner: Attendee) => void;
}

export const FloorplanModal: React.FC<FloorplanModalProps> = ({
  unit,
  winner,
  onClose,
  onOpenCertificate,
}) => {
  if (!unit) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#101921] border border-[#D4AE59]/30 text-[#FAFAFA] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AE59]/15 bg-[#0B1118]">
          <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[#A3A3A3]">
            <span className="font-sans tabular-nums text-[#D4AE59]">{unit.code}</span>
            <span aria-hidden="true">·</span>
            <span>Hồ sơ Kỹ thuật & Mặt bằng Kiến trúc</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A3A3A3] hover:text-[#FAFAFA] transition-colors cursor-pointer"
            aria-label="Đóng hồ sơ mặt bằng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Architectural Blueprint Diagram */}
          <div className="lg:col-span-7 p-6 md:p-8 bg-[#0B1118] border-b lg:border-b-0 lg:border-r border-[#D4AE59]/15 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#A3A3A3] mb-4">
              <span className="font-sans tabular-nums uppercase tracking-wider">
                TỶ LỆ MẶT BẰNG: 1/100 · {unit.floor.toUpperCase()}
              </span>
              <span className="flex items-center gap-1.5 text-[#D4AE59]">
                <Compass className="w-3.5 h-3.5" />
                <span>{unit.orientation}</span>
              </span>
            </div>

            {/* Architectural Vector Blueprint SVG */}
            <div className="relative w-full aspect-[16/11] border border-[#D4AE59]/20 bg-[#0B1118] p-4 flex items-center justify-center">
              <svg
                viewBox="0 0 500 340"
                className="w-full h-full stroke-[#D4AE59]"
                fill="none"
              >
                {/* Subtle blueprint grid */}
                <defs>
                  <pattern
                    id="archGrid"
                    width="25"
                    height="25"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 25 0 L 0 0 0 25"
                      fill="none"
                      stroke="rgba(212, 174, 89, 0.07)"
                      strokeWidth="0.75"
                    />
                  </pattern>
                </defs>
                <rect width="500" height="340" fill="url(#archGrid)" />

                {/* Outer Structural Walls */}
                <rect
                  x="40"
                  y="30"
                  width="420"
                  height="270"
                  stroke="#D4AE59"
                  strokeWidth="2.5"
                  fill="rgba(212, 174, 89, 0.02)"
                />

                {/* Balcony / Loggia Bottom Span */}
                <rect
                  x="40"
                  y="255"
                  width="280"
                  height="45"
                  stroke="#D4AE59"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                  fill="rgba(212, 174, 89, 0.05)"
                />
                <text
                  x="180"
                  y="282"
                  textAnchor="middle"
                  fill="#D4AE59"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="1.5"
                >
                  PANORAMA LOGGIA &amp; BALCONY
                </text>

                {/* Grand Salon / Living & Dining */}
                <rect
                  x="40"
                  y="30"
                  width="210"
                  height="225"
                  stroke="#D4AE59"
                  strokeWidth="1.5"
                />
                {/* Living Sofa & Dining Table Schematic */}
                <rect
                  x="65"
                  y="145"
                  width="95"
                  height="55"
                  stroke="rgba(212, 174, 89, 0.45)"
                  strokeWidth="1"
                />
                <rect
                  x="85"
                  y="60"
                  width="75"
                  height="40"
                  stroke="rgba(212, 174, 89, 0.45)"
                  strokeWidth="1"
                />
                <text
                  x="145"
                  y="128"
                  textAnchor="middle"
                  fill="#FAFAFA"
                  fontSize="11"
                  fontFamily="Cormorant Garamond, serif"
                  letterSpacing="1"
                >
                  GRAND SALON &amp; DINING
                </text>

                {/* Master Suite Right */}
                <rect
                  x="250"
                  y="30"
                  width="210"
                  height="135"
                  stroke="#D4AE59"
                  strokeWidth="1.5"
                />
                {/* King Bed Schematic */}
                <rect
                  x="355"
                  y="55"
                  width="80"
                  height="70"
                  stroke="rgba(212, 174, 89, 0.45)"
                  strokeWidth="1"
                />
                <text
                  x="315"
                  y="95"
                  textAnchor="middle"
                  fill="#FAFAFA"
                  fontSize="11"
                  fontFamily="Cormorant Garamond, serif"
                  letterSpacing="1"
                >
                  MASTER SUITE
                </text>

                {/* Secondary Suite & Private Lift Lobby */}
                <rect
                  x="250"
                  y="165"
                  width="115"
                  height="90"
                  stroke="#D4AE59"
                  strokeWidth="1.2"
                />
                <text
                  x="307"
                  y="212"
                  textAnchor="middle"
                  fill="#A3A3A3"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                >
                  SUITE 02 / STUDY
                </text>

                <rect
                  x="365"
                  y="165"
                  width="95"
                  height="135"
                  stroke="#D4AE59"
                  strokeWidth="1.5"
                />
                <text
                  x="412"
                  y="235"
                  textAnchor="middle"
                  fill="#D4AE59"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                >
                  PRIVATE FOYER
                </text>

                {/* Dimension callouts */}
                <line
                  x1="40"
                  y1="16"
                  x2="460"
                  y2="16"
                  stroke="rgba(212, 174, 89, 0.4)"
                  strokeWidth="0.8"
                />
                <text
                  x="250"
                  y="12"
                  textAnchor="middle"
                  fill="#A3A3A3"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                >
                  14,800 mm
                </text>
              </svg>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#A3A3A3]">
              <span>Tiêu chuẩn bàn giao: Nội thất Bespoke Ý hoàn thiện</span>
              <span className="font-sans tabular-nums text-[#FAFAFA] tabular-nums">
                Diện tích thông thủy: {unit.area}
              </span>
            </div>
          </div>

          {/* Right: Specifications & Allocation Status */}
          <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-[#101921]">
            <div>
              <div className="text-xs font-sans tabular-nums tracking-widest uppercase text-[#D4AE59] mb-1">
                BỘ SƯU TẬP GIỚI HẠN ĐỢT 1 · MÃ CĂN {unit.id}
              </div>
              <h3 className="text-2xl md:text-3xl font-sans font-semibold text-[#FAFAFA] mb-2">
                {unit.name}
              </h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed mb-6">
                {unit.highlights}
              </p>

              {/* Specification Hairline Table */}
              <dl className="divide-y divide-[#D4AE59]/15 border-t border-b border-[#D4AE59]/15 text-xs mb-6">
                <div className="py-2.5 flex justify-between">
                  <dt className="text-[#A3A3A3]">Vị trí tầng</dt>
                  <dd className="font-medium text-[#FAFAFA] tabular-nums">{unit.floor}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-[#A3A3A3]">Diện tích tim tường</dt>
                  <dd className="font-sans tabular-nums text-[#FAFAFA] tabular-nums">{unit.area}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-[#A3A3A3]">Cấu trúc phòng</dt>
                  <dd className="font-medium text-[#FAFAFA]">{unit.bedrooms}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-[#A3A3A3]">Giá trị niêm yết tham chiếu</dt>
                  <dd className="font-sans tabular-nums text-[#D4AE59] font-medium tabular-nums">
                    {unit.referencePrice}
                  </dd>
                </div>
              </dl>

              {/* Room Area Breakdown */}
              <div className="mb-6">
                <div className="text-[11px] uppercase tracking-widest text-[#A3A3A3] mb-2.5">
                  Chi tiết phân bổ không gian
                </div>
                <div className="space-y-1.5">
                  {unit.rooms.map((rm, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs text-[#D4D4D4]"
                    >
                      <span>{rm.label}</span>
                      <span className="font-sans tabular-nums text-[#A3A3A3] tabular-nums">
                        {rm.area}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Allocation Status Block */}
            <div className="pt-4 border-t border-[#D4AE59]/20">
              {winner ? (
                <div className="bg-[#0B1118] border border-[#D4AE59]/40 p-4">
                  <div className="flex items-center justify-between text-xs text-[#D4AE59] mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ĐÃ XÁC ĐỊNH CHỦ NHÂN QUYỀN MUA
                    </span>
                    <span className="font-sans tabular-nums">{winner.code}</span>
                  </div>
                  <div className="text-base font-sans font-semibold text-[#FAFAFA]">
                    {winner.fullName}
                  </div>
                  <div className="text-xs text-[#A3A3A3] mt-0.5 font-sans tabular-nums">
                    SĐT: {winner.phone} · Mã hồ sơ: {winner.receiptCode}
                  </div>
                  {onOpenCertificate && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCertificate(winner);
                      }}
                      className="mt-3 w-full py-2 px-4 bg-[#D4AE59] text-[#0B1118] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8CC83] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Xem Biên bản Xác nhận Quyền mua</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
                  <span>Trạng thái phân bổ:</span>
                  <span className="text-[#D4AE59] font-medium">
                    Đang chờ mở bốc thăm Đợt 1
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
