import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Download,
  ArrowUpRight,
  Check,
  Pause,
  Play,
  QrCode,
  FileText,
} from 'lucide-react';
import {
  TARGET_APARTMENTS,
  ApartmentUnit,
  Attendee,
  generateAttendees,
} from './data/residencesData';
import {
  playChime,
  playPulseBeat,
  playLuxuryChord,
  triggerChampagneConfetti,
} from './utils/soundEngine';
import { FloorplanModal } from './components/FloorplanModal';
import { CertificateModal } from './components/CertificateModal';

type Stage = 'pre' | 'drawing' | 'post';
type FilterTab = 'all' | 'winners' | 'waiting';

export default function App() {
  const [attendees, setAttendees] = useState<Attendee[]>(() => generateAttendees(500));
  const [stage, setStage] = useState<Stage>('pre');
  const [winnersList, setWinnersList] = useState<Attendee[]>([]);
  const [waitingList, setWaitingList] = useState<Attendee[]>([]);
  const [drawTimestamp, setDrawTimestamp] = useState<string>('');

  // Suspense overlay state
  const [countdownVal, setCountdownVal] = useState<string>('05');
  const [vortexStatus, setVortexStatus] = useState<string>(
    'Đang khởi tạo thuật toán phân bổ độc lập cho 500 hồ sơ định danh...'
  );
  const [progress, setProgress] = useState<number>(0);
  const [streamText, setStreamText] = useState<string>(
    'KH-289 · PDC-26-1289 — ĐỐI SOÁT CĂN TYP-A1-05'
  );

  // Post-draw filters & search
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [isHoveringWaiting, setIsHoveringWaiting] = useState<boolean>(false);

  // Interactive modals & UI state
  const [muted, setMuted] = useState<boolean>(false);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>('A5');
  const [selectedUnitForModal, setSelectedUnitForModal] = useState<ApartmentUnit | null>(null);
  const [selectedAttendeeForCert, setSelectedAttendeeForCert] = useState<Attendee | null>(null);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const waitingContainerRef = useRef<HTMLDivElement | null>(null);
  const portfolioSectionRef = useRef<HTMLDivElement | null>(null);

  // Smooth auto-scroll on the waiting list in Stage 3
  useEffect(() => {
    if (stage !== 'post' || !autoScroll || isHoveringWaiting || searchQuery.trim() !== '') {
      return;
    }
    const interval = setInterval(() => {
      const el = waitingContainerRef.current;
      if (el) {
        el.scrollTop += 1;
        if (el.scrollTop >= el.scrollHeight - el.clientHeight - 2) {
          el.scrollTop = 0;
        }
      }
    }, 45);
    return () => clearInterval(interval);
  }, [stage, autoScroll, isHoveringWaiting, searchQuery]);

  // Execute Fisher-Yates shuffle & 5-second architectural ceremony
  const startDrawProcess = () => {
    if (stage === 'drawing') return;

    // 1. Perform Fisher-Yates shuffle on fresh copy of 500 attendees
    const freshPool = generateAttendees(500);
    const shuffled = [...freshPool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newWinners: Attendee[] = [];
    for (let k = 0; k < TARGET_APARTMENTS.length; k++) {
      shuffled[k] = {
        ...shuffled[k],
        isWinner: true,
        wonApartment: TARGET_APARTMENTS[k],
        rank: k + 1,
        waitRank: null,
      };
      newWinners.push(shuffled[k]);
    }

    const newWaiting: Attendee[] = [];
    for (let m = TARGET_APARTMENTS.length; m < shuffled.length; m++) {
      shuffled[m] = {
        ...shuffled[m],
        isWinner: false,
        wonApartment: null,
        rank: null,
        waitRank: m - TARGET_APARTMENTS.length + 1,
      };
      newWaiting.push(shuffled[m]);
    }

    // Sync full list sorted by original ID for lookup
    const updatedAll = [...newWinners, ...newWaiting].sort((a, b) => a.id - b.id);
    setAttendees(updatedAll);
    setWinnersList(newWinners);
    setWaitingList(newWaiting);

    const nowStr = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    setDrawTimestamp(nowStr);

    // 2. Enter drawing stage
    setStage('drawing');
    let count = 5;
    setCountdownVal('05');
    setProgress(4);
    setVortexStatus('Đang kết nối hệ thống đối soát 500 hồ sơ đặt cọc hợp lệ...');
    playChime(528, 'sine', 0.18, muted);

    // Stream ticker interval
    const streamInterval = setInterval(() => {
      const r1 = freshPool[Math.floor(Math.random() * freshPool.length)];
      const r2 = freshPool[Math.floor(Math.random() * freshPool.length)];
      const apt = TARGET_APARTMENTS[Math.floor(Math.random() * TARGET_APARTMENTS.length)];
      setStreamText(
        `${r1.code} (${r1.receiptCode})  —  ĐỐI SOÁT MÃ CĂN ${apt.code}  ·  ${r2.code}  —  XÁC THỰC HỒ SƠ`
      );
      playChime(320 + Math.random() * 180, 'sine', 0.04, muted);
    }, 110);

    // Progress bar interval
    let currentProg = 4;
    const progressInterval = setInterval(() => {
      if (currentProg < 94) {
        currentProg += 1.8;
        setProgress(Math.min(94, Math.round(currentProg)));
      } else {
        clearInterval(progressInterval);
      }
    }, 100);

    // 5-second countdown
    const countdownInterval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownVal(`0${count}`);
        if (count === 3) {
          setVortexStatus('Đang phân bổ ngẫu nhiên 05 quyền mua căn hộ giới hạn A1 – A5...');
        } else if (count === 1) {
          setVortexStatus('Đang niêm phong thứ tự danh sách ưu tiên Đợt 2 cho 495 khách hàng...');
        }
        playChime(580, 'sine', 0.16, muted);
      } else if (count === 0) {
        clearInterval(countdownInterval);
        setCountdownVal('99%');
        setVortexStatus('Đang khóa chữ ký số và xác lập biên bản phân bổ 500 mã khách hàng...');
        playPulseBeat(muted);

        setTimeout(() => {
          playPulseBeat(muted);
          setCountdownVal('100%');
          setVortexStatus('Hoàn tất đối soát. Đã xác định chính thức 05 chủ nhân quyền mua Đợt 1.');
          setProgress(100);

          setTimeout(() => {
            clearInterval(streamInterval);
            setStage('post');
            playLuxuryChord(muted);
            setTimeout(() => {
              triggerChampagneConfetti(confettiCanvasRef.current);
            }, 120);
          }, 700);
        }, 1100);
      }
    }, 950);
  };

  // Filtered lists for Stage 3
  const filteredWinners = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return winnersList;
    return winnersList.filter(
      (w) =>
        w.code.toLowerCase().includes(q) ||
        w.fullName.toLowerCase().includes(q) ||
        w.phone.toLowerCase().includes(q) ||
        w.receiptCode.toLowerCase().includes(q) ||
        (w.wonApartment && w.wonApartment.id.toLowerCase().includes(q))
    );
  }, [winnersList, searchQuery]);

  const filteredWaiting = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return waitingList;
    return waitingList.filter(
      (att) =>
        att.code.toLowerCase().includes(q) ||
        att.fullName.toLowerCase().includes(q) ||
        att.phone.toLowerCase().includes(q) ||
        att.receiptCode.toLowerCase().includes(q)
    );
  }, [waitingList, searchQuery]);

  const handleExportCSV = () => {
    let csv =
      'STT,Mã Khách Hàng,Mã Phiếu Cọc,Họ Và Tên,Số Điện Thoại,Giờ Check-in,Kết Quả Phân Bổ,Mã Căn Hộ,Tên Căn Hộ,Thời Gian Xác Lập\n';
    const timestamp = drawTimestamp || new Date().toLocaleString('vi-VN');

    winnersList.forEach((w, idx) => {
      csv += `${idx + 1},${w.code},${w.receiptCode},"${w.fullName}",${w.phone},${
        w.checkInTime
      },TRÚNG SUẤT MUA ĐỢT 1,Căn ${w.wonApartment?.id || ''},"${
        w.wonApartment?.name || ''
      }","${timestamp}"\n`;
    });

    waitingList.forEach((att, idx) => {
      csv += `${winnersList.length + idx + 1},${att.code},${att.receiptCode},"${
        att.fullName
      }",${att.phone},${att.checkInTime},DANH SÁCH ƯU TIÊN #${idx + 1},Chưa phân bổ,Đợt 2,"${timestamp}"\n`;
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bien_Ban_Boc_Tham_Aurelia_Residences_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConfirmReset = () => {
    setIsResetConfirmOpen(false);
    setSearchQuery('');
    setActiveTab('all');
    setWinnersList([]);
    setWaitingList([]);
    setAttendees(generateAttendees(500));
    setStage('pre');
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Find winner for a unit if already drawn
  const getWinnerForUnit = (unitId: string): Attendee | null => {
    return winnersList.find((w) => w.wonApartment?.id === unitId) || null;
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F4F1EA] flex flex-col justify-between relative selection:bg-[#C5A880]/30">
      {/* Subtle architectural ambient radial light */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(197, 168, 128, 0.08) 0%, rgba(11, 12, 14, 0) 65%)',
        }}
      />

      {/* Confetti Canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-50"
      />

      {/* =================================================================
          STRICT 3-ZONE TOP BAR CONTRACT
      ================================================================= */}
      <header className="relative z-20 flex items-center justify-between gap-8 px-6 lg:px-12 py-4 border-b border-[#C5A880]/15 bg-[#0B0C0E]/90 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            if (stage === 'post') {
              setActiveTab('all');
            }
          }}
          className="text-lg md:text-xl font-serif font-semibold tracking-[0.18em] text-[#F4F1EA] uppercase whitespace-nowrap shrink-0"
        >
          THE AURELIA RESIDENCES
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wider uppercase text-[#9E9A90]">
          <button
            onClick={() => {
              if (stage === 'post') {
                setSelectedUnitForModal(TARGET_APARTMENTS[0]);
              } else {
                portfolioSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:text-[#F4F1EA] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b border-transparent hover:border-[#C5A880]"
          >
            Danh mục Căn hộ
          </button>
          <button
            onClick={() => {
              if (stage === 'post') {
                setIsResetConfirmOpen(true);
              }
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b ${
              stage === 'pre'
                ? 'text-[#F4F1EA] border-[#C5A880]'
                : 'hover:text-[#F4F1EA] border-transparent hover:border-[#C5A880]'
            }`}
          >
            Hội trường Bốc thăm
          </button>
          <button
            onClick={() => {
              if (stage === 'pre') {
                startDrawProcess();
              } else {
                setActiveTab('all');
              }
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b ${
              stage === 'post'
                ? 'text-[#F4F1EA] border-[#C5A880]'
                : 'hover:text-[#F4F1EA] border-transparent hover:border-[#C5A880]'
            }`}
          >
            Bảng kết quả
          </button>
          <button
            onClick={() => {
              setSelectedAttendeeForCert(null);
              setIsLookupModalOpen(true);
            }}
            className="hover:text-[#F4F1EA] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b border-transparent hover:border-[#C5A880]"
          >
            Tra cứu Mã KH
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          {stage === 'pre' ? (
            <button
              onClick={startDrawProcess}
              className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase bg-[#C5A880] text-[#0B0C0E] hover:bg-[#D6BC96] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Kích hoạt Bốc thăm
            </button>
          ) : (
            <button
              onClick={handleExportCSV}
              className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase bg-[#C5A880] text-[#0B0C0E] hover:bg-[#D6BC96] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Biên bản (.CSV)</span>
            </button>
          )}
        </div>
      </header>

      {/* =================================================================
          MAIN CONTENT VIEWPORT (1440px Baseline)
      ================================================================= */}
      <main className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-6 lg:py-8 flex flex-col justify-between">
        {/* Workspace Operational Sub-Bar (Clean unboxed metadata + Utility Controls) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#C5A880]/15">
          {/* Unboxed Metadata with Typographic Separators (Zero-Pill Rule) */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs tracking-wider uppercase text-[#9E9A90]">
            <span className="text-[#C5A880] font-medium">Đợt Mở Bán Đặc Biệt · Đợt 1</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-[#F4F1EA]">500 Khách hàng đã Check-in</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">05 Suất Quyền Mua Độc Bản</span>
            <span aria-hidden="true">·</span>
            <span>
              {stage === 'pre'
                ? 'Trạng thái: Sẵn sàng khởi động'
                : `Đã khóa biên bản lúc ${drawTimestamp}`}
            </span>
          </div>

          {/* Functional Utility Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="px-3 py-1.5 text-xs text-[#9E9A90] hover:text-[#F4F1EA] border border-[#C5A880]/20 hover:border-[#C5A880]/50 bg-[#121418] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              title={muted ? 'Bật âm thanh sự kiện' : 'Tắt âm thanh sự kiện'}
            >
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{muted ? 'Âm thanh: Tắt' : 'Âm thanh: Bật'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedAttendeeForCert(null);
                setIsLookupModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs text-[#9E9A90] hover:text-[#F4F1EA] border border-[#C5A880]/20 hover:border-[#C5A880]/50 bg-[#121418] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Danh sách 500 KH</span>
            </button>

            <button
              onClick={toggleFullScreen}
              className="px-3 py-1.5 text-xs text-[#9E9A90] hover:text-[#F4F1EA] border border-[#C5A880]/20 hover:border-[#C5A880]/50 bg-[#121418] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Toàn màn hình</span>
            </button>

            {stage === 'post' && (
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-3 py-1.5 text-xs text-[#C5A880] hover:text-[#F4F1EA] border border-[#C5A880]/30 hover:border-[#C5A880] bg-[#121418] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại Phiên mới</span>
              </button>
            )}
          </div>
        </div>

        {/* ===============================================================
            STAGE 1: BEFORE DRAW (ARCHITECTURAL MONOGRAPH & PORTFOLIO)
        =============================================================== */}
        {stage === 'pre' && (
          <div className="flex-1 flex flex-col justify-between gap-8">
            {/* 2-Column Asymmetric Architectural Split Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: Editorial Ceremony Brief & Primary Trigger */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-[#121418] border border-[#C5A880]/20 p-8 lg:p-10">
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880] mb-3">
                    PRIVATE CLIENT ALLOCATION · SAIGON RIVERFRONT
                  </div>
                  <h1
                    className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-medium text-[#F4F1EA] leading-[1.15] tracking-tight mb-4"
                    style={{ textWrap: 'balance' }}
                  >
                    Lễ Bốc Thăm Quyền Mua Bộ Sưu Tập 05 Căn Hộ Giới Hạn
                  </h1>
                  <p className="text-sm md:text-base text-[#9E9A90] leading-relaxed max-w-[65ch] mb-8">
                    Hệ thống phân bổ ngẫu nhiên minh bạch dựa trên thuật toán chuẩn hóa Fisher-Yates.
                    Với một lần kích hoạt duy nhất, hệ thống đồng thời xác định 05 chủ nhân sở hữu
                    quyền mua các căn hộ độc bản <span className="text-[#F4F1EA] font-mono">A1 – A5</span> và
                    xác lập thứ tự ưu tiên Đợt 2 cho 495 khách hàng tham dự.
                  </p>

                  {/* Architectural Key Figures Grid */}
                  <div className="grid grid-cols-3 gap-6 py-5 border-t border-b border-[#C5A880]/15 mb-8">
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-[#9E9A90] mb-1">
                        Hồ sơ hợp lệ
                      </div>
                      <div className="text-2xl lg:text-3xl font-serif font-semibold text-[#F4F1EA] tabular-nums">
                        500 <span className="text-xs font-sans font-normal text-[#9E9A90]">Khách hàng</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-[#9E9A90] mb-1">
                        Quỹ căn mở thưởng
                      </div>
                      <div className="text-2xl lg:text-3xl font-serif font-semibold text-[#C5A880] tabular-nums">
                        05 <span className="text-xs font-sans font-normal text-[#9E9A90]">Căn giới hạn</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-[#9E9A90] mb-1">
                        Danh sách chờ Đợt 2
                      </div>
                      <div className="text-2xl lg:text-3xl font-serif font-semibold text-[#F4F1EA] tabular-nums">
                        495 <span className="text-xs font-sans font-normal text-[#9E9A90]">Suất ưu tiên</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Ceremony Activation Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <button
                    onClick={startDrawProcess}
                    className="px-8 py-4 bg-[#C5A880] hover:bg-[#D6BC96] text-[#0B0C0E] font-semibold text-sm tracking-[0.14em] uppercase transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg"
                  >
                    <span>Kích Hoạt Bốc Thăm Đợt 1</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <div className="text-xs text-[#9E9A90] leading-relaxed">
                    <div>Mã hồ sơ: <span className="font-mono text-[#F4F1EA]">KH-001 → KH-500</span></div>
                    <div>Chế độ: <span className="text-[#C5A880]">1 lần bấm · Khóa kết quả tức thì</span></div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Architectural Elevation Monolith Diagram */}
              <div className="lg:col-span-5 bg-[#121418] border border-[#C5A880]/20 p-6 lg:p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#9E9A90] pb-3 border-b border-[#C5A880]/15">
                  <span className="uppercase tracking-widest font-mono text-[#C5A880]">
                    MẶT ĐỨNG KIẾN TRÚC · THÁP THE AURELIA
                  </span>
                  <span className="font-mono tabular-nums">CAO ĐỘ: +118.5m</span>
                </div>

                {/* Architectural Tower SVG with interactive highlighted floors */}
                <div className="my-4 flex-1 flex items-center justify-center relative min-h-[250px]">
                  <svg
                    viewBox="0 0 420 260"
                    className="w-full h-full max-h-[260px]"
                    fill="none"
                  >
                    {/* Base horizon line */}
                    <line
                      x1="20"
                      y1="242"
                      x2="400"
                      y2="242"
                      stroke="rgba(197, 168, 128, 0.35)"
                      strokeWidth="1"
                    />

                    {/* Vertical Grid Reference Lines */}
                    <line
                      x1="80"
                      y1="15"
                      x2="80"
                      y2="242"
                      stroke="rgba(197, 168, 128, 0.08)"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="230"
                      y1="15"
                      x2="230"
                      y2="242"
                      stroke="rgba(197, 168, 128, 0.08)"
                      strokeDasharray="3 3"
                    />

                    {/* Main Architectural Tower Silhouette */}
                    <rect
                      x="95"
                      y="24"
                      width="120"
                      height="218"
                      stroke="#C5A880"
                      strokeWidth="1.5"
                      fill="rgba(197, 168, 128, 0.03)"
                    />
                    {/* Crown / Penthouse setbacks */}
                    <rect
                      x="110"
                      y="12"
                      width="90"
                      height="12"
                      stroke="#C5A880"
                      strokeWidth="1.2"
                    />
                    {/* Vertical Architectural Mullions */}
                    <line x1="125" y1="24" x2="125" y2="242" stroke="rgba(197, 168, 128, 0.2)" strokeWidth="0.75" />
                    <line x1="155" y1="24" x2="155" y2="242" stroke="rgba(197, 168, 128, 0.2)" strokeWidth="0.75" />
                    <line x1="185" y1="24" x2="185" y2="242" stroke="rgba(197, 168, 128, 0.2)" strokeWidth="0.75" />

                    {/* Highlighted Residences Floors: A5 (T18), A4 (T15), A3 (T12), A2 (T08), A1 (T05) */}
                    {[
                      { unit: TARGET_APARTMENTS[4], y: 42, h: 18, label: 'A5 · TẦNG 18 (110m²)' },
                      { unit: TARGET_APARTMENTS[3], y: 78, h: 13, label: 'A4 · TẦNG 15 (78m²)' },
                      { unit: TARGET_APARTMENTS[2], y: 112, h: 14, label: 'A3 · TẦNG 12 (105m²)' },
                      { unit: TARGET_APARTMENTS[1], y: 152, h: 13, label: 'A2 · TẦNG 08 (92.5m²)' },
                      { unit: TARGET_APARTMENTS[0], y: 188, h: 13, label: 'A1 · TẦNG 05 (85m²)' },
                    ].map((fl) => {
                      const isHovered = hoveredUnitId === fl.unit.id;
                      return (
                        <g
                          key={fl.unit.id}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredUnitId(fl.unit.id)}
                          onClick={() => setSelectedUnitForModal(fl.unit)}
                        >
                          <rect
                            x="95"
                            y={fl.y}
                            width="120"
                            height={fl.h}
                            fill={
                              isHovered
                                ? 'rgba(197, 168, 128, 0.45)'
                                : 'rgba(197, 168, 128, 0.16)'
                            }
                            stroke="#C5A880"
                            strokeWidth={isHovered ? '1.6' : '1'}
                          />
                          <line
                            x1="215"
                            y1={fl.y + fl.h / 2}
                            x2="255"
                            y2={fl.y + fl.h / 2}
                            stroke="#C5A880"
                            strokeWidth={isHovered ? '1.5' : '0.8'}
                          />
                          <circle
                            cx="255"
                            cy={fl.y + fl.h / 2}
                            r="2.5"
                            fill="#C5A880"
                          />
                          <text
                            x="265"
                            y={fl.y + fl.h / 2 + 3.5}
                            fill={isHovered ? '#F4F1EA' : '#C5A880'}
                            fontSize="10"
                            fontFamily="JetBrains Mono, monospace"
                            fontWeight={isHovered ? '600' : '400'}
                          >
                            {fl.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Bottom interactive hint */}
                <div className="pt-3 border-t border-[#C5A880]/15 flex items-center justify-between text-xs text-[#9E9A90]">
                  <span>Chọn tầng trên mặt đứng hoặc thẻ căn hộ để xem bản vẽ</span>
                  <button
                    onClick={() => {
                      const unit =
                        TARGET_APARTMENTS.find((u) => u.id === hoveredUnitId) ||
                        TARGET_APARTMENTS[0];
                      setSelectedUnitForModal(unit);
                    }}
                    className="text-[#C5A880] hover:underline font-medium cursor-pointer whitespace-nowrap"
                  >
                    Xem mặt bằng {hoveredUnitId || 'A1'} →
                  </button>
                </div>
              </div>
            </div>

            {/* Full-Width 5-Column Residence Portfolio Strip */}
            <div ref={portfolioSectionRef}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg md:text-xl font-serif font-semibold tracking-wide text-[#F4F1EA] uppercase">
                    Danh Mục 05 Căn Hộ Độc Bản Mở Thưởng Đợt 1
                  </h2>
                </div>
                <div className="text-xs text-[#9E9A90]">
                  Nhấn vào từng căn hộ để xem chi tiết mặt bằng kỹ thuật 1/100
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {TARGET_APARTMENTS.map((apt) => {
                  const isActive = hoveredUnitId === apt.id;
                  return (
                    <div
                      key={apt.id}
                      onMouseEnter={() => setHoveredUnitId(apt.id)}
                      onClick={() => setSelectedUnitForModal(apt)}
                      className={`group bg-[#121418] border transition-colors p-5 flex flex-col justify-between cursor-pointer ${
                        isActive
                          ? 'border-[#C5A880] bg-[#161920]'
                          : 'border-[#C5A880]/20 hover:border-[#C5A880]/60'
                      }`}
                    >
                      <div>
                        {/* Editorial Numbering & Typology Code (No Pill Badges) */}
                        <div className="flex items-center justify-between text-xs font-mono text-[#9E9A90] mb-3 pb-2 border-b border-[#C5A880]/15">
                          <span className="text-[#C5A880] font-semibold">
                            {apt.indexNumber}. CĂN {apt.id}
                          </span>
                          <span>{apt.code}</span>
                        </div>

                        <h3 className="text-lg font-serif font-semibold text-[#F4F1EA] group-hover:text-[#C5A880] transition-colors mb-1.5">
                          {apt.name}
                        </h3>

                        {/* Unboxed metadata with middle-dot separators */}
                        <div className="text-xs text-[#D6D2C4] font-mono tabular-nums mb-2">
                          {apt.floor} <span aria-hidden="true">·</span> {apt.area}
                        </div>
                        <div className="text-xs text-[#9E9A90] mb-4">
                          {apt.bedrooms} <span aria-hidden="true">·</span> {apt.orientation}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#C5A880]/15 flex items-center justify-between text-xs">
                        <span className="font-mono text-[#C5A880] font-medium tabular-nums">
                          {apt.referencePrice}
                        </span>
                        <span className="text-[#9E9A90] group-hover:text-[#F4F1EA] flex items-center gap-1 transition-colors">
                          <span>Mặt bằng</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===============================================================
            STAGE 3: POST-DRAW OFFICIAL ALLOCATION LEDGER
        =============================================================== */}
        {stage === 'post' && (
          <div className="flex-1 flex flex-col gap-6">
            {/* Results Toolbar: Segmented Filter Buttons + Live Search Input */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Interactive Segmented Filter Controls */}
              <div className="flex items-center gap-1 p-1 bg-[#121418] border border-[#C5A880]/20 self-start">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-[#C5A880] text-[#0B0C0E] font-semibold'
                      : 'text-[#9E9A90] hover:text-[#F4F1EA]'
                  }`}
                >
                  Tất cả Hồ sơ (500)
                </button>
                <button
                  onClick={() => setActiveTab('winners')}
                  className={`px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'winners'
                      ? 'bg-[#C5A880] text-[#0B0C0E] font-semibold'
                      : 'text-[#9E9A90] hover:text-[#F4F1EA]'
                  }`}
                >
                  Trúng Quyền Mua Đợt 1 (05)
                </button>
                <button
                  onClick={() => setActiveTab('waiting')}
                  className={`px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'waiting'
                      ? 'bg-[#C5A880] text-[#0B0C0E] font-semibold'
                      : 'text-[#9E9A90] hover:text-[#F4F1EA]'
                  }`}
                >
                  Danh Sách Ưu Tiên Đợt 2 (495)
                </button>
              </div>

              {/* Search Input Box */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm Mã KH (VD: KH-042), Họ tên, SĐT..."
                  className="w-full bg-[#121418] border border-[#C5A880]/30 focus:border-[#C5A880] text-xs text-[#F4F1EA] pl-10 pr-8 py-2.5 outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E9A90] hover:text-[#F4F1EA] cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>

            {/* 2-Column Split Ledger Board */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
              {/* Left Column: 05 Right-to-Purchase Winners (A1 - A5) */}
              {(activeTab === 'all' || activeTab === 'winners') && (
                <div
                  className={`${
                    activeTab === 'winners' ? 'lg:col-span-12' : 'lg:col-span-7'
                  } bg-[#121418] border border-[#C5A880]/35 p-6 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#C5A880]/20">
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-widest text-[#C5A880]">
                          BIÊN BẢN PHÂN BỔ CHÍNH THỨC · ĐỢT 1
                        </div>
                        <h2 className="text-xl font-serif font-semibold text-[#F4F1EA] mt-0.5">
                          Chủ Nhân Sở Hữu Quyền Mua Căn Hộ Giới Hạn (A1 – A5)
                        </h2>
                      </div>
                      <span className="text-xs font-mono text-[#C5A880] tabular-nums">
                        05 / 05 SUẤT ĐÃ XÁC LẬP
                      </span>
                    </div>

                    {filteredWinners.length === 0 ? (
                      <div className="py-12 text-center text-xs text-[#9E9A90]">
                        Không tìm thấy khách hàng trúng quyền mua khớp với từ khóa &ldquo;{searchQuery}&rdquo;.
                      </div>
                    ) : (
                      <div className="divide-y divide-[#C5A880]/15">
                        {filteredWinners.map((w) => (
                          <div
                            key={w.code}
                            className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-[#161920]/70 px-3 -mx-3 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              {/* Editorial Numerical Index */}
                              <div className="w-10 h-10 border border-[#C5A880]/40 bg-[#0B0C0E] flex items-center justify-center font-mono text-xs font-semibold text-[#C5A880] shrink-0 tabular-nums">
                                0{w.rank}
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-base font-serif font-semibold text-[#F4F1EA]">
                                    {w.fullName}
                                  </h3>
                                  <span aria-hidden="true" className="text-[#9E9A90]">·</span>
                                  <span className="font-mono text-xs text-[#C5A880] font-medium tabular-nums">
                                    {w.code}
                                  </span>
                                  <span aria-hidden="true" className="text-[#9E9A90]">·</span>
                                  <span className="font-mono text-xs text-[#9E9A90] tabular-nums">
                                    {w.phone}
                                  </span>
                                </div>

                                {w.wonApartment && (
                                  <div className="text-xs text-[#9E9A90] mt-1 flex flex-wrap items-center gap-1.5">
                                    <span className="text-[#D6D2C4] font-medium">
                                      {w.wonApartment.name}
                                    </span>
                                    <span aria-hidden="true">·</span>
                                    <span>{w.wonApartment.floor}</span>
                                    <span aria-hidden="true">·</span>
                                    <span className="font-mono tabular-nums">{w.wonApartment.area}</span>
                                    <span aria-hidden="true">·</span>
                                    <span className="font-mono text-[#C5A880] tabular-nums">
                                      {w.wonApartment.referencePrice}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions: Unit Code & Certificate Button */}
                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              {w.wonApartment && (
                                <button
                                  onClick={() => setSelectedUnitForModal(w.wonApartment)}
                                  className="px-3 py-1.5 text-xs font-mono border border-[#C5A880]/30 text-[#F4F1EA] hover:border-[#C5A880] bg-[#0B0C0E] transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  CĂN {w.wonApartment.id}
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedAttendeeForCert(w);
                                  setIsLookupModalOpen(true);
                                }}
                                className="px-3 py-1.5 text-xs font-medium bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] transition-colors cursor-pointer whitespace-nowrap"
                              >
                                Chứng nhận
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary footnote inside winners panel */}
                  <div className="mt-6 pt-3 border-t border-[#C5A880]/15 flex flex-wrap items-center justify-between gap-2 text-xs text-[#9E9A90]">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Kết quả đã được đối soát tự động và lưu trữ biên bản điện tử</span>
                    </span>
                    <span className="font-mono tabular-nums">MÃ PHIÊN: AUR-2026-B1</span>
                  </div>
                </div>
              )}

              {/* Right Column: 495 Priority Waiting List for Phase 2 */}
              {(activeTab === 'all' || activeTab === 'waiting') && (
                <div
                  className={`${
                    activeTab === 'waiting' ? 'lg:col-span-12' : 'lg:col-span-5'
                  } bg-[#121418] border border-[#C5A880]/20 p-6 flex flex-col justify-between h-[500px] lg:h-[520px]`}
                >
                  <div className="flex items-center justify-between gap-2 pb-4 mb-3 border-b border-[#C5A880]/15">
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-widest text-[#9E9A90]">
                         BẢNG NIÊM YẾT THỨ TỰ ƯU TIÊN
                      </div>
                      <h2 className="text-lg font-serif font-semibold text-[#F4F1EA] mt-0.5">
                        Danh Sách Chờ Đợt 2 ({filteredWaiting.length} Khách Hàng)
                      </h2>
                    </div>

                    <button
                      onClick={() => setAutoScroll(!autoScroll)}
                      className="px-2.5 py-1 text-[11px] font-mono text-[#9E9A90] hover:text-[#F4F1EA] border border-[#C5A880]/20 bg-[#0B0C0E] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      {autoScroll ? (
                        <>
                          <Pause className="w-3 h-3 text-[#C5A880]" />
                          <span>Tạm dừng cuộn</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-[#C5A880]" />
                          <span>Tự động cuộn</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Table Column Headers */}
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-[#9E9A90] border-b border-[#C5A880]/15 bg-[#0D0F12]">
                    <div className="col-span-2">Thứ tự</div>
                    <div className="col-span-3">Mã KH</div>
                    <div className="col-span-4">Họ và tên</div>
                    <div className="col-span-3 text-right">Số ĐT</div>
                  </div>

                  {/* Scrollable High-Density Tabular Ledger */}
                  <div
                    ref={waitingContainerRef}
                    onMouseEnter={() => setIsHoveringWaiting(true)}
                    onMouseLeave={() => setIsHoveringWaiting(false)}
                    className="flex-1 overflow-y-auto divide-y divide-[#C5A880]/10 pr-1"
                  >
                    {filteredWaiting.length === 0 ? (
                      <div className="py-12 text-center text-xs text-[#9E9A90]">
                        Không tìm thấy hồ sơ trong danh sách chờ khớp với &ldquo;{searchQuery}&rdquo;.
                      </div>
                    ) : (
                      filteredWaiting.map((att) => (
                        <div
                          key={att.code}
                          onClick={() => {
                            setSelectedAttendeeForCert(att);
                            setIsLookupModalOpen(true);
                          }}
                          className="grid grid-cols-12 gap-2 px-3 py-2.5 text-xs items-center hover:bg-[#181B22] transition-colors cursor-pointer"
                        >
                          <div className="col-span-2 font-mono text-[#9E9A90] tabular-nums">
                            #{String(att.waitRank).padStart(3, '0')}
                          </div>
                          <div className="col-span-3 font-mono text-[#C5A880] tabular-nums">
                            {att.code}
                          </div>
                          <div className="col-span-4 font-medium text-[#F4F1EA] truncate">
                            {att.fullName}
                          </div>
                          <div className="col-span-3 font-mono text-[#9E9A90] text-right tabular-nums">
                            {att.phone}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#C5A880]/15 flex items-center justify-between text-[11px] text-[#9E9A90]">
                    <span>Nhấn vào dòng bất kỳ để trích xuất chứng nhận ưu tiên</span>
                    <span className="font-mono tabular-nums">495 / 500 HỒ SƠ</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* =================================================================
          STAGE 2: MINIMALIST CRYPTOGRAPHIC SUSPENSE OVERLAY
      ================================================================= */}
      {stage === 'drawing' && (
        <div className="fixed inset-0 z-50 bg-[#0B0C0E]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
          <div className="max-w-xl w-full text-center">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5A880] mb-4">
              HỆ THỐNG PHÂN BỔ QUYỀN MUA ĐỘC LẬP · THE AURELIA
            </div>

            {/* Large Tabular Serif Countdown */}
            <div className="text-7xl sm:text-8xl md:text-9xl font-serif font-normal text-[#F4F1EA] tracking-tight tabular-nums my-4">
              {countdownVal}
            </div>

            <div className="text-sm md:text-base font-serif italic text-[#D6D2C4] mb-8">
              {vortexStatus}
            </div>

            {/* Minimalist 1px Champagne Progress Line */}
            <div className="w-full h-1 bg-[#1A1D24] overflow-hidden mb-6">
              <div
                className="h-full bg-[#C5A880] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Monospace Verification Stream */}
            <div className="py-3 px-4 border border-[#C5A880]/20 bg-[#111317] font-mono text-xs text-[#9E9A90] tabular-nums truncate">
              {streamText}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          QUIET INSTITUTIONAL FOOTER WITH QR LOOKUP TRIGGER
      ================================================================= */}
      <footer className="relative z-10 border-t border-[#C5A880]/15 bg-[#0B0C0E] px-6 lg:px-12 py-4">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9E9A90]">
          <div className="flex flex-wrap items-center gap-2.5">
            <span>Đơn vị tổ chức: <strong className="text-[#F4F1EA] font-medium">Aurelia Development &amp; Ban Quản Lý Dự Án</strong></span>
            <span aria-hidden="true">·</span>
            <span>Thuật toán phân bổ: <strong className="text-[#C5A880] font-medium">Fisher-Yates 100% Minh Bạch</strong></span>
          </div>

          <button
            onClick={() => {
              setSelectedAttendeeForCert(null);
              setIsLookupModalOpen(true);
            }}
            className="flex items-center gap-3 px-4 py-2 bg-[#121418] border border-[#C5A880]/30 hover:border-[#C5A880] transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#C5A880]" />
            <div className="text-left">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#F4F1EA]">
                Tra cứu Kết quả Cá nhân &amp; QR
              </div>
              <div className="text-[10px] text-[#9E9A90]">
                Kiểm tra Mã KH (KH-001 → KH-500) &amp; Tải Biên bản
              </div>
            </div>
          </button>
        </div>
      </footer>

      {/* =================================================================
          MODALS: FLOORPLAN DOSSIER, CERTIFICATE LOOKUP, RESET CONFIRM
      ================================================================= */}
      <FloorplanModal
        unit={selectedUnitForModal}
        winner={selectedUnitForModal ? getWinnerForUnit(selectedUnitForModal.id) : null}
        onClose={() => setSelectedUnitForModal(null)}
        onOpenCertificate={(winner) => {
          setSelectedAttendeeForCert(winner);
          setIsLookupModalOpen(true);
        }}
      />

      {isLookupModalOpen && (
        <CertificateModal
          selectedAttendee={selectedAttendeeForCert}
          allAttendees={attendees}
          isDrawn={stage === 'post'}
          drawTimestamp={drawTimestamp}
          onClose={() => setIsLookupModalOpen(false)}
          onSelectAttendee={(att) => setSelectedAttendeeForCert(att)}
        />
      )}

      {/* Custom In-App Confirmation Modal for Resetting Ceremony */}
      {isResetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setIsResetConfirmOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#121418] border border-[#C5A880]/40 p-6 text-[#F4F1EA] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-mono uppercase tracking-widest text-[#C5A880] mb-2">
              XÁC NHẬN KHỞI TẠO LẠI PHIÊN BỐC THĂM
            </div>
            <h3 className="text-xl font-serif font-semibold mb-2">
              Quay lại Bước 1 để chuẩn bị lượt bốc thăm mới?
            </h3>
            <p className="text-xs text-[#9E9A90] leading-relaxed mb-6">
              Dữ liệu phân bổ hiện tại của 500 khách hàng sẽ được đặt lại về trạng thái chờ khởi
              động. Hãy đảm bảo bạn đã xuất biên bản (.CSV) nếu cần lưu trữ kết quả vừa rồi.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#9E9A90] hover:text-[#F4F1EA] border border-[#C5A880]/20 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#C5A880] text-[#0B0C0E] hover:bg-[#D6BC96] transition-colors cursor-pointer"
              >
                Xác nhận Đặt lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
