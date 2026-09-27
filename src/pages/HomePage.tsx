import { BadgeCheck, Bike, Leaf, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { FoodCard } from '../components/FoodCard.tsx'
import { ButtonLink, Photo, Price } from '../components/ui.tsx'
import { BENEFITS, HOME_REVIEWS, OFFER_RATE } from '../data/catalog.ts'
import { useStore } from '../context/Store.tsx'
import { useTitle } from '../hooks/useTitle.ts'
import { formatPrice, isOpen, toFa } from '../utils/format.ts'
import { roundToman } from '../utils/money.ts'

const ICONS = {
  leaf: Leaf,
  bike: Bike,
  badge: BadgeCheck,
  shield: ShieldCheck,
}

export function HomePage() {
  useTitle('')
  const { foods, categories, addToCart } = useStore()
  const navigate = useNavigate()
  const popular = foods.filter((food) => food.popular && food.available)
  const special = foods.find((food) => food.id === 'pizza-special')
  const open = isOpen()
  const visibleCategories = categories.filter((item) => item.visible)

  return (
    <div>
      <section className="wrap grid items-center gap-6 py-5 md:py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <p className="text-[13px] text-brand-deep">رستوران چاشنی · یوسف‌آباد</p>
          <h1 className="mt-2 text-[32px] font-bold leading-[1.28] md:text-5xl md:leading-[1.2]">
            غذایی که هر بار
            <br />
            ارزش برگشتن دارد
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-8 text-muted">
            با مواد اولیه تازه، طعمی که دوستش دارید و تجربه‌ای که فراموش نمی‌کنید.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:flex">
            <ButtonLink to="/menu" className="sm:min-w-36">مشاهده منو</ButtonLink>
            <ButtonLink to="/reserve" variant="secondary" className="sm:min-w-36">رزرو میز</ButtonLink>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-4 text-[13px] text-muted">
            <span>امتیاز {toFa('4.8')} از مهمان‌ها</span>
            <span className="hidden h-3 w-px bg-line sm:block" />
            <span>ارسال حدود {toFa(40)} دقیقه</span>
            <span className="hidden h-3 w-px bg-line sm:block" />
            <span>{open ? 'الان باز است' : 'از ساعت ۱۲'}</span>
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-7">
          <Photo src="hero.jpg" alt="پیتزای تنوری روی تخته چوبی در رستوران چاشنی" eager className="aspect-[4/3] max-h-[280px] sm:max-h-[420px] lg:max-h-[480px] lg:aspect-[5/4]" />
          <p className="mt-2 text-[13px] text-muted">پیتزای تنوری · خمیر ۴۸ساعته</p>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="wrap py-8 md:py-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-bold md:text-2xl">چی میل دارید؟</h2>
            <Link to="/menu" className="text-sm text-brand-deep no-underline">همه منو</Link>
          </div>
          <div className="-mx-4 px-4 scroller md:mx-0 md:px-0 md:justify-between">
            {visibleCategories.map((category) => (
              <Link key={category.id} to={`/menu?cat=${category.id}`} className="flex w-[76px] shrink-0 flex-col items-center gap-2 text-ink no-underline md:w-[88px]">
                <Photo src={category.image} alt="" className="h-[76px] w-[76px] md:h-[88px] md:w-[88px]" />
                <span className="text-center text-[13px]">{category.short}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-10 md:py-14">
        <div className="mb-5 max-w-lg">
          <h2 className="text-xl font-bold md:text-2xl">محبوب‌ترین انتخاب‌ها</h2>
          <p className="mt-1 text-sm text-muted">چیزهایی که این هفته بیشتر از همه برگشته‌اند سر میز و توی سفارش.</p>
        </div>
        <div className="-mx-4 px-4 scroller lg:hidden">
          {popular.map((food) => (
            <FoodCard key={food.id} food={food} variant="scroll" />
          ))}
        </div>
        <div className="hidden gap-8 lg:grid lg:grid-cols-12">
          {popular[0] && (
            <div className="col-span-7 grid grid-cols-2 gap-4">
              <Link to={`/food/${popular[0].id}`}>
                <Photo src={popular[0].image} alt={popular[0].name} className="aspect-[4/5]" />
              </Link>
              <div className="flex flex-col justify-end pb-2">
                <p className="text-xs text-brand-deep">انتخاب این هفته</p>
                <Link to={`/food/${popular[0].id}`} className="mt-1 text-2xl font-bold text-ink no-underline">{popular[0].name}</Link>
                <p className="mt-2 text-sm leading-7 text-muted">{popular[0].description}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Price value={popular[0].price} className="font-semibold" />
                  <button type="button" className="btn btn-primary h-10 min-h-10 px-3 text-sm" onClick={() => addToCart({ food: popular[0] })}>افزودن</button>
                </div>
              </div>
            </div>
          )}
          <div className="col-span-5 divide-y divide-line">
            {popular.slice(1, 4).map((food) => (
              <div key={food.id} className="flex items-center gap-3 py-3">
                <Link to={`/food/${food.id}`}><Photo src={food.image} alt="" className="h-16 w-16 shrink-0" /></Link>
                <Link to={`/food/${food.id}`} className="min-w-0 flex-1 text-ink no-underline">
                  <span className="block font-semibold">{food.name}</span>
                  <span className="block truncate text-[13px] text-muted">{food.description}</span>
                </Link>
                <button type="button" className="btn btn-primary h-10 min-h-10 shrink-0 px-3 text-sm" onClick={() => addToCart({ food })}>افزودن</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {special && (
        <section className="bg-brand text-white">
          <div className="grid lg:grid-cols-2">
            <Photo src={special.image} alt={special.name} className="h-52 sm:h-64 lg:h-auto lg:min-h-[340px]" />
            <div className="px-5 py-8 lg:flex lg:items-center lg:px-12 lg:py-14">
              <div>
                <p className="text-sm text-white/80">پیشنهاد امروز</p>
                <h2 className="mt-2 text-[28px] font-bold leading-snug">امروز یه چیز خوشمزه مهمون ما</h2>
                <p className="mt-3 text-white/90">پیتزای مخصوص چاشنی با تخفیف ویژه امروز</p>
                <p className="mt-4 flex items-baseline gap-3 text-2xl font-bold">
                  <span>{formatPrice(roundToman(special.price * OFFER_RATE))}</span>
                  <span className="text-base font-normal text-white/75 line-through">{formatPrice(special.price)}</span>
                </p>
                <button
                  type="button"
                  className="btn mt-6 bg-white text-ink hover:bg-[#F6F1EC]"
                  onClick={() => {
                    addToCart({ food: special, offer: true })
                    navigate('/cart')
                  }}
                >
                  سفارش می‌دم
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-line">
        <div className="wrap grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((item) => {
            const Icon = ICONS[item.icon]
            return (
              <div key={item.title} className="flex gap-3">
                <Icon className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-muted">{item.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-paper">
        <div className="wrap py-12 md:py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-bold md:text-2xl">نظرات مشتریان</h2>
            <p className="text-sm text-muted">میانگین {toFa('4.8')} از ۵</p>
          </div>
          <blockquote className="mt-8 max-w-2xl">
            <p className="text-[22px] font-medium leading-relaxed md:text-[26px]">«{HOME_REVIEWS[0].text}»</p>
            <footer className="mt-3 text-sm text-muted">
              {HOME_REVIEWS[0].name} · {HOME_REVIEWS[0].area} · {HOME_REVIEWS[0].dish}
            </footer>
          </blockquote>
          <div className="mt-8 grid gap-6 border-t border-line pt-6 md:grid-cols-3">
            {HOME_REVIEWS.slice(1).map((review) => (
              <figure key={review.name}>
                <blockquote className="text-[15px] leading-8">«{review.text}»</blockquote>
                <figcaption className="mt-2 text-[13px] text-muted">
                  {review.name} · {review.area}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap grid items-center gap-8 py-12 md:py-16 lg:grid-cols-2">
        <Photo src="soltani.jpg" alt="چلوکباب سلطانی رستوران چاشنی" className="aspect-[4/3]" />
        <div>
          <p className="text-[13px] text-brand-deep">از ۱۳۹۶</p>
          <h2 className="mt-2 text-2xl font-bold">قصه چاشنی</h2>
          <p className="mt-3 text-[15px] leading-8 text-muted">
            چاشنی از یک آشپزخانه کوچک در یوسف‌آباد شروع شد؛ جایی که هنوز هم سس مخصوص را خودمان می‌گیریم و گوشت را صبح همان روز سفارش می‌دهیم. اسم‌مان از همان عادت ساده آمده: غذا باید چاشنی درست داشته باشد، نه بیشتر.
          </p>
          <p className="mt-3 text-[15px] leading-8 text-muted">
            امروز همان کار را در پلاک ۴۸ اسدآبادی می‌کنیم. منو کوتاه است، چون نمی‌خواهیم همه چیز بفروشیم.
          </p>
          <ButtonLink to="/about" variant="secondary" className="mt-5">بیشتر بخوانید</ButtonLink>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="wrap flex flex-col gap-4 py-12 sm:flex-row sm:items-end sm:justify-between md:py-16">
          <div>
            <h2 className="text-[28px] font-bold leading-snug">برای امشب چی انتخاب می‌کنی؟</h2>
            <p className="mt-2 text-sm text-muted">منو تا ساعت ۱۱ شب باز است. ارسال در یوسف‌آباد و اطراف.</p>
          </div>
          <ButtonLink to="/menu" className="sm:min-w-40">سفارش غذا</ButtonLink>
        </div>
      </section>
    </div>
  )
}
