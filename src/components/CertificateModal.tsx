import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Download, ShieldCheck } from 'lucide-react';
import { Attendee } from '../data/residencesData';

interface CertificateModalProps {
  selectedAttendee: Attendee | null;
  allAttendees: Attendee[];
  isDrawn: boolean;
  drawTimestamp: string;
  onClose: () => void;
  onSelectAttendee: (att: Attendee) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  selectedAttendee,
  allAttendees,
  isDrawn,
  drawTimestamp,
  onClose,
  onSelectAttendee,
}) => {
  const [query, setQuery] = useState(selectedAttendee ? selectedAttendee.code : '');

  const matchedList = query.trim()
    ? allAttendees
        .filter(
          (a) =>
            a.code.toLowerCase().includes(query.trim().toLowerCase()) ||
            a.fullName.toLowerCase().includes(query.trim().toLowerCase()) ||
            a.phone.toLowerCase().includes(query.trim().toLowerCase()) ||
            a.receiptCode.toLowerCase().includes(query.trim().toLowerCase())
        )
        .slice(0, 6)
    : [];

  const activeRecord = selectedAttendee || (matchedList.length === 1 ? matchedList[0] : null);

  const handleDownloadCertificateText = (att: Attendee) => {
    const statusLine = !isDrawn
      ? 'ĐÃ CHECK-IN HỢP LỆ (CHỜ MỞ BỐC THĂM)'
      : att.isWinner && att.wonApartment
      ? `TRÚNG QUYỀN MUA CĂN HỘ ${att.wonApartment.id} — ${att.wonApartment.name}`
      : `DANH SÁCH ƯU TIÊN ĐỢT 2 — THỨ TỰ #${att.waitRank}`;

    const content = [
      '====================================================================',
      'THE AURELIA RESIDENCES — BIÊN BẢN XÁC NHẬN KẾT QUẢ BỐC THĂM',
      '====================================================================',
      `Thời gian ghi nhận : ${drawTimestamp || new Date().toLocaleString('vi-VN')}`,
      `Mã định danh KH    : ${att.code}`,
      `Mã phiếu đặt cọc   : ${att.receiptCode}`,
      `Họ và tên          : ${att.fullName}`,
      `Số điện thoại      : ${att.phone}`,
      `Giờ Check-in       : ${att.checkInTime}`,
      `Bàn tư vấn         : ${att.advisor}`,
      '--------------------------------------------------------------------',
      `KẾT QUẢ ĐỐI SOÁT   : ${statusLine}`,
      att.wonApartment
        ? `Thông số căn hộ    : ${att.wonApartment.floor} · ${att.wonApartment.area} · ${att.wonApartment.bedrooms}`
        : '',
      att.wonApartment
        ? `Giá tham chiếu     : ${att.wonApartment.referencePrice}`
        : '',
      '====================================================================',
      'Đơn vị giám sát: Hội đồng Đối soát Minh bạch — Aurelia Development',
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bien_Ban_Xac_Nhan_${att.code}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#111317] border border-[#C5A880]/35 text-[#F4F1EA] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#C5A880]/15 bg-[#0D0F12]">
          <div className="flex items-center gap-2.5 text-xs tracking-widest uppercase text-[#C5A880]">
            <ShieldCheck className="w-4 h-4" />
            <span>Hệ Thống Tra Cứu &amp; Chứng Nhận Quyền Mua Điện Tử</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9E9A90] hover:text-[#F4F1EA] transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ tra cứu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          {/* Search Input Bar */}
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-[#9E9A90] mb-2">
              Nhập Mã Khách Hàng (VD: KH-001 đến KH-500), Họ tên hoặc Số điện thoại
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (selectedAttendee) {
                    onSelectAttendee(null as unknown as Attendee);
                  }
                }}
                placeholder="VD: KH-042, Nguyễn, hoặc 4 số cuối điện thoại..."
                className="w-full bg-[#0B0C0E] border border-[#C5A880]/30 focus:border-[#C5A880] text-sm text-[#F4F1EA] pl-10 pr-4 py-2.5 outline-none transition-colors"
              />
            </div>

            {/* Quick matching suggestions */}
            {!activeRecord && matchedList.length > 0 && (
              <div className="mt-2 border border-[#C5A880]/20 bg-[#0D0F12] divide-y divide-[#C5A880]/10">
                {matchedList.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      onSelectAttendee(item);
                      setQuery(item.code);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs flex items-center justify-between hover:bg-[#171A20] transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-mono text-[#C5A880] mr-2">{item.code}</span>
                      <span className="font-medium text-[#F4F1EA]">{item.fullName}</span>
                      <span className="text-[#9E9A90] ml-2">· {item.phone}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#9E9A90]">
                      {!isDrawn
                        ? 'Đã Check-in'
                        : item.isWinner
                        ? `Trúng Căn ${item.wonApartment?.id}`
                        : `Ưu tiên #${item.waitRank}`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Certificate Card */}
          {activeRecord ? (
            <div className="border border-[#C5A880]/35 bg-[#0B0C0E] p-6 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#C5A880]/15">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#9E9A90]">
                    CHỨNG THƯ ĐỐI SOÁT MÃ ĐỊNH DANH · {activeRecord.receiptCode}
                  </div>
                  <h4 className="text-2xl font-serif font-semibold text-[#F4F1EA] mt-0.5">
                    {activeRecord.fullName}
                  </h4>
                </div>
                <div className="text-left sm:text-right font-mono">
                  <div className="text-lg font-semibold text-[#C5A880] tabular-nums">
                    {activeRecord.code}
                  </div>
                  <div className="text-xs text-[#9E9A90] tabular-nums">
                    SĐT: {activeRecord.phone}
                  </div>
                </div>
              </div>

              {/* Status Outcome Section */}
              <div className="py-5 border-b border-[#C5A880]/15">
                {!isDrawn ? (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                        Hồ sơ hợp lệ · Đang chờ kích hoạt bốc thăm
                      </div>
                      <p className="text-xs text-[#9E9A90] mt-1">
                        Khách hàng đã hoàn tất thủ tục check-in lúc {activeRecord.checkInTime} tại{' '}
                        {activeRecord.advisor}. Mã số đã được niêm phong trong danh sách 500 khách
                        hàng tham dự Đợt 1.
                      </p>
                    </div>
                  </div>
                ) : activeRecord.isWinner && activeRecord.wonApartment ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>XÁC NHẬN TRÚNG QUYỀN MUA CĂN HỘ ĐỘC BẢN ĐỢT 1</span>
                    </div>
                    <div className="p-4 bg-[#13161C] border border-[#C5A880]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-mono text-[#C5A880]">
                          CĂN HỘ {activeRecord.wonApartment.id} · {activeRecord.wonApartment.code}
                        </div>
                        <div className="text-xl font-serif font-semibold text-[#F4F1EA]">
                          {activeRecord.wonApartment.name}
                        </div>
                        <div className="text-xs text-[#9E9A90] mt-0.5">
                          {activeRecord.wonApartment.floor} · {activeRecord.wonApartment.area} ·{' '}
                          {activeRecord.wonApartment.bedrooms}
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <div className="text-[11px] uppercase tracking-wider text-[#9E9A90]">
                          Giá tham chiếu
                        </div>
                        <div className="text-sm font-mono font-semibold text-[#C5A880] tabular-nums">
                          {activeRecord.wonApartment.referencePrice}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#D6D2C4] font-semibold">
                        Đã ghi nhận vào Danh sách Ưu tiên Đợt 2
                      </div>
                      <p className="text-xs text-[#9E9A90] mt-1 leading-relaxed">
                        Hồ sơ của Quý khách được bảo lưu quyền ưu tiên chọn căn theo thứ tự định
                        danh ngay khi mở bảng hàng Đợt 2.
                      </p>
                    </div>
                    <div className="shrink-0 text-right font-mono">
                      <div className="text-[11px] uppercase text-[#9E9A90]">Thứ tự ưu tiên</div>
                      <div className="text-xl font-semibold text-[#F4F1EA] tabular-nums">
                        #{String(activeRecord.waitRank).padStart(3, '0')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata & Action */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#9E9A90]">
                <div className="font-mono tabular-nums">
                  Check-in: {activeRecord.checkInTime} · {activeRecord.advisor}
                </div>
                <button
                  onClick={() => handleDownloadCertificateText(activeRecord)}
                  className="py-2 px-4 bg-[#C5A880] text-[#0B0C0E] font-semibold text-xs uppercase tracking-wider hover:bg-[#D6BC96] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Biên bản Xác nhận (.TXT)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-[#C5A880]/15 bg-[#0D0F12] p-6 text-center text-xs text-[#9E9A90]">
              Nhập mã khách hàng (từ <span className="font-mono text-[#F4F1EA]">KH-001</span> đến{' '}
              <span className="font-mono text-[#F4F1EA]">KH-500</span>) để kiểm tra tình trạng
              check-in và biên bản kết quả bốc thăm.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
