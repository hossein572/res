import { Link } from 'react-router-dom'
import { useStore } from '../context/Store.tsx'
import { formatLandline, formatPhone, isOpen } from '../utils/format.ts'
import { Logo } from './Logo.tsx'

export function Footer() {
  const { settings } = useStore()
  const open = isOpen()

  return (
    <footer className="bg-ink text-[#F4F1EC]">
      <div className="wrap grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-7 text-[#C8C4BE]">
            رستوران چاشنی در یوسف‌آباد. غذای روز، با مواد همان روز، بدون شلوغ‌کاری منو.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">دسترسی</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#C8C4BE]">
            <li><Link className="text-[#C8C4BE] no-underline hover:text-white" to="/menu">منوی چاشنی</Link></li>
            <li><Link className="text-[#C8C4BE] no-underline hover:text-white" to="/reserve">رزرو میز</Link></li>
            <li><Link className="text-[#C8C4BE] no-underline hover:text-white" to="/about">قصه چاشنی</Link></li>
            <li><Link className="text-[#C8C4BE] no-underline hover:text-white" to="/contact">تماس با ما</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">ساعت و تماس</h2>
          <p className="mt-3 text-sm leading-7 text-[#C8C4BE]">{settings.hours}</p>
          <p className="text-sm text-[#C8C4BE]">{open ? 'الان باز است' : 'الان بسته است'}</p>
          <p className="mt-2 text-sm text-[#C8C4BE]">سفارش: {formatPhone(settings.orderPhone)}</p>
          <p className="text-sm text-[#C8C4BE]">رستوران: {formatLandline(settings.phone)}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">آدرس</h2>
          <p className="mt-3 text-sm leading-7 text-[#C8C4BE]">{settings.address}</p>
          <p className="mt-2 text-sm text-[#C8C4BE]">اینستاگرام: {settings.instagram}</p>
          <Link to="/admin" className="mt-4 inline-block text-xs text-[#8E8A84] no-underline hover:text-white">
            پنل مدیریت
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="wrap py-4 text-xs text-[#8E8A84]">© ۱۴۰۵ رستوران چاشنی. همه حقوق محفوظ است.</p>
      </div>
    </footer>
  )
}
