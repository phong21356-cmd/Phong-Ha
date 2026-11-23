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
import { HouseIcon } from './components/Illustrations';
import { UnitCard } from './components/UnitCard';
import buildingImg from './assets/building.webp';

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
          setVortexStatus('Đang xếp ngẫu nhiên 05 căn loại A1 – A5...');
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
          setVortexStatus('Hoàn tất đối soát. Đã xác định chính thức 05 hồ sơ được xếp căn Đợt 1.');
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
    link.setAttribute('download', `Bien_Ban_Boc_Tham_An_Phuc_Imperia_${Date.now()}.csv`);
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
    <div className="min-h-screen bg-[#0B1118] text-[#FAFAFA] flex flex-col justify-between relative selection:bg-[#D4AE59]/30">
      {/* Subtle architectural ambient radial light */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(212, 174, 89, 0.08) 0%, rgba(11, 17, 24, 0) 65%)',
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
      <header className="relative z-20 flex items-center justify-between gap-8 px-6 lg:px-12 py-4 border-b border-[#D4AE59]/15 bg-[#0B1118]/90 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            if (stage === 'post') {
              setActiveTab('all');
            }
          }}
          className="text-lg md:text-xl font-sans font-semibold tracking-[0.18em] text-[#FAFAFA] uppercase whitespace-nowrap shrink-0"
        >
          AN PHÚC IMPERIA
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wider uppercase text-[#A3A3A3]">
          <button
            onClick={() => {
              if (stage === 'post') {
                setSelectedUnitForModal(TARGET_APARTMENTS[0]);
              } else {
                portfolioSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:text-[#FAFAFA] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b border-transparent hover:border-[#D4AE59]"
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
                ? 'text-[#FAFAFA] border-[#D4AE59]'
                : 'hover:text-[#FAFAFA] border-transparent hover:border-[#D4AE59]'
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
                ? 'text-[#FAFAFA] border-[#D4AE59]'
                : 'hover:text-[#FAFAFA] border-transparent hover:border-[#D4AE59]'
            }`}
          >
            Bảng kết quả
          </button>
          <button
            onClick={() => {
              setSelectedAttendeeForCert(null);
              setIsLookupModalOpen(true);
            }}
            className="hover:text-[#FAFAFA] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b border-transparent hover:border-[#D4AE59]"
          >
            Tra cứu Mã KH
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          {stage === 'pre' ? (
            <button
              onClick={startDrawProcess}
              className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase bg-[#D4AE59] text-[#0B1118] hover:bg-[#E8CC83] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Kích hoạt Bốc thăm
            </button>
          ) : (
            <button
              onClick={handleExportCSV}
              className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase bg-[#D4AE59] text-[#0B1118] hover:bg-[#E8CC83] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
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
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#D4AE59]/15">
          {/* Unboxed Metadata with Typographic Separators (Zero-Pill Rule) */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs tracking-wider uppercase text-[#A3A3A3]">
            <span className="text-[#D4AE59] font-medium">Đợt mở bán · Đợt 1</span>
            <span aria-hidden="true">·</span>
            <span className="font-sans tabular-nums text-[#FAFAFA]">500 Khách hàng đã Check-in</span>
            <span aria-hidden="true">·</span>
            <span className="font-sans tabular-nums">05 căn mẫu A1 – A5</span>
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
              className="px-3 py-1.5 text-xs text-[#A3A3A3] hover:text-[#FAFAFA] border border-[#D4AE59]/20 hover:border-[#D4AE59]/50 bg-[#101921] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
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
              className="px-3 py-1.5 text-xs text-[#A3A3A3] hover:text-[#FAFAFA] border border-[#D4AE59]/20 hover:border-[#D4AE59]/50 bg-[#101921] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#D4AE59]" />
              <span>Danh sách 500 KH</span>
            </button>

            <button
              onClick={toggleFullScreen}
              className="px-3 py-1.5 text-xs text-[#A3A3A3] hover:text-[#FAFAFA] border border-[#D4AE59]/20 hover:border-[#D4AE59]/50 bg-[#101921] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Toàn màn hình</span>
            </button>

            {stage === 'post' && (
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-3 py-1.5 text-xs text-[#D4AE59] hover:text-[#FAFAFA] border border-[#D4AE59]/30 hover:border-[#D4AE59] bg-[#101921] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
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
            <div className="grid grid-cols-1 gap-8 items-stretch">
              {/* Left Column: Editorial Ceremony Brief & Primary Trigger */}
              <div className="relative overflow-hidden flex flex-col justify-between gap-10 bg-[#101921] border border-[#D4AE59]/20 p-8 lg:p-12">
                <img src={buildingImg} alt="Tòa nhà ở xã hội An Phúc Imperia" className="pointer-events-none select-none absolute right-4 lg:right-10 bottom-[110px] hidden md:block w-[320px] lg:w-[520px]" />
                <div className="relative z-10 max-w-[760px]">
                  <div className="flex items-center gap-2 text-xs font-sans tabular-nums uppercase tracking-[0.2em] text-[#D4AE59] mb-3">
                    <HouseIcon className="w-5 h-5" />
                    NHÀ Ở XÃ HỘI · ĐỢT 1
                  </div>
                  <h1
                    className="text-3xl sm:text-4xl lg:text-[44px] font-sans font-medium text-[#FAFAFA] leading-[1.15] tracking-tight mb-4"
                    style={{ textWrap: 'balance' }}
                  >
                    Lễ bốc thăm xếp căn nhà ở xã hội An Phúc Imperia
                  </h1>
                  <p className="text-sm md:text-base text-[#A3A3A3] leading-relaxed max-w-[65ch] mb-8">
                    Hệ thống xếp ngẫu nhiên minh bạch dựa trên thuật toán Fisher-Yates.
                    Với một lần kích hoạt duy nhất, hệ thống đồng thời xác định 05 hồ sơ được xếp
                    căn loại <span className="text-[#FAFAFA] font-sans tabular-nums">A1 – A5</span> và
                    xác lập thứ tự ưu tiên Đợt 2 cho 495 khách hàng tham dự.
                  </p>

                  {/* Architectural Key Figures Grid */}
                  <div className="grid grid-cols-3 gap-6 py-5 border-t border-b border-[#D4AE59]/15 mb-8">
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-[#A3A3A3] mb-1">
                        Hồ sơ hợp lệ
                      </div>
                      <div className="text-2xl lg:text-3xl font-sans font-semibold text-[#FAFAFA] tabular-nums">
                        500 <span className="text-xs font-sans font-normal text-[#A3A3A3]">Khách hàng</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-[#A3A3A3] mb-1">
                        Quỹ căn mở bốc thăm
                      </div>
                      <div className="text-2xl lg:text-3xl font-sans font-semibold text-[#D4AE59] tabular-nums">
                        05 <span className="text-xs font-sans font-normal text-[#A3A3A3]">Căn mẫu</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-[#A3A3A3] mb-1">
                        Danh sách chờ Đợt 2
                      </div>
                      <div className="text-2xl lg:text-3xl font-sans font-semibold text-[#FAFAFA] tabular-nums">
                        495 <span className="text-xs font-sans font-normal text-[#A3A3A3]">Hồ sơ chờ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Ceremony Activation Bar */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-[#D4AE59]/15">
                  <button
                    onClick={startDrawProcess}
                    className="sm:flex-1 px-8 py-4 bg-[#D4AE59] hover:bg-[#E8CC83] text-[#0B1118] font-semibold text-sm tracking-[0.14em] uppercase transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg"
                  >
                    <span>Kích Hoạt Bốc Thăm Đợt 1</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <div className="text-xs text-[#A3A3A3] leading-relaxed">
                    <div>Mã hồ sơ: <span className="font-sans tabular-nums text-[#FAFAFA]">KH-001 → KH-500</span></div>
                    <div>Chế độ: <span className="text-[#D4AE59]">1 lần bấm · Khóa kết quả tức thì</span></div>
                  </div>
                </div>
              </div>

            </div>

            {/* Full-Width 5-Column Residence Portfolio Strip */}
            <div ref={portfolioSectionRef}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg md:text-xl font-sans font-semibold tracking-wide text-[#FAFAFA] uppercase">
                    Danh mục 05 loại căn mở bốc thăm Đợt 1
                  </h2>
                </div>
                <div className="text-xs text-[#A3A3A3]">
                  Nhấn vào từng căn hộ để xem chi tiết mặt bằng kỹ thuật 1/100
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {TARGET_APARTMENTS.map((apt) => (
                  <UnitCard
                    key={apt.id}
                    id={apt.id}
                    active={hoveredUnitId === apt.id}
                    onHover={() => setHoveredUnitId(apt.id)}
                    onOpen={() => setSelectedUnitForModal(apt)}
                  />
                ))}
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
              <div className="flex items-center gap-1 p-1 bg-[#101921] border border-[#D4AE59]/20 self-start">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-[#D4AE59] text-[#0B1118] font-semibold'
                      : 'text-[#A3A3A3] hover:text-[#FAFAFA]'
                  }`}
                >
                  Tất cả Hồ sơ (500)
                </button>
                <button
                  onClick={() => setActiveTab('winners')}
                  className={`px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'winners'
                      ? 'bg-[#D4AE59] text-[#0B1118] font-semibold'
                      : 'text-[#A3A3A3] hover:text-[#FAFAFA]'
                  }`}
                >
                  Trúng Quyền Mua Đợt 1 (05)
                </button>
                <button
                  onClick={() => setActiveTab('waiting')}
                  className={`px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'waiting'
                      ? 'bg-[#D4AE59] text-[#0B1118] font-semibold'
                      : 'text-[#A3A3A3] hover:text-[#FAFAFA]'
                  }`}
                >
                  Danh Sách Ưu Tiên Đợt 2 (495)
                </button>
              </div>

              {/* Search Input Box */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#D4AE59] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm Mã KH (VD: KH-042), Họ tên, SĐT..."
                  className="w-full bg-[#101921] border border-[#D4AE59]/30 focus:border-[#D4AE59] text-xs text-[#FAFAFA] pl-10 pr-8 py-2.5 outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A3A3A3] hover:text-[#FAFAFA] cursor-pointer"
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
                  } bg-[#101921] border border-[#D4AE59]/35 p-6 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#D4AE59]/20">
                      <div>
                        <div className="text-[11px] font-sans tabular-nums uppercase tracking-widest text-[#D4AE59]">
                          BIÊN BẢN PHÂN BỔ CHÍNH THỨC · ĐỢT 1
                        </div>
                        <h2 className="text-xl font-sans font-semibold text-[#FAFAFA] mt-0.5">
                          Hồ sơ được xếp căn loại A1 – A5
                        </h2>
                      </div>
                      <span className="text-xs font-sans tabular-nums text-[#D4AE59] tabular-nums">
                        05 / 05 CĂN ĐÃ XẾP
                      </span>
                    </div>

                    {filteredWinners.length === 0 ? (
                      <div className="py-12 text-center text-xs text-[#A3A3A3]">
                        Không tìm thấy khách hàng trúng quyền mua khớp với từ khóa &ldquo;{searchQuery}&rdquo;.
                      </div>
                    ) : (
                      <div className="divide-y divide-[#D4AE59]/15">
                        {filteredWinners.map((w) => (
                          <div
                            key={w.code}
                            className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-[#16212B]/70 px-3 -mx-3 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              {/* Editorial Numerical Index */}
                              <div className="w-10 h-10 border border-[#D4AE59]/40 bg-[#0B1118] flex items-center justify-center font-sans tabular-nums text-xs font-semibold text-[#D4AE59] shrink-0 tabular-nums">
                                0{w.rank}
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-base font-sans font-semibold text-[#FAFAFA]">
                                    {w.fullName}
                                  </h3>
                                  <span aria-hidden="true" className="text-[#A3A3A3]">·</span>
                                  <span className="font-sans tabular-nums text-xs text-[#D4AE59] font-medium tabular-nums">
                                    {w.code}
                                  </span>
                                  <span aria-hidden="true" className="text-[#A3A3A3]">·</span>
                                  <span className="font-sans tabular-nums text-xs text-[#A3A3A3] tabular-nums">
                                    {w.phone}
                                  </span>
                                </div>

                                {w.wonApartment && (
                                  <div className="text-xs text-[#A3A3A3] mt-1 flex flex-wrap items-center gap-1.5">
                                    <span className="text-[#D4D4D4] font-medium">
                                      {w.wonApartment.name}
                                    </span>
                                    <span aria-hidden="true">·</span>
                                    <span>{w.wonApartment.floor}</span>
                                    <span aria-hidden="true">·</span>
                                    <span className="font-sans tabular-nums">{w.wonApartment.area}</span>
                                    <span aria-hidden="true">·</span>
                                    <span className="font-sans tabular-nums text-[#D4AE59] tabular-nums">
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
                                  className="px-3 py-1.5 text-xs font-sans tabular-nums border border-[#D4AE59]/30 text-[#FAFAFA] hover:border-[#D4AE59] bg-[#0B1118] transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  CĂN {w.wonApartment.id}
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedAttendeeForCert(w);
                                  setIsLookupModalOpen(true);
                                }}
                                className="px-3 py-1.5 text-xs font-medium bg-[#D4AE59]/15 border border-[#D4AE59]/40 text-[#D4AE59] hover:bg-[#D4AE59] hover:text-[#0B1118] transition-colors cursor-pointer whitespace-nowrap"
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
                  <div className="mt-6 pt-3 border-t border-[#D4AE59]/15 flex flex-wrap items-center justify-between gap-2 text-xs text-[#A3A3A3]">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#D4AE59]" />
                      <span>Kết quả đã được đối soát tự động và lưu trữ biên bản điện tử</span>
                    </span>
                    <span className="font-sans tabular-nums">MÃ PHIÊN: AP-2026-D1</span>
                  </div>
                </div>
              )}

              {/* Right Column: 495 Priority Waiting List for Phase 2 */}
              {(activeTab === 'all' || activeTab === 'waiting') && (
                <div
                  className={`${
                    activeTab === 'waiting' ? 'lg:col-span-12' : 'lg:col-span-5'
                  } bg-[#101921] border border-[#D4AE59]/20 p-6 flex flex-col justify-between h-[500px] lg:h-[520px]`}
                >
                  <div className="flex items-center justify-between gap-2 pb-4 mb-3 border-b border-[#D4AE59]/15">
                    <div>
                      <div className="text-[11px] font-sans tabular-nums uppercase tracking-widest text-[#A3A3A3]">
                         BẢNG NIÊM YẾT THỨ TỰ ƯU TIÊN
                      </div>
                      <h2 className="text-lg font-sans font-semibold text-[#FAFAFA] mt-0.5">
                        Danh Sách Chờ Đợt 2 ({filteredWaiting.length} Khách Hàng)
                      </h2>
                    </div>

                    <button
                      onClick={() => setAutoScroll(!autoScroll)}
                      className="px-2.5 py-1 text-[11px] font-sans tabular-nums text-[#A3A3A3] hover:text-[#FAFAFA] border border-[#D4AE59]/20 bg-[#0B1118] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      {autoScroll ? (
                        <>
                          <Pause className="w-3 h-3 text-[#D4AE59]" />
                          <span>Tạm dừng cuộn</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-[#D4AE59]" />
                          <span>Tự động cuộn</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Table Column Headers */}
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[11px] font-sans tabular-nums uppercase tracking-wider text-[#A3A3A3] border-b border-[#D4AE59]/15 bg-[#0B1118]">
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
                    className="flex-1 overflow-y-auto divide-y divide-[#D4AE59]/10 pr-1"
                  >
                    {filteredWaiting.length === 0 ? (
                      <div className="py-12 text-center text-xs text-[#A3A3A3]">
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
                          className="grid grid-cols-12 gap-2 px-3 py-2.5 text-xs items-center hover:bg-[#16212B] transition-colors cursor-pointer"
                        >
                          <div className="col-span-2 font-sans tabular-nums text-[#A3A3A3] tabular-nums">
                            #{String(att.waitRank).padStart(3, '0')}
                          </div>
                          <div className="col-span-3 font-sans tabular-nums text-[#D4AE59] tabular-nums">
                            {att.code}
                          </div>
                          <div className="col-span-4 font-medium text-[#FAFAFA] truncate">
                            {att.fullName}
                          </div>
                          <div className="col-span-3 font-sans tabular-nums text-[#A3A3A3] text-right tabular-nums">
                            {att.phone}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#D4AE59]/15 flex items-center justify-between text-[11px] text-[#A3A3A3]">
                    <span>Nhấn vào dòng bất kỳ để trích xuất chứng nhận ưu tiên</span>
                    <span className="font-sans tabular-nums">495 / 500 HỒ SƠ</span>
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
        <div className="fixed inset-0 z-50 bg-[#0B1118]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
          <div className="max-w-xl w-full text-center">
            <div className="text-xs font-sans tabular-nums uppercase tracking-[0.25em] text-[#D4AE59] mb-4">
              HỆ THỐNG XẾP CĂN ĐỘC LẬP · AN PHÚC IMPERIA
            </div>

            {/* Large Tabular Serif Countdown */}
            <div className="text-7xl sm:text-8xl md:text-9xl font-sans font-normal text-[#FAFAFA] tracking-tight tabular-nums my-4">
              {countdownVal}
            </div>

            <div className="text-sm md:text-base font-sans italic text-[#D4D4D4] mb-8">
              {vortexStatus}
            </div>

            {/* Minimalist 1px Champagne Progress Line */}
            <div className="w-full h-1 bg-[#16212B] overflow-hidden mb-6">
              <div
                className="h-full bg-[#D4AE59] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Monospace Verification Stream */}
            <div className="py-3 px-4 border border-[#D4AE59]/20 bg-[#101921] font-sans tabular-nums text-xs text-[#A3A3A3] tabular-nums truncate">
              {streamText}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          QUIET INSTITUTIONAL FOOTER WITH QR LOOKUP TRIGGER
      ================================================================= */}
      <footer className="relative z-10 border-t border-[#D4AE59]/15 bg-[#0B1118] px-6 lg:px-12 py-4">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3A3A3]">
          <div className="flex flex-wrap items-center gap-2.5">
            <span>Đơn vị tổ chức: <strong className="text-[#FAFAFA] font-medium">An Phúc Imperia &amp; Ban Quản Lý Dự Án</strong></span>
            <span aria-hidden="true">·</span>
            <span>Thuật toán phân bổ: <strong className="text-[#D4AE59] font-medium">Fisher-Yates minh bạch, có lưu vết</strong></span>
          </div>

          <button
            onClick={() => {
              setSelectedAttendeeForCert(null);
              setIsLookupModalOpen(true);
            }}
            className="flex items-center gap-3 px-4 py-2 bg-[#101921] border border-[#D4AE59]/30 hover:border-[#D4AE59] transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#D4AE59]" />
            <div className="text-left">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#FAFAFA]">
                Tra cứu Kết quả Cá nhân &amp; QR
              </div>
              <div className="text-[10px] text-[#A3A3A3]">
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
            className="w-full max-w-md bg-[#101921] border border-[#D4AE59]/40 p-6 text-[#FAFAFA] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-sans tabular-nums uppercase tracking-widest text-[#D4AE59] mb-2">
              XÁC NHẬN KHỞI TẠO LẠI PHIÊN BỐC THĂM
            </div>
            <h3 className="text-xl font-sans font-semibold mb-2">
              Quay lại Bước 1 để chuẩn bị lượt bốc thăm mới?
            </h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed mb-6">
              Dữ liệu phân bổ hiện tại của 500 khách hàng sẽ được đặt lại về trạng thái chờ khởi
              động. Hãy đảm bảo bạn đã xuất biên bản (.CSV) nếu cần lưu trữ kết quả vừa rồi.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#A3A3A3] hover:text-[#FAFAFA] border border-[#D4AE59]/20 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#D4AE59] text-[#0B1118] hover:bg-[#E8CC83] transition-colors cursor-pointer"
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
