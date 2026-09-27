import { useStore } from '../../context/Store.tsx'
import { useTitle } from '../../hooks/useTitle.ts'
import type { TableStatus } from '../../types/index.ts'
import { cn, toFa } from '../../utils/format.ts'

const NEXT: Record<TableStatus, TableStatus> = { free: 'reserved', reserved: 'occupied', occupied: 'free' }
const LABEL: Record<TableStatus, string> = { free: 'آزاد', reserved: 'رزرو شده', occupied: 'اشغال' }
const ZONE: Record<string, string> = { window: 'کنار پنجره', hall: 'سالن', terrace: 'تراس' }

export function TablesAdminPage() {
  useTitle('میزها')
  const { tables, setTableStatus, reservations } = useStore()

  return (
    <div>
      <h1 className="text-2xl font-bold">میزها</h1>
      <p className="mt-1 text-sm text-muted">برای تغییر وضعیت، روی میز بزنید.</p>
      <div className="mt-3 flex gap-4 text-xs">
        <span className="flex items-center gap-1"><i className="h-3 w-3 bg-white ring-1 ring-line" /> آزاد</span>
        <span className="flex items-center gap-1"><i className="h-3 w-3 bg-[#F3B562]" /> رزرو شده</span>
        <span className="flex items-center gap-1"><i className="h-3 w-3 bg-brand" /> اشغال</span>
      </div>
      <div dir="ltr" className="relative mt-4 aspect-[5/4] w-full overflow-hidden border border-line bg-[#F3F1EC]">
        <span className="absolute right-3 top-2 text-[11px] text-muted">پنجره</span>
        <span className="absolute bottom-2 left-3 text-[11px] text-muted">تراس</span>
        {tables.map((table) => (
          <button
            key={table.id}
            type="button"
            style={{ left: `${table.x}%`, top: `${table.y}%` }}
            onClick={() => setTableStatus(table.id, NEXT[table.status])}
            className={cn(
              'absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center border text-xs font-semibold',
              table.status === 'free' && 'border-line bg-white',
              table.status === 'reserved' && 'border-[#E2C27A] bg-[#F8E7C4]',
              table.status === 'occupied' && 'border-brand bg-[#F6E4DE]',
            )}
            aria-label={`میز ${table.label}، ${LABEL[table.status]}`}
          >
            <span>{table.label}</span>
            <span className="text-[10px] font-normal text-muted">{toFa(table.seats)}</span>
          </button>
        ))}
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {tables.map((table) => (
          <li key={table.id} className="flex items-center justify-between bg-white px-3 py-2 text-sm">
            <span>میز {table.label} · {ZONE[table.zone]} · {toFa(table.seats)} نفره</span>
            <span>{LABEL[table.status]}</span>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-bold">رزروهای مرتبط</h2>
      <ul className="mt-2 space-y-2 text-sm">
        {reservations.filter((item) => item.status !== 'cancelled').map((item) => (
          <li key={item.id} className="bg-white px-3 py-2">
            {item.name} · {item.date} · {item.time} · {toFa(item.guests)} نفر
          </li>
        ))}
      </ul>
    </div>
  )
}
