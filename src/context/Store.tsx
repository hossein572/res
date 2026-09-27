import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CATEGORIES, DEFAULT_SETTINGS, FOODS, OFFER_FOOD_ID } from '../data/catalog.ts'
import { makeSeedOrders, makeSeedReservations, SEED_TABLES } from '../data/seed.ts'
import type {
  Address,
  CartLine,
  Category,
  ContactMessage,
  DiningTable,
  Food,
  Order,
  OrderStatus,
  PayMethod,
  Profile,
  Reservation,
  Settings,
  SizeId,
  TableStatus,
  ToastItem,
  ToastTone,
} from '../types/index.ts'
import { normalize, normalizePhone, readStorage, uid, writeStorage } from '../utils/format.ts'
import { couponDiscount, deliveryCost, lineKey, unitPrice } from '../utils/money.ts'

const KEYS = {
  ready: 'chashni-ready',
  cart: 'chashni-cart',
  favs: 'chashni-favs',
  orders: 'chashni-orders',
  reservations: 'chashni-reservations',
  profile: 'chashni-profile',
  addresses: 'chashni-addresses',
  foods: 'chashni-foods',
  categories: 'chashni-categories',
  tables: 'chashni-tables',
  settings: 'chashni-settings',
  admin: 'chashni-admin',
  coupon: 'chashni-coupon',
  messages: 'chashni-messages',
}

function boot() {
  if (localStorage.getItem(KEYS.ready)) return
  writeStorage(KEYS.orders, makeSeedOrders())
  writeStorage(KEYS.reservations, makeSeedReservations())
  writeStorage(KEYS.tables, SEED_TABLES)
  localStorage.setItem(KEYS.ready, '1')
}

type AddInput = {
  food: Food
  size?: SizeId
  addons?: string[]
  qty?: number
  offer?: boolean
}

type StoreValue = {
  foods: Food[]
  categories: Category[]
  cart: CartLine[]
  favorites: string[]
  orders: Order[]
  reservations: Reservation[]
  addresses: Address[]
  profile: Profile | null
  tables: DiningTable[]
  settings: Settings
  messages: ContactMessage[]
  admin: boolean
  coupon: string | null
  toasts: ToastItem[]
  cartCount: number
  subtotal: number
  discount: number
  delivery: number
  total: number
  toast: (message: string, tone?: ToastTone) => void
  dismissToast: (id: string) => void
  addToCart: (input: AddInput) => void
  setQty: (key: string, qty: number) => void
  removeLine: (key: string) => void
  clearCart: () => void
  toggleFav: (foodId: string) => void
  setCoupon: (code: string) => boolean
  clearCoupon: () => void
  placeOrder: (input: { name: string; phone: string; address: string; note: string; payment: PayMethod }) => Order | null
  setOrderStatus: (id: string, status: OrderStatus) => void
  reserve: (input: Omit<Reservation, 'id' | 'number' | 'status' | 'createdAt' | 'tableId'>) => Reservation
  cancelReservation: (id: string) => void
  login: (profile: Profile) => void
  logout: () => void
  addAddress: (address: Omit<Address, 'id'>) => void
  removeAddress: (id: string) => void
  saveFood: (food: Food) => void
  removeFood: (id: string) => void
  saveCategory: (category: Category) => void
  removeCategory: (id: string) => void
  setTableStatus: (id: string, status: TableStatus) => void
  saveSettings: (settings: Settings) => void
  addMessage: (input: { name: string; phone: string; text: string }) => void
  adminLogin: (password: string) => boolean
  adminLogout: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => {
    boot()
    return readStorage(KEYS.cart, [])
  })
  const [favorites, setFavorites] = useState<string[]>(() => readStorage(KEYS.favs, []))
  const [orders, setOrders] = useState<Order[]>(() => readStorage(KEYS.orders, []))
  const [reservations, setReservations] = useState<Reservation[]>(() => readStorage(KEYS.reservations, []))
  const [profile, setProfile] = useState<Profile | null>(() => readStorage(KEYS.profile, null))
  const [addresses, setAddresses] = useState<Address[]>(() => readStorage(KEYS.addresses, []))
  const [customFoods, setCustomFoods] = useState<Food[] | null>(() => readStorage(KEYS.foods, null))
  const [customCategories, setCustomCategories] = useState<Category[] | null>(() => readStorage(KEYS.categories, null))
  const [tables, setTables] = useState<DiningTable[]>(() => readStorage(KEYS.tables, SEED_TABLES))
  const [settings, setSettings] = useState<Settings>(() => readStorage(KEYS.settings, DEFAULT_SETTINGS))
  const [messages, setMessages] = useState<ContactMessage[]>(() => readStorage(KEYS.messages, []))
  const [admin, setAdmin] = useState(() => readStorage(KEYS.admin, false))
  const [coupon, setCouponState] = useState<string | null>(() => readStorage(KEYS.coupon, null))
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const foods = customFoods ?? FOODS
  const categories = customCategories ?? CATEGORIES

  useEffect(() => writeStorage(KEYS.cart, cart), [cart])
  useEffect(() => writeStorage(KEYS.favs, favorites), [favorites])
  useEffect(() => writeStorage(KEYS.orders, orders), [orders])
  useEffect(() => writeStorage(KEYS.reservations, reservations), [reservations])
  useEffect(() => writeStorage(KEYS.profile, profile), [profile])
  useEffect(() => writeStorage(KEYS.addresses, addresses), [addresses])
  useEffect(() => writeStorage(KEYS.tables, tables), [tables])
  useEffect(() => writeStorage(KEYS.settings, settings), [settings])
  useEffect(() => writeStorage(KEYS.messages, messages), [messages])
  useEffect(() => writeStorage(KEYS.admin, admin), [admin])
  useEffect(() => writeStorage(KEYS.coupon, coupon), [coupon])
  useEffect(() => {
    if (customFoods) writeStorage(KEYS.foods, customFoods)
  }, [customFoods])
  useEffect(() => {
    if (customCategories) writeStorage(KEYS.categories, customCategories)
  }, [customCategories])

  const toast = useCallback((message: string, tone: ToastTone = 'ok') => {
    const id = uid('toast')
    setToasts((prev) => [...prev.slice(-2), { id, message, tone }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 2800)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const subtotal = cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
  const discount = couponDiscount(subtotal, coupon)
  const delivery = deliveryCost(subtotal, settings)
  const total = Math.max(0, subtotal - discount + delivery)
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0)

  const addToCart = useCallback(
    (input: AddInput) => {
      if (!input.food.available) {
        toast('این غذا فعلاً موجود نیست.', 'err')
        return
      }
      const size = input.size ?? 'medium'
      const addons = input.addons ?? []
      const offer = Boolean(input.offer && input.food.id === OFFER_FOOD_ID)
      const key = lineKey(input.food.id, size, addons, offer)
      const price = unitPrice(input.food.price, size, addons, input.food.categoryId, offer)
      const qty = Math.max(1, input.qty ?? 1)
      setCart((prev) => {
        const found = prev.find((line) => line.key === key)
        if (found) {
          return prev.map((line) =>
            line.key === key ? { ...line, quantity: Math.min(10, line.quantity + qty) } : line,
          )
        }
        return [
          ...prev,
          {
            key,
            foodId: input.food.id,
            name: input.food.name,
            image: input.food.image,
            size,
            addons,
            quantity: Math.min(10, qty),
            unitPrice: price,
            offer,
          },
        ]
      })
      toast(`${input.food.name} به سبد خرید اضافه شد.`)
    },
    [toast],
  )

  const setQty = useCallback(
    (key: string, qty: number) => {
      if (qty < 1) {
        setCart((prev) => prev.filter((line) => line.key !== key))
        toast('از سبد خرید حذف شد.')
        return
      }
      setCart((prev) => prev.map((line) => (line.key === key ? { ...line, quantity: Math.min(10, qty) } : line)))
    },
    [toast],
  )

  const removeLine = useCallback(
    (key: string) => {
      setCart((prev) => prev.filter((line) => line.key !== key))
      toast('از سبد خرید حذف شد.')
    },
    [toast],
  )

  const clearCart = useCallback(() => setCart([]), [])

  const toggleFav = useCallback(
    (foodId: string) => {
      const food = foods.find((item) => item.id === foodId)
      setFavorites((prev) => {
        if (prev.includes(foodId)) {
          toast(`${food?.name ?? 'غذا'} از علاقه‌مندی‌ها حذف شد.`)
          return prev.filter((id) => id !== foodId)
        }
        toast(`${food?.name ?? 'غذا'} به علاقه‌مندی‌ها اضافه شد.`)
        return [foodId, ...prev]
      })
    },
    [foods, toast],
  )

  const setCoupon = useCallback(
    (code: string) => {
      const discountValue = couponDiscount(Math.max(subtotal, 1), code)
      if (!code.trim() || discountValue <= 0 && couponDiscount(100000, code) <= 0) {
        toast('این کد تخفیف معتبر نیست.', 'err')
        return false
      }
      setCouponState(code.trim())
      toast('کد تخفیف اعمال شد.')
      return true
    },
    [subtotal, toast],
  )

  const clearCoupon = useCallback(() => setCouponState(null), [])

  const placeOrder = useCallback(
    (input: { name: string; phone: string; address: string; note: string; payment: PayMethod }) => {
      if (cart.length === 0) {
        toast('سبد خرید خالی است.', 'err')
        return null
      }
      if (subtotal < settings.minOrder) {
        toast('مبلغ سفارش از حداقل مجاز کمتر است.', 'err')
        return null
      }
      const phone = normalizePhone(input.phone)
      const next: Order = {
        id: uid('ord'),
        number: `چ-${10000 + Math.floor(Math.random() * 89999)}`,
        name: input.name.trim(),
        phone,
        address: input.address.trim(),
        note: input.note.trim(),
        payment: input.payment,
        items: cart,
        subtotal,
        delivery,
        discount,
        coupon,
        total,
        status: 'new',
        createdAt: new Date().toISOString(),
        etaMin: 40 + Math.min(25, cart.length * 6),
      }
      setOrders((prev) => [next, ...prev])
      setCart([])
      setCouponState(null)
      setProfile({ name: next.name, phone })
      setAddresses((prev) => {
        if (prev.some((item) => item.text === next.address)) return prev
        return [{ id: uid('adr'), title: 'آدرس سفارش', text: next.address, phone }, ...prev]
      })
      return next
    },
    [cart, coupon, delivery, discount, settings.minOrder, subtotal, toast, total],
  )

  const setOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)))
      toast('وضعیت سفارش به‌روز شد.')
    },
    [toast],
  )

  const reserve = useCallback(
    (input: Omit<Reservation, 'id' | 'number' | 'status' | 'createdAt' | 'tableId'>) => {
      const match = tables.find((table) => {
        if (table.status !== 'free' || table.seats < input.guests) return false
        if (input.tableType === 'window') return table.zone === 'window'
        if (input.tableType === 'terrace') return table.zone === 'terrace'
        if (input.tableType === 'cozy') return table.zone === 'hall' && table.seats <= 2
        return table.zone === 'hall'
      })
      const next: Reservation = {
        ...input,
        id: uid('rsv'),
        number: `ر-${300 + Math.floor(Math.random() * 500)}`,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        tableId: match?.id,
        phone: normalizePhone(input.phone),
      }
      setReservations((prev) => [next, ...prev])
      if (match) {
        setTables((prev) => prev.map((table) => (table.id === match.id ? { ...table, status: 'reserved' } : table)))
      }
      setProfile((prev) => prev ?? { name: input.name, phone: next.phone })
      return next
    },
    [tables],
  )

  const cancelReservation = useCallback(
    (id: string) => {
      const current = reservations.find((item) => item.id === id)
      setReservations((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'cancelled' } : item)))
      if (current?.tableId) {
        setTables((prev) =>
          prev.map((table) => (table.id === current.tableId && table.status === 'reserved' ? { ...table, status: 'free' } : table)),
        )
      }
      toast('رزرو لغو شد.')
    },
    [reservations, toast],
  )

  const login = useCallback((next: Profile) => {
    setProfile({ name: next.name.trim(), phone: normalizePhone(next.phone) })
  }, [])

  const logout = useCallback(() => setProfile(null), [])

  const addAddress = useCallback((address: Omit<Address, 'id'>) => {
    setAddresses((prev) => [{ ...address, id: uid('adr') }, ...prev])
  }, [])

  const removeAddress = useCallback(
    (id: string) => {
      setAddresses((prev) => prev.filter((item) => item.id !== id))
      toast('آدرس حذف شد.')
    },
    [toast],
  )

  const saveFood = useCallback(
    (food: Food) => {
      setCustomFoods((prev) => {
        const base = prev ?? FOODS
        const exists = base.some((item) => item.id === food.id)
        return exists ? base.map((item) => (item.id === food.id ? food : item)) : [food, ...base]
      })
      toast('غذا ذخیره شد.')
    },
    [toast],
  )

  const removeFood = useCallback(
    (id: string) => {
      setCustomFoods((prev) => (prev ?? FOODS).filter((item) => item.id !== id))
      setFavorites((prev) => prev.filter((item) => item !== id))
      toast('غذا حذف شد.')
    },
    [toast],
  )

  const saveCategory = useCallback(
    (category: Category) => {
      setCustomCategories((prev) => {
        const base = prev ?? CATEGORIES
        const exists = base.some((item) => item.id === category.id)
        return exists ? base.map((item) => (item.id === category.id ? category : item)) : [...base, category]
      })
      toast('دسته‌بندی ذخیره شد.')
    },
    [toast],
  )

  const removeCategory = useCallback(
    (id: string) => {
      if (foods.some((food) => food.categoryId === id)) {
        toast('این دسته غذا دارد و حذف نمی‌شود.', 'err')
        return
      }
      setCustomCategories((prev) => (prev ?? CATEGORIES).filter((item) => item.id !== id))
      toast('دسته‌بندی حذف شد.')
    },
    [foods, toast],
  )

  const setTableStatus = useCallback((id: string, status: TableStatus) => {
    setTables((prev) => prev.map((table) => (table.id === id ? { ...table, status } : table)))
  }, [])

  const saveSettings = useCallback(
    (next: Settings) => {
      setSettings(next)
      toast('تنظیمات ذخیره شد.')
    },
    [toast],
  )

  const addMessage = useCallback(
    (input: { name: string; phone: string; text: string }) => {
      setMessages((prev) => [
        { id: uid('msg'), name: input.name.trim(), phone: normalizePhone(input.phone), text: input.text.trim(), createdAt: new Date().toISOString() },
        ...prev,
      ])
      toast('پیام شما ثبت شد.')
    },
    [toast],
  )

  const adminLogin = useCallback(
    (password: string) => {
      const ok = normalize(password) === normalize('چاشنی') || password.trim().toLowerCase() === 'chashni'
      if (!ok) {
        toast('رمز درست نیست.', 'err')
        return false
      }
      setAdmin(true)
      return true
    },
    [toast],
  )

  const adminLogout = useCallback(() => setAdmin(false), [])

  const value = useMemo<StoreValue>(
    () => ({
      foods,
      categories,
      cart,
      favorites,
      orders,
      reservations,
      addresses,
      profile,
      tables,
      settings,
      messages,
      admin,
      coupon,
      toasts,
      cartCount,
      subtotal,
      discount,
      delivery,
      total,
      toast,
      dismissToast,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      toggleFav,
      setCoupon,
      clearCoupon,
      placeOrder,
      setOrderStatus,
      reserve,
      cancelReservation,
      login,
      logout,
      addAddress,
      removeAddress,
      saveFood,
      removeFood,
      saveCategory,
      removeCategory,
      setTableStatus,
      saveSettings,
      addMessage,
      adminLogin,
      adminLogout,
    }),
    [
      foods,
      categories,
      cart,
      favorites,
      orders,
      reservations,
      addresses,
      profile,
      tables,
      settings,
      messages,
      admin,
      coupon,
      toasts,
      cartCount,
      subtotal,
      discount,
      delivery,
      total,
      toast,
      dismissToast,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      toggleFav,
      setCoupon,
      clearCoupon,
      placeOrder,
      setOrderStatus,
      reserve,
      cancelReservation,
      login,
      logout,
      addAddress,
      removeAddress,
      saveFood,
      removeFood,
      saveCategory,
      removeCategory,
      setTableStatus,
      saveSettings,
      addMessage,
      adminLogin,
      adminLogout,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const value = useContext(StoreContext)
  if (!value) throw new Error('store')
  return value
}
