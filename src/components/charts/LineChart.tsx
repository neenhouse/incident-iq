import './LineChart.css'

interface DataPoint {
  label: string
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  color?: string
  height?: number
  label?: string
  valueFormatter?: (v: number) => string
}

export function LineChart({
  data,
  color = 'var(--accent)',
  height = 200,
  label,
  valueFormatter = (v) => String(v),
}: LineChartProps) {
  if (data.length === 0) return null

  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const width = 100 // percentage-based
  const chartWidth = 600
  const chartHeight = height

  const values = data.map((d) => d.value)
  const minVal = Math.min(...values) * 0.9
  const maxVal = Math.max(...values) * 1.1
  const range = maxVal - minVal || 1

  const points = data.map((d, i) => {
    const x =
      padding.left +
      (i / (data.length - 1)) * (chartWidth - padding.left - padding.right)
    const y =
      padding.top +
      (1 - (d.value - minVal) / range) *
        (chartHeight - padding.top - padding.bottom)
    return { x, y, ...d }
  })

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z`

  // Y-axis ticks
  const yTicks = 4
  const yTickValues = Array.from(
    { length: yTicks },
    (_, i) => minVal + (range * i) / (yTicks - 1)
  )

  return (
    <div className="line-chart" style={{ width: `${width}%` }}>
      {label && <div className="chart-label">{label}</div>}
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="chart-svg"
      >
        {/* Grid lines */}
        {yTickValues.map((v, i) => {
          const y =
            padding.top +
            (1 - (v - minVal) / range) *
              (chartHeight - padding.top - padding.bottom)
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="var(--border)"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fill="var(--text-muted)"
                fontSize="11"
              >
                {valueFormatter(Math.round(v))}
              </text>
            </g>
          )
        })}

        {/* Area fill */}
        <path d={areaD} fill={color} opacity="0.1" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill={color} />
            <circle
              cx={p.x}
              cy={p.y}
              r="8"
              fill="transparent"
              className="chart-point-hover"
            >
              <title>
                {p.label}: {valueFormatter(p.value)}
              </title>
            </circle>
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={chartHeight - padding.bottom + 20}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="11"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
