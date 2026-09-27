export type SizeId = 'small' | 'medium' | 'large'

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'shipped'
  | 'completed'
  | 'cancelled'

export type PayMethod = 'online' | 'cash'

export type TableStatus = 'free' | 'reserved' | 'occupied'

export type TableZone = 'window' | 'hall' | 'terrace'

export type Food = {
  id: string
  name: string
  description: string
  details: string
  categoryId: string
  price: number
  rating: number
  reviewCount: number
  prepMin: number
  calories: number
  serves: string
  image: string
  ingredients: string[]
  popular: boolean
  available: boolean
}

export type Category = {
  id: string
  name: string
  short: string
  image: string
  visible: boolean
}

export type Addon = {
  id: string
  name: string
  price: number
}

export type CartLine = {
  key: string
  foodId: string
  name: string
  image: string
  size: SizeId
  addons: string[]
  quantity: number
  unitPrice: number
  offer: boolean
}

export type Order = {
  id: string
  number: string
  name: string
  phone: string
  address: string
  note: string
  payment: PayMethod
  items: CartLine[]
  subtotal: number
  delivery: number
  discount: number
  coupon: string | null
  total: number
  status: OrderStatus
  createdAt: string
  etaMin: number
}

export type Reservation = {
  id: string
  number: string
  date: string
  time: string
  guests: number
  tableType: string
  name: string
  phone: string
  note: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  tableId?: string
}

export type Address = {
  id: string
  title: string
  text: string
  phone: string
}

export type Profile = {
  name: string
  phone: string
}

export type DiningTable = {
  id: string
  label: string
  seats: number
  zone: TableZone
  status: TableStatus
  x: number
  y: number
}

export type Settings = {
  phone: string
  orderPhone: string
  address: string
  hours: string
  deliveryFee: number
  freeDeliveryFrom: number
  minOrder: number
  instagram: string
}

export type ContactMessage = {
  id: string
  name: string
  phone: string
  text: string
  createdAt: string
}

export type Review = {
  id: string
  foodId: string
  name: string
  text: string
  rating: number
  date: string
}

export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'fast'

export type ToastTone = 'ok' | 'err'

export type ToastItem = {
  id: string
  message: string
  tone: ToastTone
}
