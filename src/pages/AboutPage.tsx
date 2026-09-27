import { ButtonLink, Photo } from '../components/ui.tsx'
import { useTitle } from '../hooks/useTitle.ts'

export function AboutPage() {
  useTitle('درباره ما')
  return (
    <div>
      <section className="wrap grid items-center gap-8 py-8 lg:grid-cols-2 lg:py-14">
        <div>
          <p className="text-sm text-brand-deep">از ۱۳۹۶، یوسف‌آباد</p>
          <h1 className="mt-2 text-[32px] font-bold leading-snug">قصه چاشنی</h1>
          <p className="mt-4 text-[15px] leading-8 text-muted">
            سال ۱۳۹۶ یک آشپزخانه دوازده‌متری در یوسف‌آباد داشتیم و یک قابلمه سس که هنوز هم دستورش عوض نشده. اسم رستوران از همان‌جا آمد: غذا اگر چاشنی‌اش درست باشد، شلوغ‌کاری لازم ندارد.
          </p>
          <p className="mt-3 text-[15px] leading-8 text-muted">
            امروز همان سس را در پلاک ۴۸ اسدآبادی می‌گیریم. گوشت را صبح سفارش می‌دهیم، خمیر پیتزا دو روز استراحت می‌کند و برنج را با زعفرانی دم می‌کنیم که خودمان ساییده‌ایم. منو کوتاه است، چون نمی‌خواهیم همه چیز بفروشیم.
          </p>
        </div>
        <Photo src="hero.jpg" alt="میز رستوران چاشنی با پیتزای تنوری" className="aspect-[4/3]" />
      </section>
      <section className="border-y border-line bg-paper">
        <div className="wrap grid gap-6 py-10 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted">شروع</p>
            <p className="mt-1 text-xl font-bold">۱۳۹۶</p>
          </div>
          <div>
            <p className="text-sm text-muted">تیم آشپزخانه</p>
            <p className="mt-1 text-xl font-bold">۱۲ نفر</p>
          </div>
          <div>
            <p className="text-sm text-muted">ساعت کار</p>
            <p className="mt-1 text-xl font-bold">۱۲ تا ۲۳:۳۰</p>
          </div>
        </div>
      </section>
      <section className="wrap grid gap-8 py-12 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">اگر سر میز بیایید</h2>
          <p className="mt-3 text-sm leading-8 text-muted">
            پنجره سمت اسدآبادی نور ظهر را دارد. تراس عصرها شلوغ‌تر است. میز را می‌توانید از همین‌جا رزرو کنید؛ تا پانزده دقیقه بعد از ساعت، جا را نگه می‌داریم.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold">اگر سفارش بدهید</h2>
          <p className="mt-3 text-sm leading-8 text-muted">
            بسته‌بندی را جوری می‌بندیم که تا خانه سرد نشود. ارسال در یوسف‌آباد، ونک، امیرآباد و سعادت‌آباد است. بیرون از این محدوده، بهتر است خودتان تشریف بیاورید.
          </p>
        </div>
      </section>
      <div className="wrap flex flex-col gap-2 pb-12 sm:flex-row">
        <ButtonLink to="/menu">مشاهده منو</ButtonLink>
        <ButtonLink to="/reserve" variant="secondary">رزرو میز</ButtonLink>
      </div>
    </div>
  )
}
