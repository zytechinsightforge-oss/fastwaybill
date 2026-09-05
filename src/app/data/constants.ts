export const BRAND = {
  orange: "#F5820D",
  navy: "#1B3A7A",
  navyDark: "#0D1F47",
  blueLight: "#BAD8F7",
  blueMid: "#3B6CB7",
};

export const ZONE_RATES = [
  { zone: "Island → Mainland", flat: 1200, eta: "22 min", id: "ISL-MAIN" },
  { zone: "Lekki → VI", flat: 800, eta: "14 min", id: "LEK-VI" },
  { zone: "Ikeja → Surulere", flat: 950, eta: "18 min", id: "IKJ-SUR" },
  { zone: "Ajah → CMS", flat: 1400, eta: "35 min", id: "AJH-CMS" },
  { zone: "Yaba → Ikorodu", flat: 1100, eta: "28 min", id: "YAB-IKR" },
  { zone: "Festac → Oshodi", flat: 750, eta: "12 min", id: "FES-OSH" },
];

export const DISPATCH_RATES = [
  { weight: "0 – 2 kg", price: 600, tag: "Envelope / Docs", icon: "📄" },
  { weight: "2 – 5 kg", price: 950, tag: "Small Parcel", icon: "📦" },
  { weight: "5 – 15 kg", price: 1600, tag: "Medium Box", icon: "🗃️" },
  { weight: "15 – 30 kg", price: 2800, tag: "Large Cargo", icon: "📫" },
];

export const MOCK_TRIPS = [
  { id: "TRP-001", from: "Lekki Phase 1", to: "Victoria Island", amount: 800, status: "completed", date: "2026-08-26", type: "ride", driver: "Emeka O.", rating: 5 },
  { id: "TRP-002", from: "Yaba", to: "Ajah", amount: 1200, status: "completed", date: "2026-08-25", type: "dispatch", driver: "Chidi A.", rating: 4 },
  { id: "TRP-003", from: "Ikeja", to: "Surulere", amount: 950, status: "completed", date: "2026-08-24", type: "ride", driver: "Tunde B.", rating: 5 },
  { id: "TRP-004", from: "Island", to: "Mainland", amount: 1400, status: "completed", date: "2026-08-23", type: "dispatch", driver: "Bola K.", rating: 4 },
  { id: "TRP-005", from: "Festac", to: "Oshodi", amount: 750, status: "cancelled", date: "2026-08-22", type: "ride", driver: "—", rating: 0 },
];

export const MOCK_TRANSACTIONS = [
  { id: "TXN-001", type: "debit", desc: "Ride: Lekki → VI", amount: 800, date: "2026-08-26 14:32", ref: "RD-8821" },
  { id: "TXN-002", type: "credit", desc: "Wallet Top-up (Paystack)", amount: 5000, date: "2026-08-26 10:15", ref: "PS-4492" },
  { id: "TXN-003", type: "debit", desc: "Dispatch: Yaba → Ajah", amount: 1200, date: "2026-08-25 09:44", ref: "DP-3310" },
  { id: "TXN-004", type: "credit", desc: "Referral Bonus — Taiwo F.", amount: 200, date: "2026-08-24 17:00", ref: "REF-119" },
  { id: "TXN-005", type: "debit", desc: "Ride: Ikeja → Surulere", amount: 950, date: "2026-08-24 08:20", ref: "RD-7731" },
  { id: "TXN-006", type: "credit", desc: "Bank Transfer (GTBank)", amount: 10000, date: "2026-08-23 11:30", ref: "BNK-0091" },
];

export const DRIVER_JOBS = [
  { id: "JOB-001", type: "ride", from: "Lekki Phase 1, Block 4", to: "Eko Hotel, VI", dist: "6.2 km", pay: 800, eta: "8 min away" },
  { id: "JOB-002", type: "dispatch", from: "Computer Village, Ikeja", to: "Balogun Market, Lagos Island", dist: "18.4 km", pay: 1600, eta: "2 min away" },
  { id: "JOB-003", type: "ride", from: "Yaba Bus Stop", to: "Surulere, Adeniran Ogunsanya", dist: "4.1 km", pay: 750, eta: "4 min away" },
];

// Lagos center
export const LAGOS_CENTER: [number, number] = [3.3792, 6.5244];
