import { ButtonLink } from '../components/ui.tsx'
import { useTitle } from '../hooks/useTitle.ts'

export function NotFoundPage() {
  useTitle('صفحه پیدا نشد')
  return (
    <div className="wrap py-20 text-center">
      <p className="text-sm text-muted">۴۰۴</p>
      <h1 className="mt-2 text-2xl font-bold">این صفحه پیدا نشد</h1>
      <p className="mt-2 text-sm text-muted">آدرس را چک کنید یا برگردید به منو.</p>
      <div className="mt-6 flex justify-center gap-2">
        <ButtonLink to="/">خانه</ButtonLink>
        <ButtonLink to="/menu" variant="secondary">منو</ButtonLink>
      </div>
    </div>
  )
}
