import { compactToman, formatNumber } from '../utils/format.ts'

export function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((item) => item.value), 1)
  return (
    <div className="flex h-48 items-end gap-2">
      {data.map((item) => (
        <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
          <div className="flex h-full items-end">
            <div
              className="w-full bg-brand"
              style={{ height: `${Math.max(6, (item.value / max) * 100)}%` }}
              title={formatNumber(item.value)}
            />
          </div>
          <span className="truncate text-center text-[11px] text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function LineChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((item) => item.value), 1)
  const min = Math.min(...data.map((item) => item.value))
  const w = 320
  const h = 140
  const points = data.map((item, index) => {
    const x = data.length === 1 ? w / 2 : (index / (data.length - 1)) * w
    const y = h - ((item.value - min) / (max - min || 1)) * (h - 16) - 8
    return `${x},${y}`
  })
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full" role="img" aria-label="نمودار فروش">
        <polyline fill="none" stroke="#C85A3F" strokeWidth="2.5" points={points.join(' ')} />
        {points.map((point, index) => {
          const [x, y] = point.split(',')
          return <circle key={data[index].label} cx={x} cy={y} r="3.5" fill="#A84832" />
        })}
      </svg>
      <div className="mt-2 flex justify-between gap-2 text-[11px] text-muted">
        {data.map((item) => (
          <span key={item.label} className="min-w-0 truncate text-center">
            {item.label}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">بیشترین: {compactToman(max)}</p>
    </div>
  )
}

export function HBars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((item) => item.value), 1)
  return (
    <ul className="space-y-3">
      {data.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span>{item.label}</span>
            <span className="text-muted">{compactToman(item.value)}</span>
          </div>
          <div className="h-2 bg-paper">
            <div className="h-full bg-brand" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
