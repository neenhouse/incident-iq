import './BarChart.css'

interface BarData {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: BarData[]
  height?: number
  label?: string
  valueFormatter?: (v: number) => string
  horizontal?: boolean
}

export function BarChart({
  data,
  height = 200,
  label,
  valueFormatter = (v) => String(v),
  horizontal = false,
}: BarChartProps) {
  if (data.length === 0) return null

  const maxVal = Math.max(...data.map((d) => d.value)) || 1

  if (horizontal) {
    return (
      <div className="bar-chart horizontal">
        {label && <div className="chart-label">{label}</div>}
        <div className="h-bars">
          {data.map((d, i) => (
            <div key={i} className="h-bar-row">
              <span className="h-bar-label">{d.label}</span>
              <div className="h-bar-track">
                <div
                  className="h-bar-fill"
                  style={{
                    width: `${(d.value / maxVal) * 100}%`,
                    background: d.color || 'var(--accent)',
                  }}
                />
              </div>
              <span className="h-bar-value">{valueFormatter(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const barWidth = Math.min(40, 500 / data.length - 8)
  const chartWidth = data.length * (barWidth + 8) + 60
  const padding = { top: 10, bottom: 40, left: 50, right: 10 }

  return (
    <div className="bar-chart">
      {label && <div className="chart-label">{label}</div>}
      <svg
        viewBox={`0 0 ${chartWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="chart-svg"
      >
        {data.map((d, i) => {
          const barHeight =
            (d.value / maxVal) * (height - padding.top - padding.bottom)
          const x = padding.left + i * (barWidth + 8)
          const y = height - padding.bottom - barHeight

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={d.color || 'var(--accent)'}
                rx="3"
                opacity="0.85"
              >
                <title>
                  {d.label}: {valueFormatter(d.value)}
                </title>
              </rect>
              <text
                x={x + barWidth / 2}
                y={height - padding.bottom + 16}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="10"
              >
                {d.label.length > 10
                  ? d.label.slice(0, 10) + '...'
                  : d.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
