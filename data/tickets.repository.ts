import AsyncStorage from '@react-native-async-storage/async-storage';
import { s } from 'react-native-size-matters';

export type TicketStatus = '예매완료' | '취소완료';

export type Ticket = {
  id: string;
  productName: string;
  orderNo: string;
  eventName: string;
  reservedAt: string;
  visitDate: string;
  amount: number;
  point: number;
  status: TicketStatus;
  bookingNo: string;
  optionLabel: string;
  quantity: number;
  paymentMethod: string;
};

const KEY = 'TICKETS_V1';
const LEGACY_KEY = 'MY_TICKETS_V1';

const genId = (prefix: string, len: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let r = prefix;
  for (let i = 0; i < len; i++) r += chars.charAt(Math.floor(Math.random() * chars.length));
  return r;
};

const gen4 = () => Math.floor(1000 + Math.random() * 9000).toString();
const genTicketNo = () => Array.from({ length: 4 }, gen4).join('-');

async function getTicketsRaw(): Promise<Ticket[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Ticket[]) : [];
}

export async function getTickets(opts?: { includeCanceled?: boolean }): Promise<Ticket[]> {
  await migrateFromLegacy();
  const list = await getTicketsRaw();
  if (opts?.includeCanceled) return list;
  return list.filter(t => t.status !== '취소완료');
}

export async function getActiveTickets(): Promise<Ticket[]> {
  return getTickets();
}

export async function setTickets(list: Ticket[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function addTicket(t: Ticket) {
  const cur = await getTicketsRaw();
  await setTickets([t, ...cur]);
}

export async function addTickets(list: Ticket[]) {
  const cur = await getTicketsRaw();
  const map = new Map<string, Ticket>();
  for (const t of cur) map.set(`${t.bookingNo}__${t.optionLabel}`, t);
  for (const t of list) map.set(`${t.bookingNo}__${t.optionLabel}`, t);
  await setTickets(Array.from(map.values()));
}

export async function updateTicket(id: string, patch: Partial<Ticket>) {
  const cur = await getTicketsRaw();
  await setTickets(cur.map(x => (x.id === id ? { ...x, ...patch } : x)));
}

export async function removeTicket(id: string) {
  const cur = await getTicketsRaw();
  await setTickets(cur.filter(x => x.id !== id));
}

function normalizeDateLike(s: any) {
  const str = String(s ?? '');
  return str.replace(/\(.*?\)/g, '').replace(/\s+/g, '').replace(/\./g, '-');
}

async function migrateFromLegacy() {
  const legacyRaw = await AsyncStorage.getItem(LEGACY_KEY);
  if (!legacyRaw) return;

  let legacy: any[] = [];
  try {
    legacy = JSON.parse(legacyRaw) || [];
  } catch {
    legacy = [];
  }

  if (!Array.isArray(legacy) || legacy.length === 0) {
    await AsyncStorage.removeItem(LEGACY_KEY);
    return;
  }

  const nowISO = new Date().toISOString();
  const mapped: Ticket[] = legacy.map((l) => ({
    id: genId('TIC', 10),
    productName: String(l.type ?? '이용권'),
    orderNo: genId('ORD', 8),
    eventName: String(l.type ?? '이용권'),
    reservedAt: nowISO,
    visitDate: normalizeDateLike(l.date),
    amount: 0,
    point: 0,
    status: '예매완료',
    bookingNo: String(l.ticketNumber ?? genTicketNo()),
    optionLabel: String(l.ageType ?? '어른'),
    quantity: 1,
    paymentMethod: '카드미입력',
  }));

  const cur = await getTicketsRaw();
  const map = new Map<string, Ticket>();
  for (const t of cur) map.set(`${t.bookingNo}__${t.optionLabel}`, t);
  for (const t of mapped) map.set(`${t.bookingNo}__${t.optionLabel}`, t);

  await setTickets(Array.from(map.values()));
  await AsyncStorage.removeItem(LEGACY_KEY);
}

export async function getTicketsByOrderId(orderId: string): Promise<Ticket[]> {
  const allTickets = await getTickets();
  return allTickets.filter(ticket => ticket.orderNo === orderId);
}