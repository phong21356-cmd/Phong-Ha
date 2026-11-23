export interface ApartmentUnit {
  id: string;
  indexNumber: string;
  code: string;
  name: string;
  floor: string;
  area: string;
  bedrooms: string;
  orientation: string;
  referencePrice: string;
  highlights: string;
  desc: string;
  rooms: { label: string; area: string }[];
}

export interface Attendee {
  id: number;
  code: string;
  receiptCode: string;
  fullName: string;
  phone: string;
  checkInTime: string;
  advisor: string;
  isWinner: boolean;
  wonApartment: ApartmentUnit | null;
  rank: number | null;
  waitRank: number | null;
}

export const TARGET_APARTMENTS: ApartmentUnit[] = [
  {
    id: 'A1',
    indexNumber: '01',
    code: 'TYP-A1-05',
    name: 'Sky Villa Sông Sài Gòn',
    floor: 'Tầng 05',
    area: '85.0 m²',
    bedrooms: '3 Phòng ngủ',
    orientation: 'Đông Nam · Trực diện Sông',
    referencePrice: '18.5 Tỷ VNĐ',
    highlights: 'Sảnh đón riêng · Ban công kính tràn viền 8.4m',
    desc: 'Tầng 05 · 85.0 m² · 3 Phòng ngủ · View Sông',
    rooms: [
      { label: 'Phòng khách & Phòng ăn', area: '34.5 m²' },
      { label: 'Phòng ngủ Master', area: '21.0 m²' },
      { label: 'Phòng ngủ 02 & 03', area: '20.5 m²' },
      { label: 'Loggia & Ban công cảnh quan', area: '9.0 m²' },
    ],
  },
  {
    id: 'A2',
    indexNumber: '02',
    code: 'TYP-A2-08',
    name: 'Corner Suite Panorama',
    floor: 'Tầng 08',
    area: '92.5 m²',
    bedrooms: '3 Phòng ngủ · Căn góc',
    orientation: 'Đông Bắc – Đông Nam',
    referencePrice: '21.2 Tỷ VNĐ',
    highlights: 'Căn góc 2 mặt thoáng · Kính Low-E kịch trần 3.4m',
    desc: 'Tầng 08 · 92.5 m² · 3 Phòng ngủ · Căn góc',
    rooms: [
      { label: 'Grand Salon góc 270°', area: '38.0 m²' },
      { label: 'Phòng ngủ Master + Walk-in Closet', area: '24.5 m²' },
      { label: 'Phòng ngủ 02 & 03', area: '21.0 m²' },
      { label: 'Bếp đóng & Sân phơi riêng', area: '9.0 m²' },
    ],
  },
  {
    id: 'A3',
    indexNumber: '03',
    code: 'TYP-A3-12',
    name: 'Skyline Penthouse Mini',
    floor: 'Tầng 12',
    area: '105.0 m²',
    bedrooms: '3 Phòng ngủ + Private Study',
    orientation: 'Hướng Nam · Tầm nhìn Skyline',
    referencePrice: '26.8 Tỷ VNĐ',
    highlights: 'Trần cao 3.8m · Phòng làm việc riêng biệt',
    desc: 'Tầng 12 · 105.0 m² · Penthouse Mini · View Sky',
    rooms: [
      { label: 'Phòng khách & Wine Lounge', area: '42.0 m²' },
      { label: 'Master Suite & Bồn tắm đá tự nhiên', area: '28.0 m²' },
      { label: 'Phòng làm việc / Thư viện riêng', area: '12.5 m²' },
      { label: '2 Phòng ngủ phụ & Loggia', area: '22.5 m²' },
    ],
  },
  {
    id: 'A4',
    indexNumber: '04',
    code: 'TYP-A4-15',
    name: 'Botanical Loggia Residence',
    floor: 'Tầng 15',
    area: '78.0 m²',
    bedrooms: '2 Phòng ngủ Master',
    orientation: 'Đông Nam · Vườn treo nội khu',
    referencePrice: '16.9 Tỷ VNĐ',
    highlights: 'Ban công vườn nhiệt đới 12m² · Thiết kế Dual-Master',
    desc: 'Tầng 15 · 78.0 m² · 2 Phòng ngủ · Ban công rộng',
    rooms: [
      { label: 'Không gian Sinh hoạt chung', area: '31.0 m²' },
      { label: 'Master Suite 01', area: '19.5 m²' },
      { label: 'Master Suite 02', area: '15.5 m²' },
      { label: 'Vườn treo Loggia Panorama', area: '12.0 m²' },
    ],
  },
  {
    id: 'A5',
    indexNumber: '05',
    code: 'TYP-A5-18',
    name: 'The Aurelia Royal Duplex',
    floor: 'Tầng 18–19',
    area: '110.0 m²',
    bedrooms: 'Duplex Thông tầng · 3 PN',
    orientation: 'Đông Nam · Tầm nhìn Hoàng Gia',
    referencePrice: '32.5 Tỷ VNĐ',
    highlights: 'Thông tầng 6.8m · Thang máy định danh riêng',
    desc: 'Tầng 18 · 110.0 m² · Duplex · Vị trí Hoàng Gia',
    rooms: [
      { label: 'Sảnh thông tầng Double-Height 6.8m', area: '45.0 m²' },
      { label: 'Royal Master Penthouse (Tầng 2)', area: '32.0 m²' },
      { label: '2 Phòng ngủ Deluxe & Sảnh thang máy', area: '23.0 m²' },
      { label: 'Sky Terrace & Bar ngoài trời', area: '10.0 m²' },
    ],
  },
];

const HO_NAMES = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ',
  'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'
];

const DEM_NAMES = [
  'Văn', 'Thị', 'Hồng', 'Đức', 'Minh', 'Thu', 'Ngọc', 'Thanh',
  'Quốc', 'Anh', 'Tuấn', 'Hoàng', 'Gia', 'Khánh', 'Bảo', 'Phương'
];

const TEN_NAMES = [
  'An', 'Bình', 'Cường', 'Dũng', 'Giang', 'Hải', 'Hương', 'Huy',
  'Khánh', 'Linh', 'Long', 'Mai', 'Nam', 'Nga', 'Phong', 'Phúc',
  'Quân', 'Sơn', 'Thắng', 'Thảo', 'Tùng', 'Vinh', 'Yến', 'Châu',
  'Đạt', 'Hà', 'Kiên', 'Lâm', 'Minh', 'Nhung', 'Oanh', 'Quỳnh'
];

const PREFIXES = ['090', '091', '098', '097', '093', '094', '088', '089'];
const ADVISORS = [
  'Private Desk 01',
  'Private Desk 02',
  'Private Desk 03',
  'Private Desk 04',
  'Private Desk 05',
  'Private Desk 06',
];

// Deterministic seeded generator so the 500 guests look authentic and consistent
function seededValue(seed: number): number {
  const x = Math.sin(seed * 9999.13) * 10000;
  return x - Math.floor(x);
}

export function generateAttendees(count = 500): Attendee[] {
  const list: Attendee[] = [];
  for (let i = 1; i <= count; i++) {
    const r1 = seededValue(i * 3 + 1);
    const r2 = seededValue(i * 7 + 2);
    const r3 = seededValue(i * 11 + 3);
    const r4 = seededValue(i * 17 + 4);
    const r5 = seededValue(i * 23 + 5);

    const ho = HO_NAMES[Math.floor(r1 * HO_NAMES.length)];
    const dem = DEM_NAMES[Math.floor(r2 * DEM_NAMES.length)];
    const ten = TEN_NAMES[Math.floor(r3 * TEN_NAMES.length)];
    const pre = PREFIXES[Math.floor(r4 * PREFIXES.length)];
    const last4 = Math.floor(1000 + r5 * 9000);

    const hour = 17 + Math.floor(r2 * 2); // 17:xx or 18:xx
    const minute = String(Math.floor(r3 * 60)).padStart(2, '0');

    list.push({
      id: i,
      code: `KH-${String(i).padStart(3, '0')}`,
      receiptCode: `PDC-26-${String(1000 + i)}`,
      fullName: `${ho} ${dem} ${ten}`,
      phone: `${pre}***${last4}`,
      checkInTime: `${hour}:${minute}`,
      advisor: ADVISORS[i % ADVISORS.length],
      isWinner: false,
      wonApartment: null,
      rank: null,
      waitRank: null,
    });
  }
  return list;
}
