import { formatBRL } from '../game/format'

export default function NetWorthChart({ history }) {
  const points = history.filter((h) => typeof h.netWorthAfter === 'number').slice(-15)
  if (points.length < 2) {
    return (
      <p className="text-chalk/40 text-xs font-body text-center py-6">
        Jogue mais algumas rodadas para ver o gráfico de evolução do patrimônio.
      </p>
    )
  }

  const width = 400
  const height = 140
  const padding = 10
  const values = points.map((p) => p.netWorthAfter)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const coords = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2)
    const y = height - padding - ((v - min) / range) * (height - padding * 2)
    return [x, y]
  })

  const pathD = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const isUp = values[values.length - 1] >= values[0]
  const lineColor = isUp ? '#7FCB9E' : '#E27676'
  const lastPoint = coords[coords.length - 1]

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-display text-sm text-chalk/70 uppercase tracking-wide">Evolução do patrimônio</p>
        <p className={`font-display text-sm ${isUp ? 'text-pitch-light' : 'text-risk'}`}>
          {isUp ? '▲' : '▼'} últimas {points.length} rodadas
        </p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" />
        {coords.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === coords.length - 1 ? 3.5 : 2} fill={lineColor} />
        ))}
        <text x={lastPoint[0]} y={lastPoint[1] - 10} textAnchor="end" fontSize="11" fill={lineColor} fontFamily="DejaVu Sans Condensed, sans-serif" fontWeight="bold">
          {formatBRL(values[values.length - 1])}
        </text>
      </svg>
    </div>
  )
}
