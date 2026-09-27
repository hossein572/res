import { useState } from 'react'
import { Photo, Button, Modal } from '../../components/ui.tsx'
import { GALLERY } from '../../data/catalog.ts'
import { useStore } from '../../context/Store.tsx'
import { useTitle } from '../../hooks/useTitle.ts'
import type { Food } from '../../types/index.ts'
import { formatPrice, toFa, uid } from '../../utils/format.ts'

const empty = (): Food => ({
  id: uid('food'),
  name: '',
  description: '',
  details: '',
  categoryId: 'pizza',
  price: 200000,
  rating: 4.5,
  reviewCount: 0,
  prepMin: 20,
  calories: 400,
  serves: '۱ نفر',
  image: 'pizza-special.jpg',
  ingredients: [],
  popular: false,
  available: true,
})

export function MenuAdminPage() {
  useTitle('مدیریت منو')
  const { foods, categories, saveFood, removeFood } = useStore()
  const [draft, setDraft] = useState<Food | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const save = () => {
    if (!draft || draft.name.trim().length < 2) return
    saveFood({ ...draft, ingredients: draft.ingredients.map((item) => item.trim()).filter(Boolean) })
    setDraft(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">مدیریت منو</h1>
        <Button onClick={() => setDraft(empty())}>افزودن غذا</Button>
      </div>
      <ul className="mt-5 divide-y divide-line bg-white">
        {foods.map((food) => (
          <li key={food.id} className="flex gap-3 p-3">
            <Photo src={food.image} alt="" className="h-16 w-16 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{food.name}</p>
              <p className="text-sm text-muted">{categories.find((item) => item.id === food.categoryId)?.name} · {formatPrice(food.price)}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" className="text-sm text-brand-deep" onClick={() => setDraft(food)}>ویرایش</button>
                <button
                  type="button"
                  className="text-sm"
                  onClick={() => saveFood({ ...food, available: !food.available })}
                >
                  {food.available ? 'غیرفعال' : 'فعال'}
                </button>
                <button type="button" className="text-sm text-danger" onClick={() => setConfirmId(food.id)}>حذف</button>
              </div>
            </div>
            <label className="text-xs text-muted">
              قیمت
              <input
                className="control mt-1 h-10 w-28"
                inputMode="numeric"
                defaultValue={food.price}
                key={food.price}
                onBlur={(event) => {
                  const price = Number(event.target.value.replace(/[^\d]/g, ''))
                  if (price > 0 && price !== food.price) saveFood({ ...food, price })
                }}
              />
            </label>
          </li>
        ))}
      </ul>

      <Modal open={Boolean(draft)} title={draft && foods.some((item) => item.id === draft.id) ? 'ویرایش غذا' : 'غذای جدید'} onClose={() => setDraft(null)}>
        {draft && (
          <div className="space-y-3">
            <label className="field"><span>نام</span><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
            <label className="field"><span>توضیح کوتاه</span><input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
            <label className="field"><span>توضیح کامل</span><textarea value={draft.details} onChange={(e) => setDraft({ ...draft, details: e.target.value })} /></label>
            <label className="field">
              <span>دسته</span>
              <select value={draft.categoryId} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}>
                {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="field"><span>قیمت</span><input inputMode="numeric" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) || 0 })} /></label>
              <label className="field"><span>زمان آماده‌سازی</span><input inputMode="numeric" value={draft.prepMin} onChange={(e) => setDraft({ ...draft, prepMin: Number(e.target.value) || 0 })} /></label>
            </div>
            <label className="field"><span>مواد اولیه، با ویرگول</span><input value={draft.ingredients.join('، ')} onChange={(e) => setDraft({ ...draft, ingredients: e.target.value.split(/[,،]/) })} /></label>
            <div>
              <p className="mb-2 text-sm text-muted">تصویر</p>
              <div className="grid grid-cols-4 gap-2">
                {GALLERY.slice(0, 8).map((image) => (
                  <button key={image} type="button" className={draft.image === image ? 'ring-2 ring-brand' : ''} onClick={() => setDraft({ ...draft, image })}>
                    <Photo src={image} alt="" className="aspect-square" />
                  </button>
                ))}
              </div>
              <label className="mt-3 block text-sm text-brand-deep">
                بارگذاری تصویر
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-xs"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    if (file.size > 900000) return
                    const reader = new FileReader()
                    reader.onload = () => setDraft({ ...draft, image: String(reader.result) })
                    reader.readAsDataURL(file)
                  }}
                />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.available} onChange={(e) => setDraft({ ...draft, available: e.target.checked })} />
              فعال در منو
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.popular} onChange={(e) => setDraft({ ...draft, popular: e.target.checked })} />
              نمایش در محبوب‌ها
            </label>
            <Button onClick={save}>ذخیره</Button>
            <p className="text-xs text-muted">امتیاز فعلی: {toFa(draft.rating)}</p>
          </div>
        )}
      </Modal>

      <Modal open={Boolean(confirmId)} title="حذف غذا" onClose={() => setConfirmId(null)}>
        <p className="text-sm">این غذا از منو حذف شود؟</p>
        <div className="mt-4 flex gap-2">
          <Button variant="danger" onClick={() => { if (confirmId) removeFood(confirmId); setConfirmId(null) }}>حذف</Button>
          <Button variant="ghost" onClick={() => setConfirmId(null)}>انصراف</Button>
        </div>
      </Modal>
    </div>
  )
}
