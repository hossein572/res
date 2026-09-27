import { FOODS } from './catalog.ts'
import type { CartLine, DiningTable, Order, Reservation } from '../types/index.ts'
import { todayKey, shiftDate, uid } from '../utils/format.ts'

function at(daysAgo: number, hour: number, minute: number) {
  const date = shiftDate(-daysAgo)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

function line(foodId: string, qty = 1): CartLine {
  const food = FOODS.find((item) => item.id === foodId) ?? FOODS[0]
  return {
    key: `${food.id}-seed-${qty}`,
    foodId: food.id,
    name: food.name,
    image: food.image,
    size: 'medium',
    addons: [],
    quantity: qty,
    unitPrice: food.price,
    offer: false,
  }
}

function order(
  partial: Pick<Order, 'name' | 'phone' | 'address' | 'status' | 'payment'> & {
    items: CartLine[]
    daysAgo: number
    hour: number
    minute?: number
    note?: string
    coupon?: string | null
    discount?: number
  },
): Order {
  const subtotal = partial.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const discount = partial.discount ?? 0
  const delivery = subtotal >= 500000 ? 0 : 45000
  const number = 18000 + partial.daysAgo * 17 + partial.hour
  return {
    id: uid('ord'),
    number: `چ-${number}`,
    name: partial.name,
    phone: partial.phone,
    address: partial.address,
    note: partial.note ?? '',
    payment: partial.payment,
    items: partial.items,
    subtotal,
    delivery,
    discount,
    coupon: partial.coupon ?? null,
    total: subtotal - discount + delivery,
    status: partial.status,
    createdAt: at(partial.daysAgo, partial.hour, partial.minute ?? 10),
    etaMin: 45,
  }
}

export function makeSeedOrders(): Order[] {
  return [
    order({
      name: 'سارا محمدی',
      phone: '09121234567',
      address: 'یوسف‌آباد، خیابان اسدآبادی، کوچه هفتم، پلاک ۱۲، واحد ۳',
      status: 'preparing',
      payment: 'online',
      items: [line('pizza-special'), line('doogh')],
      daysAgo: 0,
      hour: 13,
      minute: 5,
      note: 'زنگ واحد را بزنید.',
    }),
    order({
      name: 'رضا توکلی',
      phone: '09127654321',
      address: 'امیرآباد، خیابان کارگر شمالی، پلاک ۲۱۰',
      status: 'new',
      payment: 'cash',
      items: [line('burger-classic'), line('fries')],
      daysAgo: 0,
      hour: 12,
      minute: 40,
    }),
    order({
      name: 'نرگس احمدی',
      phone: '09123334455',
      address: 'ونک، خیابان خدامی، پلاک ۸',
      status: 'shipped',
      payment: 'online',
      items: [line('soltani'), line('salad', 1)],
      daysAgo: 0,
      hour: 11,
      minute: 50,
      coupon: 'چاشنی۱۰',
      discount: 70000,
    }),
    order({
      name: 'کیان رضایی',
      phone: '09351239876',
      address: 'سعادت‌آباد، میدان کتاب، کوچه نسترن، پلاک ۴',
      status: 'completed',
      payment: 'online',
      items: [line('joojeh'), line('doogh')],
      daysAgo: 1,
      hour: 20,
      minute: 15,
    }),
    order({
      name: 'مریم کاظمی',
      phone: '09129887766',
      address: 'جردن، خیابان آفریقا، پلاک ۱۵۶، واحد ۷',
      status: 'completed',
      payment: 'cash',
      items: [line('pasta-alfredo'), line('cheesecake')],
      daysAgo: 2,
      hour: 13,
      minute: 30,
    }),
    order({
      name: 'امیرحسین نادری',
      phone: '09122001122',
      address: 'یوسف‌آباد، خیابان جهان‌آرا، پلاک ۲۲',
      status: 'cancelled',
      payment: 'online',
      items: [line('pizza-pepperoni')],
      daysAgo: 3,
      hour: 19,
      note: 'مشتری لغو کرد.',
    }),
    order({
      name: 'هدی شریفی',
      phone: '09125556677',
      address: 'یوسف‌آباد، خیابان مستوفی، پلاک ۹',
      status: 'completed',
      payment: 'online',
      items: [line('koobideh'), line('lemonade')],
      daysAgo: 4,
      hour: 21,
    }),
    order({
      name: 'پارسا نعمتی',
      phone: '09361112233',
      address: 'امیرآباد شمالی، پلاک ۷۷',
      status: 'ready',
      payment: 'cash',
      items: [line('burger-chashni'), line('fries')],
      daysAgo: 5,
      hour: 20,
      minute: 5,
    }),
    order({
      name: 'لیلا کرمی',
      phone: '09126677889',
      address: 'ونک، گاندی، کوچه پنجم، پلاک ۳',
      status: 'completed',
      payment: 'online',
      items: [line('zereshk'), line('tiramisu')],
      daysAgo: 6,
      hour: 13,
      minute: 45,
    }),
  ]
}

export function makeSeedReservations(): Reservation[] {
  return [
    {
      id: uid('rsv'),
      number: 'ر-۳۰۱',
      date: todayKey(),
      time: '۲۰:۰۰',
      guests: 2,
      tableType: 'window',
      name: 'نرگس احمدی',
      phone: '09123334455',
      note: 'سالگرد ازدواج',
      status: 'confirmed',
      createdAt: at(1, 18, 20),
      tableId: 't3',
    },
    {
      id: uid('rsv'),
      number: 'ر-۳۰۲',
      date: todayKey(shiftDate(1)),
      time: '۱۳:۳۰',
      guests: 4,
      tableType: 'hall',
      name: 'رضا توکلی',
      phone: '09127654321',
      note: '',
      status: 'pending',
      createdAt: at(0, 9, 40),
    },
    {
      id: uid('rsv'),
      number: 'ر-۲۹۸',
      date: todayKey(shiftDate(3)),
      time: '۲۱:۰۰',
      guests: 6,
      tableType: 'terrace',
      name: 'مریم کاظمی',
      phone: '09129887766',
      note: 'تولد',
      status: 'confirmed',
      createdAt: at(2, 16, 5),
      tableId: 't11',
    },
    {
      id: uid('rsv'),
      number: 'ر-۲۹۴',
      date: todayKey(shiftDate(-1)),
      time: '۱۹:۳۰',
      guests: 2,
      tableType: 'cozy',
      name: 'کیان رضایی',
      phone: '09351239876',
      note: '',
      status: 'cancelled',
      createdAt: at(3, 11, 15),
    },
  ]
}

export const SEED_TABLES: DiningTable[] = [
  { id: 't1', label: '۱', seats: 2, zone: 'window', status: 'occupied', x: 12, y: 22 },
  { id: 't2', label: '۲', seats: 2, zone: 'window', status: 'free', x: 32, y: 22 },
  { id: 't3', label: '۳', seats: 4, zone: 'window', status: 'reserved', x: 54, y: 20 },
  { id: 't4', label: '۴', seats: 4, zone: 'window', status: 'free', x: 78, y: 22 },
  { id: 't5', label: '۵', seats: 4, zone: 'hall', status: 'occupied', x: 16, y: 50 },
  { id: 't6', label: '۶', seats: 4, zone: 'hall', status: 'free', x: 40, y: 50 },
  { id: 't7', label: '۷', seats: 6, zone: 'hall', status: 'occupied', x: 66, y: 48 },
  { id: 't8', label: '۸', seats: 2, zone: 'hall', status: 'free', x: 86, y: 52 },
  { id: 't9', label: '۹', seats: 2, zone: 'terrace', status: 'reserved', x: 18, y: 78 },
  { id: 't10', label: '۱۰', seats: 4, zone: 'terrace', status: 'free', x: 42, y: 78 },
  { id: 't11', label: '۱۱', seats: 4, zone: 'terrace', status: 'free', x: 66, y: 78 },
  { id: 't12', label: '۱۲', seats: 6, zone: 'hall', status: 'occupied', x: 86, y: 76 },
]
