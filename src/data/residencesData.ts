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
    name: 'Căn loại A1',
    floor: 'Tầng 05',
    area: '36,8 m²',
    bedrooms: '1 phòng ngủ',
    orientation: 'Nhà ở xã hội · Quỹ 42 căn',
    referencePrice: '≈ 1,03 tỷ đồng (28 triệu đ/m²)',
    highlights: 'Căn nhỏ gọn · Phù hợp hộ 1–2 người',
    desc: 'Tầng 05 · 36,8 m² · 1 phòng ngủ',
    rooms: [
      { label: 'Phòng khách & bếp', area: '18.0 m²' },
      { label: 'Phòng ngủ', area: '12.0 m²' },
      { label: 'Khu vệ sinh', area: '3.8 m²' },
      { label: 'Loggia', area: '3.0 m²' },
    ],
  },
  {
    id: 'A2',
    indexNumber: '02',
    code: 'TYP-A2-08',
    name: 'Căn loại A2',
    floor: 'Tầng 08',
    area: '50,1 m²',
    bedrooms: '1 phòng ngủ+',
    orientation: 'Nhà ở xã hội · Quỹ 42 căn',
    referencePrice: '≈ 1,40 tỷ đồng (28 triệu đ/m²)',
    highlights: 'Phòng ngủ rộng · Loggia thoáng',
    desc: 'Tầng 08 · 50,1 m² · 1 phòng ngủ+',
    rooms: [
      { label: 'Phòng khách & bếp', area: '20.5 m²' },
      { label: 'Phòng ngủ', area: '14.6 m²' },
      { label: 'Khu vệ sinh', area: '4.5 m²' },
      { label: 'Loggia', area: '10.5 m²' },
    ],
  },
  {
    id: 'A3',
    indexNumber: '03',
    code: 'TYP-A3-12',
    name: 'Căn loại A3',
    floor: 'Tầng 12',
    area: '59,3 m²',
    bedrooms: '2 phòng ngủ',
    orientation: 'Nhà ở xã hội · Quỹ 189 căn',
    referencePrice: '≈ 1,66 tỷ đồng (28 triệu đ/m²)',
    highlights: 'Mẫu căn phổ biến · 2 phòng ngủ, 2 logia',
    desc: 'Tầng 12 · 59,3 m² · 2 phòng ngủ',
    rooms: [
      { label: 'Phòng khách & bếp', area: '24.0 m²' },
      { label: 'Phòng ngủ 1', area: '14.5 m²' },
      { label: 'Phòng ngủ 2', area: '10.8 m²' },
      { label: 'Vệ sinh & logia', area: '10.0 m²' },
    ],
  },
  {
    id: 'A4',
    indexNumber: '04',
    code: 'TYP-A4-15',
    name: 'Căn loại A4',
    floor: 'Tầng 15',
    area: '69,6 m²',
    bedrooms: '2 phòng ngủ',
    orientation: 'Nhà ở xã hội · Quỹ 105 căn',
    referencePrice: '≈ 1,95 tỷ đồng (28 triệu đ/m²)',
    highlights: '2 phòng ngủ · 2 khu vệ sinh',
    desc: 'Tầng 15 · 69,6 m² · 2 phòng ngủ',
    rooms: [
      { label: 'Phòng khách & bếp', area: '26.0 m²' },
      { label: 'Phòng ngủ 1', area: '15.0 m²' },
      { label: 'Phòng ngủ 2', area: '12.6 m²' },
      { label: '2 vệ sinh & logia', area: '16.0 m²' },
    ],
  },
  {
    id: 'A5',
    indexNumber: '05',
    code: 'TYP-A5-18',
    name: 'Căn loại A5',
    floor: 'Tầng 18',
    area: '76,9 m²',
    bedrooms: '3 phòng ngủ',
    orientation: 'Nhà ở xã hội · Quỹ 21 căn',
    referencePrice: '≈ 2,15 tỷ đồng (28 triệu đ/m²)',
    highlights: 'Căn lớn nhất · Phù hợp gia đình nhiều thế hệ',
    desc: 'Tầng 18 · 76,9 m² · 3 phòng ngủ',
    rooms: [
      { label: 'Phòng khách & bếp', area: '30.0 m²' },
      { label: 'Phòng ngủ 1', area: '16.0 m²' },
      { label: 'Phòng ngủ 2 & 3', area: '22.9 m²' },
      { label: 'Vệ sinh & logia', area: '8.0 m²' },
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
  'Bàn tiếp nhận 01',
  'Bàn tiếp nhận 02',
  'Bàn tiếp nhận 03',
  'Bàn tiếp nhận 04',
  'Bàn tiếp nhận 05',
  'Bàn tiếp nhận 06',
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
      receiptCode: `AP-HS-26-${String(1000 + i)}`,
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
