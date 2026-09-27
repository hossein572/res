import { useState } from 'react'
import { Button } from '../../components/ui.tsx'
import { useStore } from '../../context/Store.tsx'
import { useTitle } from '../../hooks/useTitle.ts'
import { formatDateTime } from '../../utils/format.ts'

export function SettingsPage() {
  useTitle('تنظیمات')
  const { settings, saveSettings, messages } = useStore()
  const [draft, setDraft] = useState(settings)

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">تنظیمات</h1>
      <form
        className="mt-5 space-y-3 bg-white p-4"
        onSubmit={(event) => {
          event.preventDefault()
          saveSettings({
            ...draft,
            deliveryFee: Number(draft.deliveryFee) || 0,
            freeDeliveryFrom: Number(draft.freeDeliveryFrom) || 0,
            minOrder: Number(draft.minOrder) || 0,
          })
        }}
      >
        <label className="field"><span>تلفن رستوران</span><input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></label>
        <label className="field"><span>موبایل سفارش</span><input value={draft.orderPhone} onChange={(e) => setDraft({ ...draft, orderPhone: e.target.value })} /></label>
        <label className="field"><span>آدرس</span><textarea value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></label>
        <label className="field"><span>ساعت کار</span><input value={draft.hours} onChange={(e) => setDraft({ ...draft, hours: e.target.value })} /></label>
        <label className="field"><span>هزینه ارسال</span><input inputMode="numeric" value={draft.deliveryFee} onChange={(e) => setDraft({ ...draft, deliveryFee: Number(e.target.value) })} /></label>
        <label className="field"><span>سقف ارسال رایگان</span><input inputMode="numeric" value={draft.freeDeliveryFrom} onChange={(e) => setDraft({ ...draft, freeDeliveryFrom: Number(e.target.value) })} /></label>
        <label className="field"><span>حداقل سفارش</span><input inputMode="numeric" value={draft.minOrder} onChange={(e) => setDraft({ ...draft, minOrder: Number(e.target.value) })} /></label>
        <label className="field"><span>اینستاگرام</span><input value={draft.instagram} onChange={(e) => setDraft({ ...draft, instagram: e.target.value })} /></label>
        <Button type="submit">ذخیره تنظیمات</Button>
      </form>
      <section className="mt-6 bg-white p-4">
        <h2 className="font-bold">پیام‌های تماس</h2>
        {messages.length === 0 ? <p className="mt-2 text-sm text-muted">پیامی نرسیده.</p> : (
          <ul className="mt-3 divide-y divide-line text-sm">
            {messages.map((item) => (
              <li key={item.id} className="py-3">
                <p className="font-semibold">{item.name} · {item.phone}</p>
                <p className="mt-1 leading-7">{item.text}</p>
                <p className="text-xs text-muted">{formatDateTime(item.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
